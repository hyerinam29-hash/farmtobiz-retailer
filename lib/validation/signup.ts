/**
 * @file signup.ts
 * @description 회원가입 폼 유효성 검증 스키마
 *
 * 이 파일은 회원가입 시 입력받는 정보의 유효성 검증을 위한
 * Zod 스키마를 정의합니다.
 *
 * 주요 검증 규칙:
 * - 이름: 2글자 이상
 * - 이메일: 유효한 이메일 형식
 * - 비밀번호: 8자 이상, 영문/숫자/특수문자 조합
 * - 비밀번호 확인: 비밀번호와 일치
 * - 연락처: 010-####-#### 형식
 * - 상호명: 선택, 2글자 이상
 * - 사업자등록번호: 선택, 10자리 숫자
 * - 약관 동의: 필수 약관은 반드시 동의 필요
 *
 * @dependencies
 * - zod: 스키마 검증 라이브러리
 *
 * @example
 * ```tsx
 * import { signupSchema } from '@/lib/validation/signup';
 * import { zodResolver } from '@hookform/resolvers/zod';
 *
 * const form = useForm({
 *   resolver: zodResolver(signupSchema),
 * });
 * ```
 */

import { z } from "zod";

/**
 * 회원가입 폼 데이터 스키마
 */
export const signupSchema = z
  .object({
    // 기본 정보
    name: z
      .string()
      .min(2, "이름은 2글자 이상 입력해주세요.")
      .max(50, "이름은 50글자 이하로 입력해주세요."),

    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식으로 입력해주세요."),

    password: z
      .string()
      .min(8, "비밀번호는 8자 이상 입력해주세요.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
      ),

    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),

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

    // 사업자 정보 (선택)
    business_name: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 2,
        "상호명은 2글자 이상 입력해주세요.",
      ),

    business_number: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{10}$/.test(val.replace(/\D/g, "")),
        "사업자등록번호는 10자리 숫자로 입력해주세요.",
      ),

    // 약관 동의
    agreeAll: z.boolean().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "이용약관 동의는 필수입니다.",
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: "개인정보 처리방침 동의는 필수입니다.",
    }),
    agreeMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

/**
 * 회원가입 폼 데이터 타입
 */
export type SignupFormData = z.infer<typeof signupSchema>;

