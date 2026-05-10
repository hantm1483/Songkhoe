import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, notFoundError, databaseError, parseBody } from "@/lib/api-response";
import { validateMemorialPhotoInput, type MemorialPhotoInput } from "@/lib/validations";

/**
 * GET /api/memorial/photos/[id] - Get single memorial photo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("memorial_photos")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(notFoundError("Hình ảnh kỷ niệm"), { status: 404 });
    }
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data));
}

/**
 * PATCH /api/memorial/photos/[id] - Update memorial photo
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { id } = await params;

  const { data: existing } = await supabase
    .from("memorial_photos")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json(notFoundError("Hình ảnh kỷ niệm"), { status: 404 });
  }

  const body = await parseBody<MemorialPhotoInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateMemorialPhotoInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { title, description, date } = validation.data!;

  const { data, error } = await supabase
    .from("memorial_photos")
    .update({
      title: title || null,
      description: description || null,
      date: date || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data));
}

/**
 * DELETE /api/memorial/photos/[id] - Delete memorial photo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("memorial_photos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ deleted: true }));
}