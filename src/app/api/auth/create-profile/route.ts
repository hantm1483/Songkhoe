import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, fullName } = body;

    if (!userId || !email || !fullName) {
      return NextResponse.json(
        { error: "Thiếu thông tin cần thiết" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("profiles").insert({
      id: userId,
      email,
      full_name: fullName,
    });

    if (error) {
      console.error("Error creating profile:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in profile creation:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}