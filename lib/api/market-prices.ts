/**
 * @file lib/api/market-prices.ts
 * @description 시세 조회 API 함수
 *
 * 공공데이터포털 온라인 도매시장 거래정보 API를 사용하여 시세를 조회합니다.
 * 현재는 공공 API만 사용하며, 향후 KAMIS API fallback 추가 예정입니다.
 *
 * 주요 기능:
 * 1. 시세 조회 (확정일자, 대분류/중분류/소분류 코드 기반)
 * 2. 일주일 시세 추이 조회
 * 3. 주요 도매시장 및 품목 카테고리 정의
 *
 * @dependencies
 * - 환경 변수: PUBLIC_DATA_API_KEY
 *
 * @example
 * ```tsx
 * import { getMarketPrices } from '@/lib/api/market-prices';
 *
 * const prices = await getMarketPrices({
 *   date: '2025-01-15',
 *   lclsfCd: '01',
 * });
 * ```
 */

// 타입 정의
export interface MarketPriceParams {
  date?: string; // 확정일자 (YYYY-MM-DD 형식)
  lclsfCd?: string; // 대분류 코드
  mclsfCd?: string; // 중분류 코드
  sclsfCd?: string; // 소분류 코드
  pageNo?: number; // 페이지 번호 (기본 1)
  numOfRows?: number; // 한 페이지 결과 수 (기본 10)
}

export interface PriceItem {
  cfmtnYmd: string; // 확정일자
  lclsfNm: string; // 대분류명
  mclsfNm: string; // 중분류명
  sclsfNm: string; // 소분류명
  avgPrice: number; // 평균가 (원)
  minPrice: number; // 최소가 (원)
  maxPrice: number; // 최고가 (원)
  source: "public"; // 데이터 출처
}

export interface PriceTrendItem {
  date: string; // 날짜 (YYYY-MM-DD)
  price: number; // 평균 가격 (원)
  source?: "public";
}

// API 응답 타입 (실제 응답 구조에 맞게 조정 필요)
interface ApiResponse {
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      items?: {
        item?: any | any[];
      };
      totalCount?: number;
    };
  };
  [key: string]: any; // 기타 필드 허용
}

/**
 * 공공 API 호출 함수 (내부 함수)
 */
async function fetchMarketPricesFromAPI(
  params: MarketPriceParams = {},
): Promise<PriceItem[]> {
  // 환경변수에서 API 키 가져오기 (따옴표 제거)
  const rawApiKey = process.env.PUBLIC_DATA_API_KEY;
  const apiKey = rawApiKey?.trim().replace(/^["']|["']$/g, "") || null;

  console.group("🔍 [market-prices] 환경변수 확인");
  console.log("환경변수 존재 여부:", !!rawApiKey);
  console.log("환경변수 길이:", rawApiKey?.length || 0);
  console.log("처리된 API 키 길이:", apiKey?.length || 0);
  console.groupEnd();

  if (!apiKey) {
    throw new Error("공공데이터포털 API 키가 설정되지 않았습니다.");
  }

  const baseUrl = "https://apis.data.go.kr/B552845/katOnline";

  // 기본 파라미터 설정
  const queryParams = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: params.pageNo?.toString() || "1",
    numOfRows: params.numOfRows?.toString() || "10",
    returnType: "json",
  });

  // 검색 조건 파라미터 추가
  if (params.date) {
    queryParams.append("cond[cfmtn_ymd::EQ]", params.date);
  }
  if (params.lclsfCd) {
    queryParams.append("cond[onln_whsl_mrkt_lclsf_cd::EQ]", params.lclsfCd);
  }
  if (params.mclsfCd) {
    queryParams.append("cond[onln_whsl_mrkt_mclsf_cd::EQ]", params.mclsfCd);
  }
  if (params.sclsfCd) {
    queryParams.append("cond[onln_whsl_mrkt_sclsf_cd::EQ]", params.sclsfCd);
  }

  console.group("📊 [market-prices] 공공 API 호출");
  console.log("파라미터:", params);
  console.log(
    "URL:",
    `${baseUrl}?${queryParams.toString().replace(apiKey, "***")}`,
  );

  try {
    const response = await fetch(`${baseUrl}?${queryParams}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`,
      );
    }

    const data: ApiResponse = await response.json();

    // API 응답 확인
    if (data.response?.header?.resultCode !== "00") {
      const errorMsg = data.response?.header?.resultMsg || "알 수 없는 오류";
      console.warn("⚠️ API 응답 오류:", errorMsg);
      throw new Error(`API 응답 오류: ${errorMsg}`);
    }

    // 데이터가 없는 경우
    if (!data.response?.body?.items?.item) {
      console.warn("경매 데이터가 없습니다.");
      console.groupEnd();
      return [];
    }

    const items = Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : [data.response.body.items.item];

    // API 응답 데이터를 PriceItem 형태로 변환
    // 실제 응답 구조에 맞게 필드명 조정 필요
    const result = items.map((item: any) => {
      return {
        cfmtnYmd: item.cfmtn_ymd || item.cfmtnYmd || "",
        lclsfNm: item.onln_whsl_mrkt_lclsf_nm || item.lclsfNm || "",
        mclsfNm: item.onln_whsl_mrkt_mclsf_nm || item.mclsfNm || "",
        sclsfNm: item.onln_whsl_mrkt_sclsf_nm || item.sclsfNm || "",
        avgPrice: parseFloat(item.avg_prc || item.avgPrice || "0"),
        minPrice: parseFloat(item.min_prc || item.minPrice || "0"),
        maxPrice: parseFloat(item.max_prc || item.maxPrice || "0"),
        source: "public" as const,
      };
    });

    console.log("✅ 공공 API 성공:", result.length, "개 항목");
    console.groupEnd();
    return result;
  } catch (error) {
    console.error("❌ 공공 API 실패:", error);
    console.groupEnd();
    throw error;
  }
}

