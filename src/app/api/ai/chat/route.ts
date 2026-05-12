/**
 * AI Chat API Route
 * POST /api/ai/chat - Chat with Claude for medical term explanation and article summarization
 */

import { NextRequest, NextResponse } from "next/server";

// Medical term explanation prompt (Vietnamese)
const MEDICAL_TERM_PROMPT = `Bạn là trợ lý y khoa tiếng Việt, chuyên giải thích các thuật ngữ y khoa một cách dễ hiểu cho người cao tuổi.

Khi người dùng hỏi về một thuật ngữ y khoa:
1. Giải thích bằng ngôn ngữ đơn giản, câu ngắn
2. Không dùng thuật ngữ y khoa phức tạp
3. Nếu có ví dụ thực tế thì càng tốt
4. Trả lời bằng tiếng Việt
5. Độ dài: 2-4 câu, mỗi câu tối đa 15 từ

Câu trả lời phải rõ ràng, dễ hiểu, phù hợp với người cao tuổi.`;

// Summarize for elderly prompt (Vietnamese)
const SUMMARIZE_PROMPT = `Bạn là trợ lý y khoa, chuyên tóm tắt bài viết y tế thành ngôn ngữ đơn giản cho người cao tuổi Việt Nam.

Yêu cầu tóm tắt:
1. Câu ngắn, mỗi câu tối đa 10 từ
2. Không dùng thuật ngữ y khoa
3. Dùng ngôn ngữ thân thiện, gần gũi
4. Chia thành đoạn ngắn 2-3 câu
5. Tổng độ dài: 150-200 từ
6. Viết bằng tiếng Việt

Định dạng:
- Viết theo phong cách nói chuyện với ông bà
- Dùng dấu chấm để ngắt câu rõ ràng
- Không cần tiêu đề
- Ưu tiên thông tin quan trọng nhất trước`;

export async function POST(request: NextRequest) {
  try {
    const { messages, selectedText, action } = await request.json();

    // Determine the prompt based on action
    let systemPrompt = MEDICAL_TERM_PROMPT;
    let userContent = messages?.[messages.length - 1]?.content || "";

    if (action === "summarize") {
      systemPrompt = SUMMARIZE_PROMPT;
      userContent = `Hãy tóm tắt bài viết sau cho người già:\n\n${userContent}`;
    } else if (selectedText) {
      // If there's selected text, explain it
      userContent = `Giải thích thuật ngữ sau: "${selectedText}"\n\nCâu hỏi của người dùng: ${userContent}`;
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Call Anthropic API directly with streaming
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userContent,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json(
        { error: "Failed to call Claude API" },
        { status: response.status }
      );
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}