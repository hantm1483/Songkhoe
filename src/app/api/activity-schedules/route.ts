import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, databaseError, parseBody } from "@/lib/api-response";

/**
 * GET /api/activity-schedules - List user's activity schedules
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data, error } = await supabase
    .from("activity_schedules")
    .select("*")
    .eq("user_id", user.id)
    .order("scheduled_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ schedules: data || [] }));
}

/**
 * POST /api/activity-schedules - Create activity schedule
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await parseBody<{
    activity_name?: string;
    scheduled_date?: string;
    scheduled_time?: string | null;
    duration_minutes?: number;
    calories_burned?: number | null;
    notes?: string | null;
  }>(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { activity_name, scheduled_date, scheduled_time, duration_minutes, calories_burned, notes } = body;

  if (!activity_name || !scheduled_date) {
    return NextResponse.json({ error: "Activity name and date are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("activity_schedules")
    .insert({
      user_id: user.id,
      activity_name,
      scheduled_date,
      scheduled_time: scheduled_time || null,
      duration_minutes: duration_minutes || 30,
      calories_burned: calories_burned || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}