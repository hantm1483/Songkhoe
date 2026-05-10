import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, notFoundError, databaseError, parseBody } from "@/lib/api-response";
import { validateMealInput, type MealInput } from "@/lib/validations";

/**
 * GET /api/meals/[id] - Get single meal
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
    .from("meals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(notFoundError("Bữa ăn"), { status: 404 });
    }
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data));
}

/**
 * PATCH /api/meals/[id] - Update meal
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
    .from("meals")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json(notFoundError("Bữa ăn"), { status: 404 });
  }

  const body = await parseBody<MealInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateMealInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { name, giLevel, notes, time } = validation.data!;

  const { data, error } = await supabase
    .from("meals")
    .update({
      name,
      gi_level: giLevel || null,
      notes: notes || null,
      time: time || null,
      updated_at: new Date().toISOString(),
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
 * DELETE /api/meals/[id] - Delete meal
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
    .from("meals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ deleted: true }));
}