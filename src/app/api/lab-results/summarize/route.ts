/**
 * Lab Result AI Summary API Route
 * POST /api/lab-results/summarize - Get AI summary for a lab result
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, unauthorizedError, parseBody } from "@/lib/api-response";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

interface SummarizeInput {
  lab_result_id: string;
}

function validateSummarizeInput(data: unknown): {
  success: boolean;
  data?: SummarizeInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.lab_result_id !== "string" || input.lab_result_id.trim() === "") {
    return { success: false, error: "lab_result_id là bắt buộc" };
  }

  return {
    success: true,
    data: {
      lab_result_id: input.lab_result_id as string,
    },
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(unauthorizedError(), { status: 401 });
  }

  const body = await parseBody<SummarizeInput>(request);
  if (!body) {
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }

  const validation = validateSummarizeInput(body);
  if (!validation.success) {
    return NextResponse.json(validationError(validation.error!), { status: 400 });
  }

  const { lab_result_id } = validation.data!;

  // Check rate limit (10 summaries per hour)
  const { allowed, resetAt } = await checkRateLimit(user.id, "aiSummary");
  if (!allowed) {
    const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      errorResponse("Bạn đã yêu cầu quá nhiều tóm tắt. Vui lòng chờ vài phút.", "RATE_LIMITED"),
      {
        status: 429,
        headers: { "Retry-After": retryAfter.toString() },
      }
    );
  }

  // Fetch the lab result to verify ownership
  const { data: labResult, error: fetchError } = await supabase
    .from("lab_results")
    .select("*")
    .eq("id", lab_result_id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !labResult) {
    return NextResponse.json(errorResponse("Không tìm thấy kết quả xét nghiệm"), { status: 404 });
  }

  try {
    // Call Supabase Edge Function for AI summary
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const edgeFunctionResponse = await fetch(
      `${supabaseUrl}/functions/v1/summarize-lab-result`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          lab_result_id,
          type: labResult.type,
          value: labResult.value,
          unit: labResult.unit,
          reference_min: labResult.reference_min,
          reference_max: labResult.reference_max,
          recorded_at: labResult.recorded_at,
        }),
      }
    );

    const result = await edgeFunctionResponse.json();

    if (!edgeFunctionResponse.ok) {
      return NextResponse.json(
        errorResponse(result.error || "Không thể tạo tóm tắt", "EDGE_FUNCTION_ERROR"),
        { status: edgeFunctionResponse.status }
      );
    }

    return NextResponse.json(successResponse({ summary: result.summary }), {
      status: 200,
    });
  } catch (error) {
    console.error("Lab summary API error:", error);
    return NextResponse.json(
      errorResponse("Đã xảy ra lỗi. Vui lòng thử lại.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}