import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, notFoundError, databaseError, parseBody } from "@/lib/api-response";
import { validateGlucoseLogInput, type GlucoseLogInput } from "@/lib/validations";

/**
 * GET /api/glucose - List user's glucose logs
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  // Parse query params
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Build query
  let query = supabase
    .from("glucose_logs")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("measured_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (startDate) {
    query = query.gte("measured_at", startDate);
  }
  if (endDate) {
    query = query.lte("measured_at", endDate);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ logs: data || [], count }));
}

/**
 * POST /api/glucose - Create new glucose log
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  // Validate input
  const body = await parseBody<GlucoseLogInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateGlucoseLogInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { value, timing, notes, measuredAt } = validation.data!;

  // Insert glucose log
  const { data, error } = await supabase.from("glucose_logs").insert({
    user_id: user.id,
    value,
    unit: "mg/dL",
    timing: timing || null,
    notes: notes || null,
    measured_at: measuredAt || new Date().toISOString(),
  }).select().single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}