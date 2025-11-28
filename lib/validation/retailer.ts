/**
 * @file retailer.ts
 * @description 소매점 온보딩 폼 유효성 검증 스키마
 *
 * 이 파일은 소매점 회원가입 시 기본 정보 입력 폼의 유효성 검증을 위한
 * Zod 스키마를 정의합니다.
 *
 * 주요 검증 규칙:
 * - 상호명: 2글자 이상
 * - 연락처: 010-####-#### 형식 (하이픈 자동 추가)
 * - 주소: 5글자 이상
 * - 이메일: 유효한 이메일 형식
 *
 * @dependencies
 * - zod: 스키마 검증 라이브러리
 *
 * @example
 * ```tsx
 * import { retailerOnboardingSchema } from '@/lib/validation/retailer';
 * import { zodResolver } from '@hookform/resolvers/zod';
 *
 * const form = useForm({
 *   resolver: zodResolver(retailerOnboardingSchema),
 * });
 * ```
 */

import { z } from "zod";

/**
 * 소매점 온보딩 폼 데이터 스키마
 */
export const retailerOnboardingSchema = z.object({
  business_name: z
    .string()
    .min(2, "상호명은 2글자 이상 입력해주세요.")
    .max(100, "상호명은 100글자 이하로 입력해주세요."),

  phone: z
    .string()
    .min(1, "연락처를 입력해주세요.")
    .refine(
      (val) => {
        // 하이픈 제거 후 숫자만 추출
        const digits = val.replace(/\D/g, "");
        // 010으로 시작하는 11자리 또는 10자리 번호
        return (
          (digits.length === 11 || digits.length === 10) &&
          digits.startsWith("010") &&
          /^\d+$/.test(digits)
        );
      },
      {
        message: "연락처는 010-####-#### 형식으로 입력해주세요.",
      },
    ),

  address: z
    .string()
    .min(5, "주소는 5글자 이상 입력해주세요.")
    .max(200, "주소는 200글자 이하로 입력해주세요."),

  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식으로 입력해주세요."),
});

/**
 * 소매점 온보딩 폼 데이터 타입
 */
export type RetailerOnboardingFormData = z.infer<
  typeof retailerOnboardingSchema
>;

/**
 * 프로필 수정 폼 데이터 스키마
 * (이메일 제외, 선택적 필드)
 */
export const retailerProfileUpdateSchema = z.object({
  business_name: z
    .string()
    .min(2, "상호명은 2글자 이상 입력해주세요.")
    .max(100, "상호명은 100글자 이하로 입력해주세요.")
    .optional(),

  phone: z
    .string()
    .min(1, "연락처를 입력해주세요.")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return (
          (digits.length === 11 || digits.length === 10) &&
          digits.startsWith("010") &&
          /^\d+$/.test(digits)
        );
      },
      {
        message: "연락처는 010-####-#### 형식으로 입력해주세요.",
      },
    )
    .optional(),

  address: z
    .string()
    .min(5, "주소는 5글자 이상 입력해주세요.")
    .max(200, "주소는 200글자 이하로 입력해주세요.")
    .optional(),
}).refine(
  (data) => {
    // 최소 하나의 필드는 입력되어야 함
    return data.business_name || data.phone || data.address;
  },
  {
    message: "최소 하나의 정보는 수정해야 합니다.",
  }
);

/**
 * 프로필 수정 폼 데이터 타입
 */
export type RetailerProfileUpdateFormData = z.infer<
  typeof retailerProfileUpdateSchema
>;

/**
 * 배송지 관리 폼 데이터 스키마
 */
export const deliveryAddressSchema = z.object({
  name: z
    .string()
    .min(1, "배송지 별칭을 입력해주세요.")
    .max(50, "배송지 별칭은 50글자 이하로 입력해주세요."),
  
  recipient_name: z
    .string()
    .min(1, "수령인 이름을 입력해주세요.")
    .max(50, "수령인 이름은 50글자 이하로 입력해주세요."),
  
  recipient_phone: z
    .string()
    .min(1, "수령인 전화번호를 입력해주세요.")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return (
          (digits.length === 11 || digits.length === 10) &&
          digits.startsWith("010") &&
          /^\d+$/.test(digits)
        );
      },
      {
        message: "연락처는 010-####-#### 형식으로 입력해주세요.",
      },
    ),
  
  address: z
    .string()
    .min(5, "주소를 입력해주세요.")
    .max(200, "주소는 200글자 이하로 입력해주세요."),
  
  address_detail: z
    .string()
    .max(200, "상세 주소는 200글자 이하로 입력해주세요.")
    .optional()
    .nullable(),
  
  postal_code: z
    .string()
    .max(10, "우편번호는 10글자 이하로 입력해주세요.")
    .optional()
    .nullable(),
  
  is_default: z.boolean().default(false),
});

/**
 * 배송지 관리 폼 데이터 타입
 */
export type DeliveryAddressFormData = z.infer<typeof deliveryAddressSchema>;

