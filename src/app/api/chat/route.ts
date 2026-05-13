/**
 * Chat API Route
 * POST /api/chat - Send message to Tâm assistant
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, notFoundError, parseBody } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { getAuthContext } from "@/lib/supabase/auth-helper";

interface SendMessageInput {
  conversation_id: string;
  message: string;
  idempotency_key?: string;
}

function validateSendMessageInput(data: unknown): { success: boolean; data?: SendMessageInput; error?: string } {
  if (typeof data !== "object" || data === null) return { success: false, error: "Dữ liệu không hợp lệ" };
  const input = data as Record<string, unknown>;
  if (typeof input.conversation_id !== "string" || input.conversation_id.trim() === "") return { success: false, error: "conversation_id là bắt buộc" };
  if (typeof input.message !== "string" || input.message.trim() === "") return { success: false, error: "message là bắt buộc" };
  if (input.message.length > 5000) return { success: false, error: "Tin nhắn quá dài (tối đa 5000 ký tự)" };
  return { success: true, data: { conversation_id: input.conversation_id as string, message: input.message as string, idempotency_key: input.idempotency_key as string | undefined } };
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });

  const body = await parseBody<SendMessageInput>(request);
  if (!body) return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });

  const validation = validateSendMessageInput(body);
  if (!validation.success) return NextResponse.json(validationError(validation.error!), { status: 400 });

  const { conversation_id, message, idempotency_key } = validation.data!;

  const supabase = await createClient();
  const { data: conversation, error: convError } = await supabase.from("conversations").select("id, user_id").eq("id", conversation_id).single();
  if (convError || !conversation) return NextResponse.json(notFoundError("Cuộc trò chuyện"), { status: 404 });
  if (conversation.user_id !== auth.userId) return NextResponse.json(errorResponse("Không có quyền truy cập", "UNAUTHORIZED"), { status: 401 });

  const { allowed, resetAt } = await checkRateLimit(auth.userId, "aiChat");
  if (!allowed) {
    const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
    return NextResponse.json(errorResponse("Bạn đã gửi quá nhiều tin nhắn. Vui lòng chờ vài phút.", "RATE_LIMITED"), { status: 429, headers: { "Retry-After": retryAfter.toString() } });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const edgeFunctionResponse = await fetch(`${supabaseUrl}/functions/v1/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseAnonKey}` },
      body: JSON.stringify({ conversation_id, message, idempotency_key }),
    });
    const result = await edgeFunctionResponse.json();
    if (!edgeFunctionResponse.ok) return NextResponse.json(errorResponse(result.error || "Không thể gửi tin nhắn", "EDGE_FUNCTION_ERROR"), { status: edgeFunctionResponse.status });
    return NextResponse.json(successResponse({ message: result.message }), { status: 200 });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(errorResponse("Đã xảy ra lỗi. Vui lòng thử lại.", "INTERNAL_ERROR"), { status: 500 });
  }
}