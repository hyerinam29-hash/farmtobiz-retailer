/**
 * @file lib/utils/business-days.ts
 * @description 영업일 계산 유틸리티
 *
 * 주말(토요일, 일요일)을 제외한 영업일 기준 날짜 계산 함수
 */

/**
 * 영업일 기준으로 지정된 일수만큼 더한 날짜를 반환
 * 주말(토요일, 일요일)은 제외합니다.
 *
 * @param startDate 시작 날짜 (기본값: 현재 날짜)
 * @param businessDays 더할 영업일 수 (기본값: 7)
 * @returns 영업일 기준으로 계산된 날짜
 *
 * @example
 * // 오늘부터 영업일 기준 7일 후
 * const payoutDate = addBusinessDays(new Date(), 7);
 */
export function addBusinessDays(
  startDate: Date = new Date(),
  businessDays: number = 7
): Date {
  const result = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay(); // 0 = 일요일, 6 = 토요일

    // 주말이 아니면 영업일로 카운트
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return result;
}

/**
 * 특정 날짜가 영업일인지 확인
 *
 * @param date 확인할 날짜
 * @returns 영업일이면 true, 주말이면 false
 */
export function isBusinessDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6; // 일요일(0)과 토요일(6) 제외
}

