import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, notFoundError, databaseError, parseBody } from "@/lib/api-response";
import { validateMedicationLogInput, type MedicationLogInput } from "@/lib/validations";

/**
 * POST /api/medications/[id]/log - Log medication taken
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { id } = await params;

  // Check medication ownership
  const { data: medication, error: medError } = await supabase
    .from("medications")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (medError || !medication) {
    return NextResponse.json(notFoundError("Thuốc"), { status: 404 });
  }

  const body = await parseBody<MedicationLogInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateMedicationLogInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { status, notes } = validation.data!;

  const { data, error } = await supabase.from("medication_logs").insert({
    medication_id: id,
    user_id: user.id,
    taken_at: new Date().toISOString(),
    status,
    notes: notes || null,
  }).select().single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}