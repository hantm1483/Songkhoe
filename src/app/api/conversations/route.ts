import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, databaseError, parseBody } from "@/lib/api-response";
import { validateConversationInput, type ConversationInput } from "@/lib/validations";

/**
 * GET /api/conversations - List user's conversations with metadata
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  // Get conversations with last message info and message count
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      id,
      created_at,
      messages (
        id,
        role,
        content,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  // Transform to include metadata
  const result = (conversations || []).map((conv) => {
    const messages = conv.messages as Array<{ id: string; role: string; content: string; created_at: string }> || [];
    const messageCount = messages.length;
    const lastMessage = messages[0]; // Already ordered by created_at in query if we add it

    return {
      id: conv.id,
      created_at: conv.created_at,
      message_count: messageCount,
      last_message: lastMessage ? {
        role: lastMessage.role,
        content: lastMessage.content.substring(0, 100),
        created_at: lastMessage.created_at,
      } : null,
    };
  });

  return NextResponse.json(successResponse({ conversations: result }));
}

/**
 * POST /api/conversations - Create new conversation
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const body = await parseBody<ConversationInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateConversationInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { data, error } = await supabase.from("conversations").insert({
    user_id: user.id,
  }).select().single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}