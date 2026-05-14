import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, databaseError, parseBody } from "@/lib/api-response";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * PATCH /api/activity-schedules/[id] - Update activity schedule
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });

  const { id } = await params;

  const body = await parseBody<{
    activity_name?: string;
    scheduled_date?: string;
    scheduled_time?: string | null;
    duration_minutes?: number;
    calories_burned?: number | null;
    completed?: boolean;
    notes?: string | null;
  }>(request);

  if (!body) return NextResponse.json(errorResponse("Dữ liệu không hợp lệ", "VALIDATION_ERROR"), { status: 400 });

  const supabase = auth.isDemo ? await createAdminClient() : await createClient();

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {};
  if (body.activity_name !== undefined) updateData.activity_name = body.activity_name;
  if (body.scheduled_date !== undefined) updateData.scheduled_date = body.scheduled_date;
  if (body.scheduled_time !== undefined) updateData.scheduled_time = body.scheduled_time;
  if (body.duration_minutes !== undefined) updateData.duration_minutes = body.duration_minutes;
  if (body.calories_burned !== undefined) updateData.calories_burned = body.calories_burned;
  if (body.completed !== undefined) updateData.completed = body.completed;
  if (body.notes !== undefined) updateData.notes = body.notes;

  const { data, error } = await supabase
    .from("activity_schedules")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", auth.userId)
    .select()
    .single();

  if (error) return NextResponse.json(databaseError(error), { status: 500 });
  return NextResponse.json(successResponse(data));
}

/**
 * DELETE /api/activity-schedules/[id] - Delete activity schedule
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });

  const { id } = await params;

  const supabase = auth.isDemo ? await createAdminClient() : await createClient();

  const { error } = await supabase
    .from("activity_schedules")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) return NextResponse.json(databaseError(error), { status: 500 });
  return NextResponse.json(successResponse({ deleted: true }));
}