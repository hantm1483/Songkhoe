import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, notFoundError, databaseError, parseBody } from "@/lib/api-response";
import { validateLabResultInput, type LabResultInput } from "@/lib/validations";

/**
 * GET /api/lab-results - List user's lab results
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let query = supabase
    .from("lab_results")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ results: data || [] }));
}

/**
 * POST /api/lab-results - Create new lab result
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const body = await parseBody<LabResultInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateLabResultInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { type, value, unit, recordedAt, notes } = validation.data!;

  const { data, error } = await supabase.from("lab_results").insert({
    user_id: user.id,
    type,
    value,
    unit: unit || null,
    recorded_at: recordedAt || new Date().toISOString(),
    notes: notes || null,
  }).select().single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}