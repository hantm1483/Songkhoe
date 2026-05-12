import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, databaseError, parseBody } from "@/lib/api-response";

/**
 * GET /api/body-metrics - List user's body metrics
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "30");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data, error } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("record_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ metrics: data || [] }));
}

/**
 * POST /api/body-metrics - Create body metric record
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await parseBody<{
    record_date?: string;
    weight_kg?: number | null;
    blood_pressure_systolic?: number | null;
    blood_pressure_diastolic?: number | null;
    notes?: string | null;
  }>(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { record_date, weight_kg, blood_pressure_systolic, blood_pressure_diastolic, notes } = body;

  if (!record_date) {
    return NextResponse.json({ error: "Record date is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("body_metrics")
    .insert({
      user_id: user.id,
      record_date,
      weight_kg: weight_kg || null,
      blood_pressure_systolic: blood_pressure_systolic || null,
      blood_pressure_diastolic: blood_pressure_diastolic || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}