import { NextResponse } from "next/server";
import { createInquiry } from "@/actions/retailer/create-inquiry";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      orderId?: string | null;
    };

    const result = await createInquiry({
      title: body.title ?? "",
      content: body.content ?? "",
      orderId: body.orderId ?? null,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ [chatbot-inquiry] 처리 중 오류", error);
    return NextResponse.json(
      { error: "문의 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

