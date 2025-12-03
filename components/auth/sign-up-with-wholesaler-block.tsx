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
import { AlertCircle } from "lucide-react";

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
  const [showDuplicateAccountModal, setShowDuplicateAccountModal] =
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
    let isProcessing = false; // 처리 중 플래그 (무한 루프 방지)
    let observer: MutationObserver | null = null;

    const checkForClerkError = () => {
      if (modalShownRef.current || isProcessing) {
        return true; // 처리 중이면 중단
      }

      checkCount++;

      // Clerk 에러 요소 직접 확인
      const clerkErrorElements = document.querySelectorAll(
        '[role="alert"], .cl-alert, .cl-alertText, .cl-formFieldErrorText'
      );

      let foundErrorInElements = false;

      for (const element of clerkErrorElements) {
        const text = element.textContent || "";
        const textLower = text.toLowerCase();

        // 중복 가입 관련 에러 패턴만 확인
        const isDuplicateError =
          (textLower.includes("already") && textLower.includes("exists")) ||
          (textLower.includes("already") && textLower.includes("registered")) ||
          (textLower.includes("email") && textLower.includes("taken")) ||
          (textLower.includes("identifier") && textLower.includes("exists")) ||
          textLower.includes("이미 존재") ||
          textLower.includes("이미 등록") ||
          textLower.includes("이미 가입");

        if (isDuplicateError) {
          foundErrorInElements = true;
          break;
        }
      }

      // 에러가 발견되면 처리
      if (foundErrorInElements) {
        isProcessing = true;
        
        // Observer와 interval 즉시 정리 (무한 루프 방지)
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        if (observer) {
          observer.disconnect();
          observer = null;
        }

        // 이메일 추출 시도 (여러 방법)
        let email: string | null = null;

        // 방법 1: 이메일 입력 필드에서 추출
        const emailInput = document.querySelector<HTMLInputElement>(
          'input[type="email"], input[name="emailAddress"], input[id*="email"]'
        );
        email = emailInput?.value?.trim().toLowerCase() || null;

        // 방법 2: Clerk 에러 요소에서 이메일 추출 시도
        if (!email) {
          const errorElements = document.querySelectorAll('[role="alert"], .cl-alert, .cl-alertText');
          const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
          for (const element of errorElements) {
            const text = element.textContent || "";
            const emailMatch = text.match(emailRegex);
            if (emailMatch) {
              email = emailMatch[0].toLowerCase();
              break;
            }
          }
        }

        // 방법 3: 전체 페이지에서 이메일 패턴 추출 (마지막 수단)
        if (!email) {
          const bodyText = document.body.textContent || "";
          const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
          const emailMatches = bodyText.match(emailRegex);
          if (emailMatches && emailMatches.length > 0) {
            email = emailMatches[0].toLowerCase();
          }
        }
        
        // 이메일 기반 역할 확인 API 호출 (Supabase에서 확인)
        const checkUserRoleByEmail = async () => {
          try {
            // 이메일이 있는 경우에만 역할 확인 API 호출
            if (email) {
              const response = await fetch(`/api/check-role-by-email?email=${encodeURIComponent(email)}`);

              if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
              }

              const data = await response.json();

              // 도매 계정인 경우
              if (data.role === "wholesaler" && !modalShownRef.current) {
                modalShownRef.current = true;
                setShowWholesalerBlockModal(true);
                return;
              }
            }

            // 일반 사용자 또는 소매 사업자인 경우
            if (!modalShownRef.current) {
              modalShownRef.current = true;
              setShowDuplicateAccountModal(true);
            }
          } catch (error) {
            console.error("❌ [SignUp Block] 역할 확인 실패:", error);
            // 역할 확인 실패 시에도 중복 가입 모달 표시
            if (!modalShownRef.current) {
              modalShownRef.current = true;
              setShowDuplicateAccountModal(true);
            }
          } finally {
            isProcessing = false;
          }
        };

        checkUserRoleByEmail();
        return true;
      }

      return false;
    };

    // window error 이벤트 리스너 추가 (더 빠른 에러 감지)
    const handleWindowError = (event: ErrorEvent) => {
      const errorMessage = event.message?.toLowerCase() || "";

      // 중복 가입 관련 에러만 감지 (더 엄격한 조건)
      const isDuplicateError =
        (errorMessage.includes("already") && errorMessage.includes("exists")) ||
        (errorMessage.includes("already") && errorMessage.includes("registered")) ||
        (errorMessage.includes("identifier") && errorMessage.includes("exists"));

      if (isDuplicateError) {
        if (!modalShownRef.current && !isProcessing) {
          isProcessing = true;
          checkForClerkError();
        }
      }
    };

    // 페이지 리다이렉트 감지 및 차단
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isProcessing && !modalShownRef.current) {
        event.preventDefault();
      }
    };

    // 즉시 체크
    if (checkForClerkError()) {
      return;
    }

    // MutationObserver 개선: 중복 가입 관련 에러만 감지 (오탐지 방지)
    observer = new MutationObserver((mutations) => {
      // 중복 가입 관련 DOM 변화만 감지 (더 엄격한 조건)
      const hasErrorChange = mutations.some((mutation) => {
        const target = mutation.target as HTMLElement;
        const text = target.textContent?.toLowerCase() || "";
        // "already"와 "exists" 또는 "registered"가 함께 있어야 함
        return (
          (text.includes("already") && text.includes("exists")) ||
          (text.includes("already") && text.includes("registered")) ||
          (text.includes("email") && text.includes("taken")) ||
          text.includes("이미 존재") ||
          text.includes("이미 등록")
        );
      });

      if (hasErrorChange) {
        checkForClerkError();
      }
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
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    }, 50);

    // 이벤트 리스너 등록
    window.addEventListener("error", handleWindowError);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

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

  // 로그인 페이지로 이동 핸들러
  const handleGoToLogin = () => {
    console.log("📝 [Modal] 로그인 페이지로 이동");
    setShowDuplicateAccountModal(false);
    router.push("/sign-in/retailer");
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

      {/* 중복 가입 모달 */}
      <Dialog
        open={showDuplicateAccountModal}
        onOpenChange={setShowDuplicateAccountModal}
        modal={true}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          style={{ zIndex: 9999 }}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center space-y-4">
            {/* 경고 아이콘 - 이미지와 동일한 스타일 */}
            <div className="flex justify-center">
              <div className="relative">
                {/* 그림자 효과를 위한 배경 */}
                <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50"></div>
                {/* 노란색 원 배경 */}
                <div className="relative w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-yellow-600" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center text-gray-900">
              이미 가입된 계정입니다
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-600">
              이미 가입된 계정입니다. 로그인을 시도하세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-4">
            <Button
              type="button"
              onClick={handleGoToLogin}
              className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-base font-medium"
            >
              로그인하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

