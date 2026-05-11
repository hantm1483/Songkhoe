import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, validationError, notFoundError, databaseError } from "@/lib/api-response";

/**
 * GET /api/articles - List articles (public)
 * Query params: category, limit, offset
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("articles")
    .select("id, title, category, content, image_url, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(databaseError(error), { status: 500 });
  }

  return NextResponse.json(successResponse({ articles: data || [], count }));
}

/**
 * POST /api/articles - Create article or subscribe to newsletter
 * Body: { title, category, content, image_url } for article
 * Body: { email } for newsletter subscription
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();

    // Handle newsletter subscription
    if (body.email) {
      const { email } = body;

      // Validate email
      if (!email || !email.includes("@")) {
        return NextResponse.json(validationError("Email không hợp lệ"), { status: 400 });
      }

      // Store newsletter subscription (reuse articles table or create separate table)
      // For now, we can store in articles with a special category
      const { data, error } = await supabase
        .from("articles")
        .insert({
          title: `Newsletter subscription: ${email}`,
          category: "newsletter",
          content: email,
        })
        .select()
        .single();

      if (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(databaseError(error), { status: 500 });
      }

      return NextResponse.json(successResponse({ message: "Đăng ký nhận bản tin thành công!", subscription: data }));
    }

    // Handle new article creation
    const { title, category, content, image_url } = body;

    if (!title) {
      return NextResponse.json(validationError("Tiêu đề bắt buộc"), { status: 400 });
    }

    const { data, error } = await supabase
      .from("articles")
      .insert({
        title,
        category: category || "Y khoa",
        content,
        image_url,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(databaseError(error), { status: 500 });
    }

    return NextResponse.json(successResponse({ article: data }));
  } catch (err) {
    console.error("Request parsing error:", err);
    return NextResponse.json(validationError("Dữ liệu không hợp lệ"), { status: 400 });
  }
}