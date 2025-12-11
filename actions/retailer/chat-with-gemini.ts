"use server";

/**
 * @file actions/retailer/chat-with-gemini.ts
 * @description Gemini Flash 기반 챗봇 프록시 Server Action
 *
 * - 클라이언트에서 직접 키가 노출되지 않도록 서버에서 Gemini 호출
 * - 기본 모델은 Gemini Flash 2.x 계열로 설정하되, 환경 변수로 교체 가능
 * - 사용자 입력을 그대로 로그에 남기지 않으며 길이만 기록하여 개인정보 노출 방지
 */

const DEFAULT_MODEL_NAME =
  process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `
당신은 Farm to Biz 소매 리테일러 대시보드 전용 Gemini 챗봇입니다.
- 한국어로만 응답합니다.
- 이 프로젝트는 Next.js 15 + React 19, Clerk 인증, Supabase DB를 사용합니다.
- 소매 도메인(리테일러) 관련 질문만 답변합니다. 도매/관리자 영역은 “정보가 없습니다”라고 답합니다.
- 코드/기능 질문 시, 이 레포 내 정보를 우선으로 삼고 추측하지 않습니다. 모르면 명확히 모른다고 말합니다.
- 개인정보나 민감 정보는 저장하거나 반복하지 않습니다.
`.trim();

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface ChatResponse {
  message: string;
}

export async function chatWithGemini(messages: ChatMessage[]): Promise<ChatResponse> {
  if (!GEMINI_API_KEY) {
    console.error("❌ [chatbot] GEMINI_API_KEY가 설정되지 않았습니다.");
    throw new Error("챗봇 키가 설정되지 않았습니다. 관리자에게 문의해주세요.");
  }

  const safeMessageLengths = messages.map((m) => ({
    role: m.role,
    length: m.content.length,
  }));
  console.log("💬 [chatbot] Gemini 요청 시작", {
    model: DEFAULT_MODEL_NAME,
    messageCount: messages.length,
    messageLengths: safeMessageLengths,
  });

  const payload = {
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: messages.map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL_NAME}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [chatbot] Gemini 응답 에러", {
        status: response.status,
        body: errorText,
      });
      throw new Error("챗봇 응답을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const firstText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!firstText) {
      console.error("❌ [chatbot] Gemini 응답 파싱 실패", { data });
      throw new Error("챗봇 응답이 비어 있습니다. 다시 시도해주세요.");
    }

    console.log("✅ [chatbot] Gemini 응답 성공", {
      replyLength: firstText.length,
    });

    return { message: firstText };
  } catch (error) {
    console.error("❌ [chatbot] Gemini 호출 중 오류", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
}

