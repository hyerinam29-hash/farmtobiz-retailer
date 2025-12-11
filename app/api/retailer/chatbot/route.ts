import { NextResponse } from "next/server";
import { chatWithGemini, type ChatMessage } from "@/actions/retailer/chat-with-gemini";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "메시지가 비어 있습니다." },
        { status: 400 }
      );
    }

    console.log("💬 [chatbot-api] 요청 수신", {
      messageCount: messages.length,
    });

    const result = await chatWithGemini(messages);

    return NextResponse.json({ reply: result.message });
  } catch (error) {
    console.error("❌ [chatbot-api] 처리 중 오류", error);
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

