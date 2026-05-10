import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, databaseError, parseBody } from "@/lib/api-response";
import { validateMemorialQuoteInput, type MemorialQuoteInput } from "@/lib/validations";

/**
 * GET /api/memorial/quotes - List user's memorial quotes
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { data, error } = await supabase
    .from("memorial_quotes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ quotes: data || [] }));
}

/**
 * POST /api/memorial/quotes - Create new memorial quote
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const body = await parseBody<MemorialQuoteInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateMemorialQuoteInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { content, author } = validation.data!;

  const { data, error } = await supabase.from("memorial_quotes").insert({
    user_id: user.id,
    content,
    author: author || null,
  }).select().single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}