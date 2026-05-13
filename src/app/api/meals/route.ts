import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, databaseError, parseBody } from "@/lib/api-response";
import { validateMealInput, type MealInput } from "@/lib/validations";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * GET /api/meals - List user's meals
 */
export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", auth.userId)
    .order("time", { ascending: false });

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse({ meals: data || [] }));
}

/**
 * POST /api/meals - Create new meal
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
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

  const supabase = await createClient();
  const { data, error } = await supabase.from("meals").insert({
    user_id: auth.userId,
    name,
    gi_level: giLevel || null,
    notes: notes || null,
    time: time || new Date().toISOString(),
  }).select().single();

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse(data), { status: 201 });
}