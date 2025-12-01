/**
 * @file components/auth/sign-up-with-wholesaler-block.tsx
 * @description SignUp 컴포넌트 래퍼 - 도매 계정 중복 가입 차단 모달 표시
 *
 * Clerk의 SignUp 컴포넌트를 래핑하여 도매 계정으로 이미 가입된 사용자가
 * 소매 계정으로 중복 가입 시도 시 차단 모달을 표시합니다.
 *
 * 주요 기능:
 * 1. 회원가입 후 동기화 완료 시 역할 확인
 * 2. 도매 계정(wholesaler) 감지 시 차단 모달 표시
 * 3. 모달에서 도매점 로그인 페이지로 이동 옵션 제공
 *
 * @dependencies
 * - @clerk/nextjs (SignUp, useUser, useClerk)
 * - next/navigation (useRouter)
 * - react (useState, useEffect, useRef)
 * - components/ui/dialog (모달)
 */

"use client";

import { SignUp, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignUpWithWholesalerBlockProps {
  afterSignUpUrl?: string;
  forceRedirectUrl?: string;
  routing?: "path" | "hash" | "virtual";
  path?: string;
  appearance?: React.ComponentProps<typeof SignUp>["appearance"];
}

export default function SignUpWithWholesalerBlock({
  afterSignUpUrl,
  forceRedirectUrl,
  routing = "path",
  path = "/sign-up",
  appearance,
}: SignUpWithWholesalerBlockProps) {
  const [showWholesalerBlockModal, setShowWholesalerBlockModal] =
    useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const prevSignedInRef = useRef(false);
  const hasCheckedRef = useRef(false);
  const modalShownRef = useRef(false);

  // 회원가입 성공 후 역할 확인
  useEffect(() => {
    // 회원가입 성공 감지 (로그인 상태로 변경됨)
    if (isLoaded && isSignedIn && !prevSignedInRef.current && !hasCheckedRef.current) {
      console.log("🔍 [SignUp Block] 회원가입 성공 감지 - 역할 확인 시작");
      hasCheckedRef.current = true;

      // 역할 확인 API 호출
      const checkUserRole = async () => {
        try {
          console.log("📡 [SignUp Block] /api/check-role API 호출");
          const response = await fetch("/api/check-role");
          const data = await response.json();
          console.log("✅ [SignUp Block] 역할 확인 결과:", data.role);
          return data.role; // 'retailer' | 'wholesaler' | 'admin' | null
        } catch (error) {
          console.error("❌ [SignUp Block] 역할 확인 실패:", error);
          return null;
        }
      };

      // 약간의 지연 후 역할 확인 (동기화 완료 대기)
      setTimeout(() => {
        checkUserRole().then((role) => {
          if (role === "wholesaler" && !modalShownRef.current) {
            console.log("🚫 [SignUp Block] 도매점 계정 감지 - 차단 모달 표시");
            modalShownRef.current = true;
            setShowWholesalerBlockModal(true);

            // Clerk 세션 종료 (로그아웃 처리)
            signOut({ redirectUrl: window.location.href }).catch((error) => {
              console.error("❌ [SignUp Block] 로그아웃 실패:", error);
            });
          } else {
            console.log("✅ [SignUp Block] 소매점 계정 또는 역할 없음 - 정상 진행");
          }
        });
      }, 1000); // 1초 대기 (동기화 완료 대기)
    }

    // 이전 로그인 상태 업데이트
    if (isLoaded) {
      prevSignedInRef.current = isSignedIn;
    }
  }, [isSignedIn, isLoaded, signOut]);

  // Clerk 에러 메시지 감지 (이미 가입된 이메일 등)
  useEffect(() => {
    if (modalShownRef.current) return; // 이미 모달이 표시되었으면 중단

    let checkCount = 0;
    const MAX_CHECKS = 200; // 최대 10초간 체크 (50ms * 200)
    let intervalId: NodeJS.Timeout | null = null;

    const checkForClerkError = () => {
      if (modalShownRef.current) return true;

      checkCount++;

      // 전체 document에서 에러 메시지 찾기
      const allText = document.body.textContent || "";
      const allTextLower = allText.toLowerCase();

      // 이미 가입된 이메일 에러 패턴
      const errorPatterns = [
        "already exists",
        "already registered",
        "email already",
        "이미 존재",
        "이미 등록",
      ];

      // 에러 패턴 감지
      const foundPatterns = errorPatterns.filter((pattern) =>
        allTextLower.includes(pattern),
      );

      if (foundPatterns.length > 0) {
        console.log("🔍 [SignUp Block] 이미 가입된 계정 에러 감지 - 역할 확인 시작");
        
        // 역할 확인하여 도매 계정이면 차단 모달 표시
        const checkUserRole = async () => {
          try {
            const response = await fetch("/api/check-role");
            const data = await response.json();
            if (data.role === "wholesaler" && !modalShownRef.current) {
              console.log("🚫 [SignUp Block] 도매점 계정 감지 - 차단 모달 표시");
              modalShownRef.current = true;
              setShowWholesalerBlockModal(true);
            }
          } catch (error) {
            console.error("❌ [SignUp Block] 역할 확인 실패:", error);
          }
        };

        checkUserRole();
        return true;
      }

      return false;
    };

    // 즉시 체크
    if (checkForClerkError()) {
      return;
    }

    // MutationObserver로 DOM 변화 감지
    const observer = new MutationObserver(() => {
      checkForClerkError();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // 주기적 체크
    intervalId = setInterval(() => {
      const detected = checkForClerkError();
      if (detected || checkCount >= MAX_CHECKS) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        observer.disconnect();
      }
    }, 50);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      observer.disconnect();
    };
  }, []);

  // 모달 확인 핸들러 (모달 닫기)
  const handleConfirm = () => {
    console.log("📝 [Modal] 확인 버튼 클릭 - 모달 닫기");
    setShowWholesalerBlockModal(false);
  };

  // 도매점 로그인 페이지로 이동 핸들러
  const handleGoToWholesalerLogin = () => {
    console.log("📝 [Modal] 도매점 로그인 페이지로 이동");
    setShowWholesalerBlockModal(false);
    router.push("/sign-in/wholesaler");
  };

  // SignUp 컴포넌트 props 준비
  // routing="path"일 때는 path prop을 사용할 수 없음 (Clerk 타입 제약)
  const signUpProps: any = {
    appearance,
    afterSignUpUrl,
    forceRedirectUrl,
    routing,
  };
  
  if (routing !== "path") {
    signUpProps.path = path;
  }

  return (
    <>
      <SignUp {...signUpProps} />

      {/* 도매 계정 차단 모달 */}
      <Dialog
        open={showWholesalerBlockModal}
        onOpenChange={setShowWholesalerBlockModal}
        modal={true}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          style={{ zIndex: 9999 }}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              도매점 계정은 소매점 로그인을 사용할 수 없습니다
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 pt-2">
              <div className="space-y-1">
                <p>도매점 계정으로는 소매점 로그인 페이지에서 로그인 할 수 없습니다.</p>
                <p>도매점 로그인 페이지를 이용해주세요.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleConfirm}
              className="flex-1 sm:flex-initial border-gray-300 bg-white text-black hover:bg-gray-50"
            >
              확인
            </Button>
            <Button
              type="button"
              onClick={handleGoToWholesalerLogin}
              className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white"
            >
              도매점 로그인 페이지로 이동
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

