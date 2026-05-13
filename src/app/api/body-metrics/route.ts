import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, databaseError, parseBody } from "@/lib/api-response";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * GET /api/body-metrics - List user's body metrics
 */
export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "30");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data, error } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", auth.userId)
    .order("record_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse({ metrics: data || [] }));
}

/**
 * POST /api/body-metrics - Create body metric record
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  const body = await parseBody<{
    record_date?: string;
    weight_kg?: number | null;
    blood_pressure_systolic?: number | null;
    blood_pressure_diastolic?: number | null;
    notes?: string | null;
  }>(request);
  if (!body) {
    return NextResponse.json(errorResponse("Dữ liệu không hợp lệ", "VALIDATION_ERROR"), { status: 400 });
  }

  const { record_date, weight_kg, blood_pressure_systolic, blood_pressure_diastolic, notes } = body;

  if (!record_date) {
    return NextResponse.json(errorResponse("Ngày ghi nhận là bắt buộc", "VALIDATION_ERROR"), { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("body_metrics")
    .insert({
      user_id: auth.userId,
      record_date,
      weight_kg: weight_kg || null,
      blood_pressure_systolic: blood_pressure_systolic || null,
      blood_pressure_diastolic: blood_pressure_diastolic || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse(data), { status: 201 });
}