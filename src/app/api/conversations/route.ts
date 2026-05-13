import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, databaseError, parseBody } from "@/lib/api-response";
import { validateConversationInput, type ConversationInput } from "@/lib/validations";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * GET /api/conversations - List user's conversations with metadata
 */
export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });

  const supabase = await createClient();
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`id, created_at, messages (id, role, content, created_at)`)
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  const result = (conversations || []).map((conv) => {
    const messages = conv.messages as Array<{ id: string; role: string; content: string; created_at: string }> || [];
    return {
      id: conv.id,
      created_at: conv.created_at,
      message_count: messages.length,
      last_message: messages[0] ? { role: messages[0].role, content: messages[0].content.substring(0, 100), created_at: messages[0].created_at } : null,
    };
  });

  return NextResponse.json(successResponse({ conversations: result }));
}

/**
 * POST /api/conversations - Create new conversation
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });

  const body = await parseBody<ConversationInput>(request);
  if (!body) return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });

  const validation = validateConversationInput(body);
  if (!validation.success) return NextResponse.json(validationError(validation.error!), { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.from("conversations").insert({ user_id: auth.userId }).select().single();
  if (error) return NextResponse.json(databaseError(error), { status: 500 });
  return NextResponse.json(successResponse(data), { status: 201 });
}