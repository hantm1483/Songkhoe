import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, databaseError, parseBody } from "@/lib/api-response";
import { validateMemorialStoryInput, type MemorialStoryInput } from "@/lib/validations";

/**
 * GET /api/memorial/stories - List user's memorial stories
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { data, error } = await supabase
    .from("memorial_stories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ stories: data || [] }));
}

/**
 * POST /api/memorial/stories - Create new memorial story
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const body = await parseBody<MemorialStoryInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateMemorialStoryInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { title, content, date } = validation.data!;

  const { data, error } = await supabase.from("memorial_stories").insert({
    user_id: user.id,
    title,
    content,
    date: date || null,
  }).select().single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}