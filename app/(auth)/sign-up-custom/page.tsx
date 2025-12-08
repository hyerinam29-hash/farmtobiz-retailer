/**
 * @file app/(auth)/sign-up-custom/page.tsx
 * @description 커스텀 회원가입 페이지
 *
 * 디자인 스펙에 맞춘 완전히 커스텀된 회원가입 페이지입니다.
 * SignupForm 컴포넌트를 사용하여 회원가입 폼을 표시합니다.
 *
 * 주요 기능:
 * 1. 디자인 스펙에 맞는 레이아웃 및 스타일링
 * 2. 반응형 디자인 (모바일/태블릿/데스크톱)
 * 3. 회원가입 폼 컴포넌트 통합
 * 4. 역할별 리다이렉트 URL 설정
 *
 * @dependencies
 * - components/auth/signup-form: 회원가입 폼 컴포넌트
 */

import SignupForm from "@/components/auth/signup-form";

interface SignUpCustomPageProps {
  searchParams: Promise<{ type?: "retailer" | "wholesaler" }>;
}

export default async function SignUpCustomPage({
  searchParams,
}: SignUpCustomPageProps) {
  const { type } = await searchParams;

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            회원가입
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Farm to Biz와 함께 성공적인 비즈니스를 시작하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <SignupForm />
      </div>
    </div>
  );
}

