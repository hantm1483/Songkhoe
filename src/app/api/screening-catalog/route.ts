import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, databaseError, parseBody } from "@/lib/api-response";
import { validateScreeningCatalogInput, type ScreeningCatalogInput } from "@/lib/validations";
import { getAuthContext } from "@/lib/supabase/auth-helper";
import type { ScreeningCatalog } from "@/lib/supabase/database.types";

/**
 * Default catalog items for demo users
 */
const DEFAULT_CATALOG: Omit<ScreeningCatalog, "id" | "user_id" | "created_at" | "updated_at">[] = [
  { content: "HbA1c", target: "< 7.0%", frequency: "Mỗi 3-6 tháng", meaning: "Đánh giá kiểm soát đường huyết trong 3 tháng qua." },
  { content: "Đường huyết lúc đói", target: "3.9 - 7.2 mmol/L", frequency: "Hàng ngày / Định kỳ", meaning: "Kiểm soát đường huyết tại thời điểm đo." },
  { content: "Huyết áp", target: "< 130/80 mmHg", frequency: "Mỗi lần thăm khám", meaning: "Giảm nguy cơ đột quỵ và biến chứng tim mạch." },
  { content: "Soi đáy mắt", target: "Không tổn thương", frequency: "Định kỳ 12 tháng", meaning: "Phát hiện sớm biến chứng võng mạc gây mù lòa." },
  { content: "Protein niệu (Thận)", target: "Âm tính", frequency: "Định kỳ 12 tháng", meaning: "Phát hiện sớm dấu hiệu suy thận do tiểu đường." },
];

/**
 * GET /api/screening-catalog - List user's screening catalog
 */
export async function GET(request: NextRequest) {
  try {
    let auth;
    try {
      auth = await getAuthContext();
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return NextResponse.json(errorResponse("Lỗi xác thực", "AUTH_ERROR"), { status: 401 });
    }

    if (!auth) {
      return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
    }

    // Demo users get default catalog
    if (auth.isDemo) {
      return NextResponse.json(successResponse({ catalog: DEFAULT_CATALOG, isDefault: true }));
    }

    let supabase;
    try {
      supabase = await createClient();
    } catch (supabaseErr) {
      console.error("Supabase client error:", supabaseErr);
      return NextResponse.json(errorResponse("Lỗi kết nối cơ sở dữ liệu", "DB_CONNECTION_ERROR"), { status: 500 });
    }

    const { data, error } = await supabase
      .from("screening_catalog")
      .select("*")
      .eq("user_id", auth.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Screening catalog query error:", error);
      return NextResponse.json(databaseError(error), { status: 500 });
    }

    // Use default catalog if user has no custom items
    if (!data || data.length === 0) {
      return NextResponse.json(successResponse({ catalog: DEFAULT_CATALOG, isDefault: true }));
    }

    return NextResponse.json(successResponse({ catalog: data, isDefault: false }));
  } catch (err) {
    console.error("Screening catalog GET error:", err);
    return NextResponse.json(errorResponse("Lỗi server", "SERVER_ERROR"), { status: 500 });
  }
}

/**
 * POST /api/screening-catalog - Create new catalog item
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(errorResponse("Không thể xác định người dùng", "AUTH_ERROR"), { status: 401 });
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

  // Demo users get pseudo-catalog
  if (auth.isDemo) {
    const exists = DEFAULT_CATALOG.some(
      (item) => item.content.toLowerCase() === content.toLowerCase()
    );
    if (exists) {
      return NextResponse.json(
        errorResponse("Nội dung này đã tồn tại trong danh mục mặc định", "DUPLICATE_ERROR"),
        { status: 409 }
      );
    }
    const newItem = {
      id: `demo-${Date.now()}`,
      content,
      target: target || null,
      frequency: frequency || null,
      meaning: meaning || null,
    };
    return NextResponse.json(successResponse(newItem), { status: 201 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("screening_catalog").insert({
    user_id: auth.userId,
    content,
    target: target || null,
    frequency: frequency || null,
    meaning: meaning || null,
  }).select().single();

  if (error) {
    // Handle unique constraint violation
    if (error.code === "23505") {
      return NextResponse.json(
        errorResponse("Nội dung này đã tồn tại trong danh mục của bạn", "DUPLICATE_ERROR"),
        { status: 409 }
      );
    }
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse(data), { status: 201 });
}