/**
 * 시세 조회 함수
 *
 * @param params - 조회 파라미터
 * @returns 시세 정보 배열
 */
export async function getMarketPrices(
  params: MarketPriceParams = {},
): Promise<PriceItem[]> {
  // 현재: 공공 API만 사용
  return await fetchMarketPricesFromAPI(params);

  // 향후: KAMIS fallback 추가 시 아래 코드로 교체
  // try {
  //   return await fetchMarketPricesFromAPI(params);
  // } catch (publicError) {
  //   console.warn("⚠️ 공공 API 실패, KAMIS API로 전환:", publicError);
  //   return await fetchMarketPricesFromKAMIS(params);
  // }
}

/**
 * 일주일 시세 추이 조회
 *
 * @param lclsfCd - 대분류 코드
 * @param mclsfCd - 중분류 코드 (선택)
 * @param sclsfCd - 소분류 코드 (선택)
 * @param days - 조회 일수 (기본 7일)
 * @returns 날짜별 평균 가격 배열
 */
export async function getPriceTrend(
  lclsfCd: string,
  mclsfCd?: string,
  sclsfCd?: string,
  days: number = 7,
): Promise<PriceTrendItem[]> {
  const results: PriceTrendItem[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    try {
      const prices = await getMarketPrices({
        date: dateString,
        lclsfCd,
        mclsfCd,
        sclsfCd,
        numOfRows: 100, // 더 많은 데이터 조회
      });

      if (prices.length > 0) {
        // 같은 품목의 평균 가격 계산
        const avgPrice =
          prices.reduce((sum, p) => sum + p.avgPrice, 0) / prices.length;
        results.push({
          date: dateString,
          price: Math.round(avgPrice),
          source: "public",
        });
      }
    } catch (error) {
      console.error(`${dateString} 데이터 조회 실패:`, error);
    }
  }

  return results.reverse(); // 오래된 날짜부터 정렬
}

/**
 * 주요 도매시장 목록
 * (온라인 도매시장은 전국 통합이므로 시장별 구분이 없을 수 있음)
 */
export const majorMarkets = [
  "전국",
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

/**
 * 주요 품목 카테고리 (대분류 코드 매핑)
 * 실제 코드는 API 응답을 확인한 후 업데이트 필요
 */
export const itemCategories = {
  채소류: {
    code: "01",
    items: ["배추", "무", "고추", "마늘", "양파", "대파"],
  },
  과일류: {
    code: "02",
    items: ["사과", "배", "포도", "감귤", "딸기", "수박"],
  },
  축산물: {
    code: "03",
    items: ["쇠고기", "돼지고기", "닭고기"],
  },
} as const;
