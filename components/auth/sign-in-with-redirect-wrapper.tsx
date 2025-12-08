/**
 * @file components/auth/sign-in-with-redirect-wrapper.tsx
 * @description SignInWithRedirect 컴포넌트의 Suspense 래퍼
 *
 * Next.js 15에서 useSearchParams()를 사용하는 컴포넌트는
 * Suspense 경계로 감싸야 하는 요구사항을 충족하기 위한 래퍼 컴포넌트입니다.
 *
 * @dependencies
 * - react (Suspense)
 * - components/auth/sign-in-with-redirect
 */

"use client";

import { Suspense } from "react";
import SignInWithRedirect from "./sign-in-with-redirect";

interface SignInWithRedirectWrapperProps {
  /**
   * SignIn 컴포넌트에 전달할 props
   */
  path: string;
  signUpUrl: string;
  /**
   * 로그인 후 폴백 리다이렉트 URL (다른 리다이렉트 URL이 없을 때 사용)
   * @deprecated afterSignInUrl 대신 fallbackRedirectUrl 사용
   */
  afterSignInUrl?: string;
  /**
   * 로그인 후 폴백 리다이렉트 URL (새로운 API)
   */
  fallbackRedirectUrl?: string;
  /**
   * 로그인 후 강제 리다이렉트 URL (환경 변수보다 우선, 최우선순위)
   */
  forceRedirectUrl?: string;
  appearance?: {
    elements?: {
      rootBox?: string;
      card?: string;
    };
  };
  /**
   * 온보딩 페이지 URL (모달 확인 후 이동할 페이지)
   */
  onboardingUrl?: string;
}

export default function SignInWithRedirectWrapper(
  props: SignInWithRedirectWrapperProps,
) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="text-center text-gray-600">로딩 중...</div>
        </div>
      }
    >
      <SignInWithRedirect {...props} />
    </Suspense>
  );
}

