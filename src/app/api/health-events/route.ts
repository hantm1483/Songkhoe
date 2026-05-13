import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, databaseError, parseBody } from "@/lib/api-response";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * GET /api/health-events - List user's health events
 */
export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data, error } = await supabase
    .from("health_events")
    .select("*")
    .eq("user_id", auth.userId)
    .order("event_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse({ events: data || [] }));
}

/**
 * POST /api/health-events - Create health event
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  const body = await parseBody<{
    event_type?: string;
    title?: string;
    event_date?: string;
    description?: string | null;
  }>(request);
  if (!body) {
    return NextResponse.json(errorResponse("Dữ liệu không hợp lệ", "VALIDATION_ERROR"), { status: 400 });
  }

  const { event_type, title, event_date, description } = body;

  if (!title || !event_date) {
    return NextResponse.json(errorResponse("Tiêu đề và ngày là bắt buộc", "VALIDATION_ERROR"), { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("health_events")
    .insert({
      user_id: auth.userId,
      event_type: event_type || "Theo dõi",
      title,
      event_date,
      description: description || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json(databaseError(error), { status: 500 });

  return NextResponse.json(successResponse(data), { status: 201 });
}