/**
 * Push Notification Subscription API Route
 * POST /api/notifications/subscribe - Subscribe to push notifications
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, parseBody } from "@/lib/api-response";

interface SubscribeInput {
  endpoint: string;
  p256dh: string;
  auth: string;
}

function validateSubscribeInput(data: unknown): {
  success: boolean;
  data?: SubscribeInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.endpoint !== "string" || input.endpoint.trim() === "") {
    return { success: false, error: "endpoint là bắt buộc" };
  }

  if (typeof input.p256dh !== "string" || input.p256dh.trim() === "") {
    return { success: false, error: "p256dh là bắt buộc" };
  }

  if (typeof input.auth !== "string" || input.auth.trim() === "") {
    return { success: false, error: "auth là bắt buộc" };
  }

  return {
    success: true,
    data: {
      endpoint: input.endpoint as string,
      p256dh: input.p256dh as string,
      auth: input.auth as string,
    },
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const body = await parseBody<SubscribeInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateSubscribeInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { endpoint, p256dh, auth } = validation.data!;

  try {
    // Check if subscription already exists
    const { data: existing } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("endpoint", endpoint)
      .single();

    let subscription;

    if (existing) {
      // Update existing subscription
      const { data, error } = await supabase
        .from("push_subscriptions")
        .update({
          p256dh,
          auth,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(errorResponse("Không thể cập nhật subscription"), { status: 500 });
      }

      subscription = data;
    } else {
      // Insert new subscription
      const { data, error } = await supabase
        .from("push_subscriptions")
        .insert({
          user_id: user.id,
          endpoint,
          p256dh,
          auth,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(errorResponse("Không thể tạo subscription"), { status: 500 });
      }

      subscription = data;
    }

    return NextResponse.json(successResponse(subscription), { status: 201 });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      errorResponse("Đã xảy ra lỗi. Vui lòng thử lại.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/subscribe - Unsubscribe from push notifications
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(validationError("endpoint là bắt buộc"), { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", user.id)
      .eq("endpoint", endpoint);

    if (error) {
      return NextResponse.json(errorResponse("Không thể xóa subscription"), { status: 500 });
    }

    return NextResponse.json(successResponse({ message: "Đã hủy đăng ký nhận thông báo" }));
  } catch (error) {
    console.error("Unsubscribe API error:", error);
    return NextResponse.json(
      errorResponse("Đã xảy ra lỗi. Vui lòng thử lại.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}