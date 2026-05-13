import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, databaseError, parseBody } from "@/lib/api-response";
import { validateMedicationInput, type MedicationInput } from "@/lib/validations";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * GET /api/medications - List user's medications
 */
export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase.from("medications").select("*").eq("user_id", auth.userId).order("created_at", { ascending: false });
  if (error) return NextResponse.json(databaseError(error), { status: 500 });
  return NextResponse.json(successResponse({ medications: data || [] }));
}

/**
 * POST /api/medications - Create new medication
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });

  const body = await parseBody<MedicationInput>(request);
  if (!body) return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });

  const validation = validateMedicationInput(body);
  if (!validation.success) return NextResponse.json(validationError(validation.error!), { status: 400 });

  const { name, dosage, instructions, scheduleTime, frequency } = validation.data!;

  const supabase = await createClient();
  const { data, error } = await supabase.from("medications").insert({
    user_id: auth.userId,
    name,
    dosage: dosage || null,
    instructions: instructions || null,
    schedule_time: scheduleTime || null,
    frequency: frequency || null,
  }).select().single();

  if (error) return NextResponse.json(databaseError(error), { status: 500 });
  return NextResponse.json(successResponse(data), { status: 201 });
}