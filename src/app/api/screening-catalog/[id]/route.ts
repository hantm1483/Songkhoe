import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, databaseError, parseBody } from "@/lib/api-response";
import { validateScreeningCatalogInput, type ScreeningCatalogInput } from "@/lib/validations";
import { getAuthContext } from "@/lib/supabase/auth-helper";

/**
 * PUT /api/screening-catalog/[id] - Update catalog item
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  // Demo users cannot update
  if (auth.isDemo) {
    return NextResponse.json(errorResponse("Demo không hỗ trợ cập nhật", "DEMO_NOT_SUPPORTED"), { status: 403 });
  }

  const body = await parseBody<ScreeningCatalogInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateScreeningCatalogInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { content, target, frequency, meaning } = validation.data!;
  const { id } = params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("screening_catalog")
    .update({
      content,
      target: target || null,
      frequency: frequency || null,
      meaning: meaning || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", auth.userId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(errorResponse("Không tìm thấy mục tầm soát", "NOT_FOUND"), { status: 404 });
    }
    if (error.code === "23505") {
      return NextResponse.json(
        errorResponse("Nội dung này đã tồn tại trong danh mục của bạn", "DUPLICATE_ERROR"),
        { status: 409 }
      );
    }
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data));
}

/**
 * DELETE /api/screening-catalog/[id] - Delete catalog item
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
  }

  // Demo users cannot delete
  if (auth.isDemo) {
    return NextResponse.json(errorResponse("Demo không hỗ trợ xóa", "DEMO_NOT_SUPPORTED"), { status: 403 });
  }

  const { id } = params;

  const supabase = await createClient();
  const { error } = await supabase
    .from("screening_catalog")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(errorResponse("Không tìm thấy mục tầm soát", "NOT_FOUND"), { status: 404 });
    }
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ deleted: true }));
}