import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, databaseError, parseBody } from "@/lib/api-response";

/**
 * GET /api/health-events - List user's health events
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data, error } = await supabase
    .from("health_events")
    .select("*")
    .eq("user_id", user.id)
    .order("event_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ events: data || [] }));
}

/**
 * POST /api/health-events - Create health event
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await parseBody<{
    event_type?: string;
    title?: string;
    event_date?: string;
    description?: string | null;
  }>(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { event_type, title, event_date, description } = body;

  if (!title || !event_date) {
    return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("health_events")
    .insert({
      user_id: user.id,
      event_type: event_type || "Theo dõi",
      title,
      event_date,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}