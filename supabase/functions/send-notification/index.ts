/**
 * Send Notification Edge Function
 * Triggered by pg_cron every minute
 * Sends push notifications to users based on their schedules
 *
 * Query: notification_schedules for active schedules at current time
 * Sends: Web Push via push_subscriptions table
 * Updates: last_sent_at after successful send
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Web Push vapid keys (configure in Supabase dashboard)
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";

/**
 * Encode base64url for Web Push
 */
function urlBase64Encode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Encrypt payload for Web Push
 */
async function encrypt_payload(
  payload: string,
  p256dh: string,
  auth: string
): Promise<ArrayBuffer> {
  const crypto = window.crypto;
  const enc = new TextEncoder();
  const key = enc.encode(payload);

  // Simple XOR encryption (for demo - use proper encryption in production)
  const encrypted = new Uint8Array(key.length);
  for (let i = 0; i < key.length; i++) {
    encrypted[i] = key[i] ^ (auth.charCodeAt(i % auth.length) || 0);
  }

  return encrypted.buffer;
}

/**
 * Send push notification to a subscription
 */
async function sendPushNotification(
  endpoint: string,
  payload: string
): Promise<boolean> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "TTL": "60",
        "Authorization": ` vapid t=${VAPID_PUBLIC_KEY}`,
      },
      body: payload,
    });

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Push notification failed:", error.message);
    return false;
  }
}

/**
 * Process notification schedule
 */
async function processSchedule(
  supabase: ReturnType<typeof createClient>,
  schedule: {
    id: string;
    user_id: string;
    medication_id: string | null;
    scheduled_time: string;
    medication_name?: string;
  }
): Promise<boolean> {
  const { medication_id, medication_name } = schedule;

  // Get active push subscriptions for user
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", schedule.user_id);

  if (!subscriptions || subscriptions.length === 0) {
    console.log("No subscriptions for user:", schedule.user_id);
    return false;
  }

  // Prepare notification message
  let title = "Nhắc nhở uống thuốc";
  let body = medication_name
    ? `Đã đến giờ uống ${medication_name}`
    : "Đã đến giờ uống thuốc!";

  if (medication_id) {
    const { data: med } = await supabase
      .from("medications")
      .select("name, instructions")
      .eq("id", medication_id)
      .single();

    if (med) {
      body = med.instructions
        ? `Đã đến giờ uống ${med.name}. ${med.instructions}`
        : `Đã đến giờ uống ${med.name}`;
    }
  }

  // Send to all subscriptions
  const payload = JSON.stringify({ title, body, icon: "/icon.png" });
  let anySuccess = false;

  for (const sub of subscriptions) {
    const success = await sendPushNotification(sub.endpoint, payload);
    if (success) {
      anySuccess = true;
    } else {
      // Check if subscription is no longer valid
      try {
        const testResponse = await fetch(sub.endpoint, { method: "HEAD" });
        if (testResponse.status === 410) {
          // Subscription expired, remove it
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("id", sub.id});
        }
      } catch {
        // Network error, skip this subscription
      }
    }
  }

  // Update last_sent_at
  if (anySuccess) {
    await supabase
      .from("notification_schedules")
      .update({ last_sent_at: new Date().toISOString() })
      .eq("id", schedule.id);
  }

  return anySuccess;
}

/**
 * Get active schedules for current time
 */
async function getActiveSchedules(
  supabase: ReturnType<typeof createClient>
): Promise<Array<{
  id: string;
  user_id: string;
  medication_id: string | null;
  scheduled_time: string;
  medication_name?: string;
}>> {
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, "0");
  const currentMinute = now.getMinutes().toString().padStart(2, "0");
  const currentTime = `${currentHour}:${currentMinute}`;

  // Get schedules that match current time and are active
  const { data: schedules } = await supabase
    .from("notification_schedules")
    .select(`
      id,
      user_id,
      medication_id,
      scheduled_time,
      is_active,
      medications (name)
    `)
    .eq("is_active", true)
    .eq("scheduled_time", currentTime);

  if (!schedules || schedules.length === 0) {
    return [];
  }

  return schedules.map((s: Record<string, unknown>) => ({
    id: s.id as string,
    user_id: s.user_id as string,
    medication_id: s.medication_id as string | null,
    scheduled_time: s.scheduled_time as string,
    medication_name: (s.medications as { name?: string })?.name,
  }));
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify cron secret
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== Deno.env.get("CRON_SECRET")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get active schedules for current time
    const schedules = await getActiveSchedules(supabase);

    if (schedules.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: "No active schedules" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process each schedule
    let processed = 0;
    let successful = 0;

    for (const schedule of schedules) {
      // Skip if already sent in this hour
      const lastSent = await supabase
        .from("notification_schedules")
        .select("last_sent_at")
        .eq("id", schedule.id)
        .single();

      if (lastSent.data?.last_sent_at) {
        const lastSentDate = new Date(lastSent.data.last_sent_at);
        const now = new Date();
        if (
          lastSentDate.getHours() === now.getHours() &&
          lastSentDate.getDate() === now.getDate()
        ) {
          continue;
        }
      }

      const success = await processSchedule(supabase, schedule);
      processed++;
      if (success) successful++;
    }

    return new Response(
      JSON.stringify({ processed, successful }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Notification error:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});