/**
 * @file inquiry.ts
 * @description 문의 타입 정의
 *
 * 이 파일은 문의(inquiries) 관련 타입을 정의합니다.
 * 문의 작성, 조회, 답변 등을 포함합니다.
 *
 * @dependencies
 * - types/database.ts
 */

import type { InquiryStatus } from "./database";

/**
 * 문의 관련 상품 정보 타입
 */
export interface InquiryProduct {
  id: string;
  name: string;
  image_urls?: string[] | null; // API 응답에서 사용 (DB의 images를 변환)
  images?: string[] | null; // DB에서 직접 조회 시 사용
}

/**
 * 문의 테이블 타입
 * inquiries 테이블과 일치
 */
export interface Inquiry {
  id: string;
  user_id: string; // profiles 테이블 참조
  title: string;
  content: string;
  status: InquiryStatus;
  admin_reply: string | null;
  created_at: string;
  replied_at: string | null;
  inquiry_type?: string | null; // 문의 유형: retailer_to_wholesaler, retailer_to_admin, wholesaler_to_admin
  wholesaler_id?: string | null; // 소매→도매 문의의 경우 대상 도매점 ID
  order_id?: string | null; // 소매→도매 문의의 경우 관련 주문 ID
  product_id?: string | null; // 관련 상품 ID
  product?: InquiryProduct | null; // 관련 상품 정보
  attachment_urls?: string[] | null; // 문의 첨부 이미지 URL 배열 (최대 5개)
}

/**
 * 문의 생성 요청 타입
 */
export interface CreateInquiryRequest {
  user_id: string;
  title: string;
  content: string;
  inquiry_type?: string; // 문의 유형
  wholesaler_id?: string | null; // 소매→도매 문의의 경우 대상 도매점 ID
  order_id?: string | null; // 관련 주문 ID
  attachment_urls?: string[]; // 첨부 파일 URL 배열
}

/**
 * 문의 업데이트 요청 타입 (사용자용)
 */
export interface UpdateInquiryRequest {
  title?: string;
  content?: string;
}

/**
 * 문의 답변 요청 타입 (관리자용)
 */
export interface ReplyInquiryRequest {
  inquiry_id: string;
  admin_reply: string;
}

/**
 * 문의 목록 조회 필터 타입
 */
export interface InquiryFilter {
  user_id?: string;
  status?: InquiryStatus;
  start_date?: string; // ISO 8601 형식
  end_date?: string; // ISO 8601 형식
  search?: string; // 제목 또는 내용 검색
}

/**
 * 문의 상세 정보 타입
 * 필요시 프로필 정보 등 추가 가능
 */
export interface InquiryDetail extends Inquiry {
  // 추가 정보가 필요한 경우 여기에 확장
  // 예: user_name, user_email 등
}
