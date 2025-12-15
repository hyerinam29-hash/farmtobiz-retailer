/**
 * @file components/auth/sign-in-with-redirect-wrapper.tsx
 * @description SignInWithRedirect 컴포넌트의 Suspense 래퍼
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import SignInWithRedirect from "./sign-in-with-redirect";

interface SignInWithRedirectWrapperProps {
  path: string;
  signUpUrl: string;
  afterSignInUrl?: string;
  fallbackRedirectUrl?: string;
  forceRedirectUrl?: string;
  appearance?: {
    elements?: {
      rootBox?: string;
      card?: string;
    };
  };
  onboardingUrl?: string;
}

export default function SignInWithRedirectWrapper(
  props: SignInWithRedirectWrapperProps,
) {
  // 1. 마운트 여부를 확인하는 상태 추가
  const [isMounted, setIsMounted] = useState(false);

  // 2. 컴포넌트가 브라우저에 마운트된 직후에 true로 변경
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. 서버 사이드 렌더링(SSR) 중이거나 초기 하이드레이션 중일 때는
  //    아무것도 렌더링하지 않거나 로딩 UI를 보여주어 불일치 에러를 방지함
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-gray-600">로딩 중...</div>
      </div>
    );
  }

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

