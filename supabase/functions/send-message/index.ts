/**
 * Send Message Edge Function
 * Handles AI chat messages with Tâm assistant
 *
 * Receives: conversation_id, message, idempotency_key
 * Returns: AI response from Claude
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt for Tâm assistant - Vietnamese, diabetes-focused elderly companion
const SYSTEM_PROMPT = `Bạn là "Tâm", một trợ lý sức khỏe đồng hành cho người cao tuổi Việt Nam bị tiểu đường.
Bạn ấm áp, kiên nhẫn, và luôn đặt sự thoải mái của người dùng lên hàng đầu.
Không bao giờ đưa ra chẩn đoán y tế - luôn khuyên họ đến gặp bác sĩ cho các vấn đề nghiêm trọng.
Trả lời ngắn gọn, dễ hiểu, tránh thuật ngữ y khoa phức tạp.
Luôn ủng hộ lối sống lành mạnh và tích cực.`;

// Medical patterns to filter from AI responses
const FILTERED_PATTERNS = [
  /liều\s*\d+\s*(mg|mg\/ngày|viên|đơn vị)/gi,
  /uống\s*\d+\s*(mg|viên)/gi,
  /chẩn đoán.*tiểu đường/gi,
  /bạn\s+bị\s+tiểu đường/gi,
  /mắc\s+tiểu đường/gi,
  /loại\s*tiểu đường\s*type\s*[12]/gi,
  /điều trị\s+bằng\s+thuốc/gi,
  /thuốc\s+(metformin|insulin|glipizide|diamicron)/gi,
  /^tôi\s+là\s+bác\s+sĩ/gi,
  /xét nghiệm\s+hba1c\s*<=\s*7/gi,
];

const FALLBACK_RESPONSE = "Vui lòng hỏi bác sĩ về vấn đề này để được tư vấn chính xác nhất.";

/**
 * Filter medical content from AI response
 */
function filterMedicalContent(text: string): string {
  for (const pattern of FILTERED_PATTERNS) {
    if (pattern.test(text)) {
      console.log("Filtered medical content:", text.substring(0, 100));
      return FALLBACK_RESPONSE;
    }
  }
  return text;
}

/**
 * Check rate limit for user
 */
async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const limit = 50;
  const windowMs = 3600000; // 1 hour
  const windowStart = new Date(Date.now() - windowMs);

  const { data, error } = await supabase.rpc("atomic_rate_increment", {
    p_user_id: userId,
    p_action: "aiChat",
    p_window_start: windowStart.toISOString(),
  });

  if (error) {
    console.warn("Rate limit check failed:", error.message);
    return { allowed: true, remaining: limit, resetAt: new Date(Date.now() + windowMs) };
  }

  const count = data?.count ?? 0;
  const remaining = Math.max(0, limit - count);

  return {
    allowed: count <= limit,
    remaining,
    resetAt: new Date(Date.now() + windowMs),
  };
}

/**
 * Fetch conversation history
 */
async function getConversationHistory(
  supabase: ReturnType<typeof createClient>,
  conversationId: string,
  limit: number = 10
): Promise<Array<{ role: string; content: string }>> {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch messages:", error.message);
    return [];
  }

  return (data || []).map((m) => ({
    role: m.role || "user",
    content: m.content,
  }));
}

/**
 * Call Claude API with retry
 */
async function callClaudeApi(
  messages: Array<{ role: string; content: string }>,
  signal: AbortSignal
): Promise<string> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const maxRetries = 2;
  const baseDelay = 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
        signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Claude API error:", response.status, errorBody);

        if (attempt < maxRetries && response.status >= 500) {
          await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
          continue;
        }

        throw new Error(`Claude API error: ${response.status}`);
      }

      const result = await response.json();
      return result.content?.[0]?.text || "Xin lỗi, tôi không thể trả lời lúc này.";
    } catch (error) {
      if (attempt < maxRetries && error.name !== "AbortError") {
        await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
        continue;
      }
      throw error;
    }
  }

  throw new Error("Max retries exceeded");
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversation_id, message, idempotency_key } = await req.json();

    if (!conversation_id || !message) {
      return new Response(
        JSON.stringify({ error: "conversation_id and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get conversation to find user_id
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("user_id")
      .eq("id", conversation_id)
      .single();

    if (convError || !conversation) {
      return new Response(
        JSON.stringify({ error: "Conversation not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = conversation.user_id;

    // Check rate limit
    const { allowed, remaining, resetAt } = await checkRateLimit(supabase, userId);
    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Bạn đã gửi quá nhiều tin nhắn. Vui lòng chờ vài phút.",
          code: "RATE_LIMITED",
          reset_at: resetAt.toISOString(),
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check idempotency - don't process duplicate requests
    if (idempotency_key) {
      const { data: existing } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversation_id)
        .like("content", `%${idempotency_key}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log("Duplicate request detected:", idempotency_key);
      }
    }

    // Save user message first (transaction safety)
    const { data: userMessage, error: userMsgError } = await supabase
      .from("messages")
      .insert({
        conversation_id,
        role: "user",
        content: message,
      })
      .select()
      .single();

    if (userMsgError) {
      console.error("Failed to save user message:", userMsgError.message);
      return new Response(
        JSON.stringify({ error: "Failed to save message" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get conversation history (last 10 messages)
    const history = await getConversationHistory(supabase, conversation_id, 10);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      // Call Claude API
      const aiResponse = await callClaudeApi(history, controller.signal);

      // Filter medical content
      const filteredResponse = filterMedicalContent(aiResponse);

      // Save AI response
      const { data: assistantMessage, error: assistantMsgError } = await supabase
        .from("messages")
        .insert({
          conversation_id,
          role: "assistant",
          content: filteredResponse,
        })
        .select()
        .single();

      if (assistantMsgError) {
        console.error("Failed to save assistant message:", assistantMsgError.message);
      }

      return new Response(
        JSON.stringify({
          message: assistantMessage,
          remaining,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);

      console.error("AI processing error:", error.message);

      // Return friendly error message
      const errorMsg = error.name === "AbortError"
        ? "Tâm đang bận, vui lòng thử lại sau"
        : "Đã xảy ra lỗi. Vui lòng thử lại.";

      return new Response(
        JSON.stringify({ error: errorMsg }),
        {
          status: error.name === "AbortError" ? 503 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Request error:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});