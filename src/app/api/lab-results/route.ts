import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, databaseError, parseBody } from "@/lib/api-response";
import { validateLabResultInput, type LabResultInput } from "@/lib/validations";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * GET /api/lab-results - List user's lab results
 */
export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let query = supabase
    .from("lab_results")
    .select("*")
    .eq("user_id", auth.userId)
    .order("recorded_at", { ascending: false });

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse({ results: data || [] }));
}

/**
 * POST /api/lab-results - Create new lab result
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
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

  const supabase = await createClient();
  const { data, error } = await supabase.from("lab_results").insert({
    user_id: auth.userId,
    type,
    value,
    unit: unit || null,
    recorded_at: recordedAt || new Date().toISOString(),
    notes: notes || null,
  }).select().single();

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse(data), { status: 201 });
}