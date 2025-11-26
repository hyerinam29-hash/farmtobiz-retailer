/**
 * @file app/api/test-market-api/route.ts
 * @description 공공데이터포털 API 테스트용 Route
 *
 * 실제 공공 API를 호출하여 응답 구조를 확인하는 테스트용 API입니다.
 * 여러 파라미터 조합으로 테스트하여 실제 응답 구조를 파악합니다.
 *
 * @dependencies
 * - 환경 변수: PUBLIC_DATA_API_KEY
 */

import { NextResponse } from "next/server";

// 환경변수에서 API 키 가져오기 (따옴표 제거)
const rawApiKey = process.env.PUBLIC_DATA_API_KEY;
const API_KEY = rawApiKey?.trim().replace(/^["']|["']$/g, "") || null;
const BASE_URL = "https://apis.data.go.kr/B552845/katOnline";

interface TestResult {
  testName: string;
  url: string;
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

export async function GET(request: Request) {
  try {
    console.group("🧪 [test-market-api] 공공 API 테스트 시작");

    if (!API_KEY) {
      console.error("❌ [test-market-api] API 키가 설정되지 않았습니다.");
      return NextResponse.json(
        {
          error: "API 키가 설정되지 않았습니다.",
          hint: "PUBLIC_DATA_API_KEY 환경 변수를 확인하세요.",
        },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const testType = searchParams.get("type") || "all";

    const results: TestResult[] = [];

    // 테스트 1: 기본 호출 (최소 파라미터)
    if (testType === "all" || testType === "basic") {
      try {
        console.log("📊 테스트 1: 기본 호출");
        const url = `${BASE_URL}?serviceKey=${encodeURIComponent(API_KEY)}&pageNo=1&numOfRows=10&returnType=json`;
        console.log("URL:", url.replace(API_KEY, "***"));

        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        console.log("✅ 테스트 1 성공:", {
          status: response.status,
          dataKeys: Object.keys(data),
        });

        results.push({
          testName: "기본 호출 (최소 파라미터)",
          url: url.replace(API_KEY, "***"),
          success: response.ok,
          data: data,
          status: response.status,
        });
      } catch (error) {
        console.error("❌ 테스트 1 실패:", error);
        results.push({
          testName: "기본 호출 (최소 파라미터)",
          url: "",
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // 테스트 2: 날짜 조건 추가
    if (testType === "all" || testType === "date") {
      try {
        console.log("📊 테스트 2: 날짜 조건 추가");
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const url = `${BASE_URL}?serviceKey=${encodeURIComponent(API_KEY)}&pageNo=1&numOfRows=10&returnType=json&cond[cfmtn_ymd::EQ]=${dateStr}`;
        console.log("URL:", url.replace(API_KEY, "***"));

        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        console.log("✅ 테스트 2 성공:", {
          status: response.status,
          dataKeys: Object.keys(data),
        });

        results.push({
          testName: "날짜 조건 추가",
          url: url.replace(API_KEY, "***"),
          success: response.ok,
          data: data,
          status: response.status,
        });
      } catch (error) {
        console.error("❌ 테스트 2 실패:", error);
        results.push({
          testName: "날짜 조건 추가",
          url: "",
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // 테스트 3: 대분류 코드 추가
    if (testType === "all" || testType === "category") {
      try {
        console.log("📊 테스트 3: 대분류 코드 추가");
        const url = `${BASE_URL}?serviceKey=${encodeURIComponent(API_KEY)}&pageNo=1&numOfRows=10&returnType=json&cond[onln_whsl_mrkt_lclsf_cd::EQ]=01`;
        console.log("URL:", url.replace(API_KEY, "***"));

        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        console.log("✅ 테스트 3 성공:", {
          status: response.status,
          dataKeys: Object.keys(data),
        });

        results.push({
          testName: "대분류 코드 추가 (01)",
          url: url.replace(API_KEY, "***"),
          success: response.ok,
          data: data,
          status: response.status,
        });
      } catch (error) {
        console.error("❌ 테스트 3 실패:", error);
        results.push({
          testName: "대분류 코드 추가 (01)",
          url: "",
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // 테스트 4: 중분류 코드 추가
    if (testType === "all" || testType === "subcategory") {
      try {
        console.log("📊 테스트 4: 중분류 코드 추가");
        const url = `${BASE_URL}?serviceKey=${encodeURIComponent(API_KEY)}&pageNo=1&numOfRows=10&returnType=json&cond[onln_whsl_mrkt_mclsf_cd::EQ]=0101`;
        console.log("URL:", url.replace(API_KEY, "***"));

        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        console.log("✅ 테스트 3 성공:", {
          status: response.status,
          dataKeys: Object.keys(data),
        });

        results.push({
          testName: "중분류 코드 추가 (0101)",
          url: url.replace(API_KEY, "***"),
          success: response.ok,
          data: data,
          status: response.status,
        });
      } catch (error) {
        console.error("❌ 테스트 4 실패:", error);
        results.push({
          testName: "중분류 코드 추가 (0101)",
          url: "",
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    console.groupEnd();

    return NextResponse.json(
      {
        success: true,
        message: "API 테스트 완료",
        results: results,
        summary: {
          total: results.length,
          success: results.filter((r) => r.success).length,
          failed: results.filter((r) => !r.success).length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ [test-market-api] 예상치 못한 오류:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

