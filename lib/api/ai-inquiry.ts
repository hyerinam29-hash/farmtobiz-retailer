/**
 * @file ai-inquiry.ts
 * @description AI 문의 답변 생성 함수
 *
 * Gemini API를 사용하여 문의 유형과 내용에 맞는 답변을 생성합니다.
 * 도매 관련 질문은 필터링하여 특별 응답을 반환합니다.
 *
 * 주요 기능:
 * 1. 문의 유형별 프롬프트 템플릿
 * 2. 도매 관련 질문 감지 및 필터링
 * 3. Gemini API 호출
 * 4. 에러 처리 및 로깅
 *
 * @dependencies
 * - process.env.GEMINI_API_KEY
 */

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ [ai-inquiry] GEMINI_API_KEY가 설정되지 않았습니다.");
}

/**
 * 도매 관련 키워드 목록
 */
const wholesalerKeywords = [
  "도매",
  "도매상",
  "도매점",
  "도매업체",
  "도매업자",
  "도매사업",
  "도매가",
  "도매가격",
  "도매상호",
  "도매업",
  "도매상 정보",
  "도매점 정보",
  "도매업체 정보",
  "도매상 연락처",
  "도매점 연락처",
  "도매업체 연락처",
  "도매상 이름",
  "도매점 이름",
  "도매업체 이름",
  "도매상 주소",
  "도매점 주소",
  "도매업체 주소",
];

/**
 * 문의 내용에서 도매 관련 키워드 검색
 *
 * @param {string} content - 문의 내용
 * @returns {boolean} 도매 관련 여부
 */
function isWholesalerRelated(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return wholesalerKeywords.some((keyword) => lowerContent.includes(keyword));
}

/**
 * 문의 유형별 프롬프트 템플릿
 */
const inquiryTypePrompts: Record<string, string> = {
  account: `당신은 농수산물 B2B 플랫폼 "Farm to Biz"의 고객 지원 AI입니다.
계정 관련 문의에 대해 친절하고 명확하게 답변해주세요.
주요 답변 포인트:
- 계정 로그인/로그아웃 문제
- 비밀번호 재설정
- 프로필 정보 수정
- 역할 변경 (소매/도매)
답변은 한국어로 작성하고, 구체적인 해결 방법을 제시해주세요.`,

  order: `당신은 농수산물 B2B 플랫폼 "Farm to Biz"의 고객 지원 AI입니다.
주문/결제 관련 문의에 대해 친절하고 명확하게 답변해주세요.
주요 답변 포인트:
- 주문 방법 및 주문 내역 조회
- 결제 오류 및 환불 처리
- 주문 취소 및 변경
- 최소 주문 수량
답변은 한국어로 작성하고, 구체적인 해결 방법을 제시해주세요.`,

  delivery: `당신은 농수산물 B2B 플랫폼 "Farm to Biz"의 고객 지원 AI입니다.
배송 관련 문의에 대해 친절하고 명확하게 답변해주세요.
주요 답변 포인트:
- 새벽 배송 vs 일반 배송
- 배송 시간 선택 및 변경
- 배송지 관리
- 배송 상태 조회
- 배송 지연 및 문제 해결
답변은 한국어로 작성하고, 구체적인 해결 방법을 제시해주세요.`,

  system: `당신은 농수산물 B2B 플랫폼 "Farm to Biz"의 고객 지원 AI입니다.
시스템 오류 관련 문의에 대해 친절하고 명확하게 답변해주세요.
주요 답변 포인트:
- 페이지 로딩 오류
- 기능 작동 불가
- 브라우저 호환성
- 데이터 표시 오류
답변은 한국어로 작성하고, 단계별 해결 방법을 제시해주세요.
문제가 지속되면 스크린샷과 함께 사람 상담원에게 연결하도록 안내해주세요.`,

  other: `당신은 농수산물 B2B 플랫폼 "Farm to Biz"의 고객 지원 AI입니다.
기타 문의에 대해 친절하고 명확하게 답변해주세요.
답변은 한국어로 작성하고, 구체적인 해결 방법을 제시해주세요.
답변하기 어려운 경우, 사람 상담원에게 연결하도록 안내해주세요.`,
};

/**
 * AI 문의 답변 생성
 *
 * @param {string} inquiryType - 문의 유형 (account, order, delivery, system, other)
 * @param {string} title - 문의 제목
 * @param {string} content - 문의 내용
 * @returns {Promise<string>} AI 답변 텍스트
 */
export async function generateInquiryResponse(
  inquiryType: string,
  title: string,
  content: string,
): Promise<string> {
  console.group("🤖 [ai-inquiry] AI 답변 생성 시작");
  console.log("inquiryType:", inquiryType);
  console.log("title:", title);
  console.log("content:", content);

  try {
    // 1. API 키 확인
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
    }

    // 2. 도매 관련 질문 필터링
    const combinedText = `${title} ${content}`;
    if (isWholesalerRelated(combinedText)) {
      console.log("⚠️ [ai-inquiry] 도매 관련 질문 감지 - 특별 응답 반환");
      console.groupEnd();
      return "죄송합니다. 도매 관련 문의는 어렵습니다. 소매 관련 문의만 도와드릴 수 있습니다. 다른 문의사항이 있으시면 언제든지 말씀해주세요.";
    }

    // 3. 문의 유형별 프롬프트 가져오기
    const systemPrompt = inquiryTypePrompts[inquiryType] || inquiryTypePrompts.other;

    // 4. 사용자 프롬프트 구성
    const userPrompt = `다음 문의에 대해 답변해주세요:

제목: ${title}

내용:
${content}

위 문의에 대해 친절하고 구체적으로 답변해주세요. 가능하면 단계별 해결 방법을 제시해주세요.`;

    // 5. Gemini API 호출
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${userPrompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7, // 창의성 (0.7이 적당)
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

    // 6. Rate limit 처리
    if (response.status === 429) {
      console.error("❌ [ai-inquiry] Rate limit 초과 (429)");
      throw new Error(
        "AI 답변 생성 한도가 초과되었습니다. 잠시 후 다시 시도해주세요.",
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [ai-inquiry] Gemini API 에러:", {
        status: response.status,
        errorData,
      });
      throw new Error(
        `AI 답변 생성 실패: ${response.status} ${
          errorData.error?.message || ""
        }`,
      );
    }

    const data = await response.json();

    // 7. 응답 텍스트 추출
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      console.error("❌ [ai-inquiry] 응답 텍스트 없음");
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    console.log("✅ [ai-inquiry] AI 답변 생성 완료");
    console.groupEnd();

    return textContent;
  } catch (error) {
    console.error("❌ [ai-inquiry] AI 답변 생성 실패:", error);
    console.groupEnd();
    throw error;
  }
}

