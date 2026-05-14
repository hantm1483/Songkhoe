import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, notFoundError, databaseError } from "@/lib/api-response";
import { LAB_RESULT_TYPE_OPTIONS } from "@/lib/validations";

/**
 * GET /api/lab-results/[id] - Get single lab result
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
    .from("lab_results")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(notFoundError("Kết quả xét nghiệm"), { status: 404 });
    }
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data));
}

/**
 * PATCH /api/lab-results/[id] - Update lab result (partial update supported)
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
    .from("lab_results")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json(notFoundError("Kết quả xét nghiệm"), { status: 404 });
  }

  const body = await request.json();

  // Partial update: only validate provided fields
  const updateData: Record<string, unknown> = {};
  const errors: string[] = [];

  if (body.type !== undefined) {
    if (!LAB_RESULT_TYPE_OPTIONS.includes(body.type)) {
      errors.push("Loại xét nghiệm không hợp lệ");
    } else {
      updateData.type = body.type;
    }
  }

  if (body.value !== undefined) {
    if (typeof body.value !== "number" || body.value < 0 || body.value > 10000) {
      errors.push("Giá trị xét nghiệm không hợp lệ");
    } else {
      updateData.value = body.value;
    }
  }

  if (body.unit !== undefined) {
    updateData.unit = typeof body.unit === "string" ? body.unit : null;
  }

  if (body.recordedAt !== undefined) {
    updateData.recorded_at = typeof body.recordedAt === "string" ? body.recordedAt : null;
  }

  if (body.notes !== undefined) {
    updateData.notes = typeof body.notes === "string" ? body.notes : null;
  }

  if (errors.length > 0) {
    return NextResponse.json(validationError(errors.join(", ")), { status: 400 });
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(successResponse(existing));
  }

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("lab_results")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data));
}

/**
 * DELETE /api/lab-results/[id] - Delete lab result
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
    .from("lab_results")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ deleted: true }));
}