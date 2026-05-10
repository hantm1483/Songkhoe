import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError } from "@/lib/api-response";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * POST /api/memorial/photos/upload-url - Generate upload URL for photo
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  // Parse body for file info
  let body: { fileName: string; contentType: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  if (!body || !body.fileName || !body.contentType) {
    return NextResponse.json(validationError("Thiếu thông tin file"), { status: 400 });
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(body.contentType)) {
    return NextResponse.json(
      validationError("Loại file không được hỗ trợ. Chỉ chấp nhận JPEG, PNG, WebP, GIF."),
      { status: 400 }
    );
  }

  // Generate unique file name
  const ext = body.fileName.split(".").pop();
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  // Generate upload URL using Supabase Storage
  const { data, error } = await supabase.storage
    .from("memorial-photos")
    .createSignedUploadUrl(fileName);

  if (error) {
    console.error("Storage error:", error);
    return NextResponse.json(errorResponse("Không thể tạo link upload"), { status: 500 });
  }

  return NextResponse.json(successResponse({
    uploadUrl: data.signedUrl,
    fileUrl: fileName,
  }));
}