/**
 * @file components/auth/sign-in-with-redirect.tsx
 * @description SignIn 컴포넌트 래퍼 - Clerk 에러 감지 시 커스텀 모달 표시
 *
 * Clerk의 SignIn 컴포넌트를 래핑하여 가입되지 않은 계정으로 로그인 시도 시
 * 커스텀 모달을 표시하고 온보딩 페이지로 리다이렉트하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. Clerk 컴포넌트의 자체 에러 감지
 * 2. "External Account was not found" 등의 계정 없음 에러 감지
 * 3. 커스텀 모달 표시
 * 4. 온보딩 페이지로 리다이렉트
 *
 * @dependencies
 * - @clerk/nextjs (SignIn)
 * - next/navigation (useRouter)
 * - react (useState, useEffect)
 * - components/ui/dialog (모달)
 */

"use client";

import { SignIn, useUser, useClerk } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// 🚨 파일 로드 확인 및 전역 에러 감지 리스너 등록
if (typeof window !== "undefined") {
  console.log("=".repeat(80));
  console.log(
    "🚨🚨🚨 [FILE LOADED] sign-in-with-redirect.tsx 파일이 로드되었습니다!",
  );
  console.log("=".repeat(80));

  // 🔥 전역 에러 감지 시스템 (컴포넌트 언마운트 후에도 작동)
  if (!(window as any).__clerkErrorListenerActive) {
    (window as any).__clerkErrorListenerActive = true;
    console.log("🔧 [Global System] 전역 에러 감지 시스템 활성화");

    let globalCheckCount = 0;
    let globalIntervalId: NodeJS.Timeout | null = null;
    let globalModalShown = false;

    const globalErrorCheck = () => {
      globalCheckCount++;

      const allText = document.body.textContent || "";
      const allTextLower = allText.toLowerCase();

      // 에러 패턴 체크
      const errorPatterns = [
        "the external account was not found",
        "external account was not found",
        "external account not found",
      ];

      const foundPatterns = errorPatterns.filter((pattern) =>
        allTextLower.includes(pattern),
      );

      if (foundPatterns.length > 0 && !globalModalShown) {
        console.log("=".repeat(80));
        console.log("✅✅✅ [Global System] External Account 에러 감지!");
        console.log("📝 [Global System] 발견된 패턴:", foundPatterns);
        console.log("=".repeat(80));

        globalModalShown = true;

        // 모달을 표시하기 위해 커스텀 이벤트 발생
        window.dispatchEvent(
          new CustomEvent("clerk-external-account-error", {
            detail: { patterns: foundPatterns },
          }),
        );

        // 전역 모달 표시 함수 호출 (있는 경우)
        if ((window as any).showSignUpModal) {
          (window as any).showSignUpModal();
        }
      }
    };

    // 전역 MutationObserver
    const globalObserver = new MutationObserver(() => {
      const allText = document.body.textContent?.toLowerCase() || "";
      if (
        allText.includes("external account") &&
        allText.includes("not found")
      ) {
        console.log("🔍 [Global System] MutationObserver - 에러 감지!");
        globalErrorCheck();
      }
    });

    // 전역 체크 시작
    const startGlobalCheck = () => {
      if (globalIntervalId) return; // 이미 실행 중

      console.log("🚀 [Global System] 전역 체크 시작");
      globalObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      globalIntervalId = setInterval(() => {
        globalErrorCheck();
        if (globalCheckCount >= 400) {
          // 20초 후 중단
          if (globalIntervalId) {
            clearInterval(globalIntervalId);
            globalIntervalId = null;
          }
        }
      }, 50);
    };

    // 페이지 로드 시 시작
    if (document.readyState === "complete") {
      startGlobalCheck();
    } else {
      window.addEventListener("load", startGlobalCheck);
      document.addEventListener("DOMContentLoaded", startGlobalCheck);
    }

    // 페이지 전환 감지
    window.addEventListener("popstate", () => {
      console.log("🔍 [Global System] 페이지 전환 감지 - 체크 재시작");
      globalCheckCount = 0;
      globalModalShown = false;
      if (globalIntervalId) {
        clearInterval(globalIntervalId);
        globalIntervalId = null;
      }
      startGlobalCheck();
    });
  }
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignInWithRedirectProps {
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
   * 회원가입 페이지 URL (리다이렉트 대상)
   */
  /**
   * 온보딩 페이지 URL (모달 확인 후 이동할 페이지)
   */
  onboardingUrl?: string;
}

export default function SignInWithRedirect({
  path,
  signUpUrl,
  afterSignInUrl,
  fallbackRedirectUrl,
  forceRedirectUrl,
  appearance,
  onboardingUrl,
}: SignInWithRedirectProps) {
  // 🚨 컴포넌트가 렌더링되는지 확인
  console.log("🚨🚨🚨 [SignInWithRedirect] 컴포넌트 렌더링됨!");
  console.log("📋 [SignInWithRedirect] Props:", {
    path,
    signUpUrl,
    onboardingUrl,
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showWholesalerBlockModal, setShowWholesalerBlockModal] =
    useState(false);
  const [showDuplicateAccountModal, setShowDuplicateAccountModal] =
    useState(false);
  const [isWholesalerChecking, setIsWholesalerChecking] = useState(false); // 도매 계정 확인 중 상태
  const [roleCheckComplete, setRoleCheckComplete] = useState(false); // 역할 확인 완료 상태
  const prevSignedInRef = useRef(false);
  const duplicateCheckRef = useRef(false);
  const roleCheckStartedRef = useRef(false); // 역할 확인 시작 여부

  // 🎯 /sign-in/create 경로 감지: 소셜 로그인 중복 가입 시도 시 Clerk가 리다이렉트하는 경로
  useEffect(() => {
    if (duplicateCheckRef.current) return;

    // 현재 경로가 /sign-in/create인지 확인
    const isCreatePath =
      pathname?.includes("/sign-in/create") ||
      pathname?.includes("/sign-in/sso-callback") ||
      window.location.pathname.includes("/sign-in/create");

    // redirect_url에 sign-up/create/sso-callback이 포함되어 있는지 확인
    const redirectUrl = searchParams?.get("redirect_url") || "";
    const hasSsoCallback =
      redirectUrl.includes("sso-callback") ||
      redirectUrl.includes("sign_up_force_redirect");

    console.log("🔍 [Duplicate Check] 경로 확인:", {
      pathname,
      isCreatePath,
      redirectUrl: redirectUrl.substring(0, 100),
      hasSsoCallback,
    });

    // /sign-in/create로 리다이렉트되었고 SSO 콜백 관련 URL이면 중복 가입 시도
    if (isCreatePath && hasSsoCallback) {
      console.log(
        "🚫 [Duplicate Check] 소셜 로그인 중복 가입 감지 - 모달 표시",
      );
      duplicateCheckRef.current = true;
      setShowDuplicateAccountModal(true);
    }
  }, [pathname, searchParams]);

  // 🎯 전역 에러 감지: Clerk가 DOM에 렌더링하는 에러 메시지를 감지
  useEffect(() => {
    // 🔥 전역 이벤트 리스너 등록 (전역 시스템에서 발생한 이벤트 감지)
    const handleGlobalError = (event: CustomEvent) => {
      setShowSignUpModal(true);
    };

    window.addEventListener(
      "clerk-external-account-error",
      handleGlobalError as EventListener,
    );

    // 전역 모달 표시 함수 등록
    (window as any).showSignUpModal = () => {
      console.log("🔧 [Component] 전역 함수 호출 - 모달 표시");
      setShowSignUpModal(true);
    };

    let checkCount = 0;
    const MAX_CHECKS = 400; // 최대 20초간 체크 (50ms * 400)
    let intervalId: NodeJS.Timeout | null = null;
    let hasDetected = false; // 중복 감지 방지
    let modalShown = false; // 모달이 이미 표시되었는지 추적

    const checkForClerkError = () => {
      if (hasDetected) return true; // 이미 감지했으면 중단

      checkCount++;

      // 전체 document에서 에러 메시지 찾기
      const allText = document.body.textContent || "";
      const allTextLower = allText.toLowerCase();

      // 🔥 로그 출력 빈도 조절 (20번마다 - 50ms * 20 = 1초마다)
      const shouldLog = checkCount % 20 === 0;

      // 🔥 더 많은 에러 메시지 변형 체크
      const errorPatterns = [
        "the external account was not found",
        "external account was not found",
        "external account not found",
        "account was not found",
        "account not found",
        "external account",
        "not found",
      ];

      // 에러 패턴 감지
      const foundPatterns = errorPatterns.filter((pattern) =>
        allTextLower.includes(pattern),
      );

      if (foundPatterns.length >= 2) {
        // 최소 2개 이상의 패턴이 일치하면 에러로 판단
        console.log("=".repeat(60));
        console.log("✅✅✅ [Global Listener] External Account 에러 감지!");
        console.log("📝 [Global Listener] 발견된 패턴:", foundPatterns);
        console.log(
          "📝 [Global Listener] 감지된 텍스트 샘플:",
          allText.substring(0, 500),
        );
        console.log("=".repeat(60));

        if (!modalShown) {
          hasDetected = true;
          modalShown = true;
          setShowSignUpModal(true);
        }
        return true; // 감지 성공
      }

      // 특정 선택자들도 확인
      const errorSelectors = [
        "[role='alert']",
        ".cl-alert",
        ".cl-alertText",
        "[class*='alert']",
        "[class*='error']",
        "[data-localization-key*='error']",
        "[data-localization-key*='not_found']",
        "[data-localization-key*='external']",
      ];

      for (const selector of errorSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach((element, index) => {
            const text = element.textContent?.toLowerCase() || "";
            if (text.length > 0) {
              // 에러 관련 텍스트가 있으면 상세 로그
              if (
                text.includes("external") ||
                text.includes("account") ||
                text.includes("not found")
              )
                if (
                  text.includes("external account") &&
                  text.includes("not found")
                ) {
                  console.log("=".repeat(60));
                  console.log(
                    `✅✅✅ [Global Listener] 요소 ${index}에서 에러 감지!`,
                  );
                  console.log(
                    `📝 [Global Listener] 전체 텍스트: ${text.substring(
                      0,
                      300,
                    )}`,
                  );
                  console.log("=".repeat(60));

                  if (!modalShown) {
                    hasDetected = true;
                    modalShown = true;
                    setShowSignUpModal(true);
                  }
                  return true; // 감지 성공
                }
            }
          });
        }
      }

      return false; // 아직 감지 못함
    };

    // 즉시 체크
    if (checkForClerkError()) {
      console.log("✅ [Global Listener] 즉시 감지됨!");
      return;
    }

    // 🔥 MutationObserver 추가: DOM 변화 즉시 감지
    const observer = new MutationObserver((mutations) => {
      // 에러 관련 변화만 로그 출력 (너무 많으면 성능 저하)
      const hasRelevantChange = mutations.some((mutation) => {
        const target = mutation.target as HTMLElement;
        const text = target.textContent?.toLowerCase() || "";
        return (
          text.includes("external") ||
          text.includes("account") ||
          text.includes("not found")
        );
      });

      if (hasRelevantChange) {
        console.log(
          "🔍 [MutationObserver] 에러 관련 DOM 변화 감지 - 즉시 체크 실행",
        );
        if (checkForClerkError() && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          observer.disconnect();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "role", "data-localization-key"],
    });

    // 주기적 체크 (50ms마다 - 더 빠른 감지)
    intervalId = setInterval(() => {
      const detected = checkForClerkError();

      if (detected || checkCount >= MAX_CHECKS) {
        console.log(
          `🛑 [Global Listener] 체크 종료 (detected: ${detected}, count: ${checkCount}, 시간: ${(
            (checkCount * 50) /
            1000
          ).toFixed(1)}초)`,
        );
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        observer.disconnect();
      }
    }, 50); // 🔥 50ms로 단축

    // 🔥 window error 이벤트 리스너 추가
    const handleWindowError = (event: ErrorEvent) => {
      const errorMessage = event.message?.toLowerCase() || "";
      const errorSource = event.filename || "";

      console.log("🔍 [Window Error] 에러 이벤트:", {
        message: errorMessage,
        source: errorSource,
      });

      if (
        errorMessage.includes("external account") ||
        errorMessage.includes("not found") ||
        errorSource.includes("clerk")
      ) {
        console.log("✅✅✅ [Window Error] External Account 에러 감지!");
        if (!modalShown) {
          hasDetected = true;
          modalShown = true;
          setShowSignUpModal(true);
        }
      }
    };

    // 🔥 페이지 로드/변경 시에도 체크
    const handlePageLoad = () => {
      console.log("🔍 [Page Load] 페이지 로드/변경 감지 - 즉시 체크 실행");
      setTimeout(() => {
        checkForClerkError();
      }, 100);
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("load", handlePageLoad);
    window.addEventListener("popstate", handlePageLoad);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      observer.disconnect();
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("load", handlePageLoad);
      window.removeEventListener("popstate", handlePageLoad);
      window.removeEventListener(
        "clerk-external-account-error",
        handleGlobalError as EventListener,
      );
      delete (window as any).showSignUpModal;
      console.log("🛑 [Global Listener] 리스너 정리");
    };
  }, []);

  // 모달 상태 추적
  useEffect(() => {
    if (showSignUpModal) {
      console.log("=".repeat(60));
      console.log("🎯🎯🎯 [Modal] 모달이 열렸습니다!");
      console.log("=".repeat(60));
    } else {
      console.log("🔒 [Modal] 모달이 닫혔습니다.");
    }
  }, [showSignUpModal]);

  // 에러 메시지 숨김 처리: 모달이 표시되면 Clerk 에러 메시지 숨기기
  useEffect(() => {
    if (showSignUpModal) {
      console.log("🔧 [Modal] Clerk 에러 메시지 숨김 처리 시작");

      // Clerk 에러 메시지 요소 찾기 및 숨김
      const hideErrorMessages = () => {
        const errorSelectors = [
          "[role='alert']",
          ".cl-alert",
          ".cl-alertText",
          "[class*='alert']",
          "[class*='error']",
          "[data-localization-key*='error']",
          "[data-localization-key*='not_found']",
          "[data-localization-key*='external']",
        ];

        errorSelectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            const text = element.textContent?.toLowerCase() || "";
            if (
              text.includes("external account") ||
              text.includes("not found") ||
              text.includes("account was not found")
            ) {
              (element as HTMLElement).style.display = "none";
              console.log("✅ [Modal] 에러 메시지 숨김:", selector);
            }
          });
        });
      };

      // 즉시 실행
      hideErrorMessages();

      // DOM 변화 감지를 위한 MutationObserver
      const observer = new MutationObserver(() => {
        hideErrorMessages();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "role", "data-localization-key"],
      });

      return () => {
        observer.disconnect();
        console.log("🛑 [Modal] 에러 메시지 숨김 처리 정리");
      };
    }
  }, [showSignUpModal]);

  // 도매점 계정 차단 로직: 로그인 성공 후 역할 확인
  // ⚠️ 핵심: 로그인 상태가 되면 즉시 역할 확인, Clerk 리다이렉트보다 먼저 실행
  useEffect(() => {
    // 소매점 로그인 페이지에서만 체크
    const isRetailerPage =
      pathname?.includes("/retailer") || path?.includes("/retailer");
    if (!isRetailerPage) {
      return;
    }

    // 로그인 완료 상태이고, 아직 역할 확인을 시작하지 않았으면
    if (isLoaded && isSignedIn && !roleCheckStartedRef.current) {
      console.log("🔍 [Wholesaler Block] 로그인 상태 감지 - 역할 확인 시작");
      roleCheckStartedRef.current = true; // 중복 실행 방지
      setIsWholesalerChecking(true);

      // 역할 확인 API 호출
      const checkUserRole = async () => {
        try {
          console.log("📡 [Wholesaler Block] /api/check-role API 호출");
          const response = await fetch("/api/check-role");
          const data = await response.json();
          console.log("✅ [Wholesaler Block] 역할 확인 결과:", data.role);
          return data.role; // 'retailer' | 'wholesaler' | 'admin' | null
        } catch (error) {
          console.error("❌ [Wholesaler Block] 역할 확인 실패:", error);
          return null;
        }
      };

      checkUserRole().then((role) => {
        setRoleCheckComplete(true);

        if (role === "wholesaler") {
          console.log(
            "🚫 [Wholesaler Block] 도매점 계정 감지 - 차단 모달 표시",
          );
          setShowWholesalerBlockModal(true);
          // signOut은 모달에서 확인 버튼 클릭 시 실행
        } else {
          console.log(
            "✅ [Wholesaler Block] 소매점 계정 또는 역할 없음 - 정상 진행",
          );
          setIsWholesalerChecking(false);

          // 소매점 계정이면 수동으로 리다이렉트
          const targetUrl =
            forceRedirectUrl || fallbackRedirectUrl || "/retailer/dashboard";
          console.log(
            "🔀 [Wholesaler Block] 소매점 계정 - 수동 리다이렉트:",
            targetUrl,
          );
          window.location.href = targetUrl;
        }
      });
    }

    // 이전 로그인 상태 업데이트
    if (isLoaded) {
      prevSignedInRef.current = isSignedIn ?? false;
    }
  }, [
    isSignedIn,
    isLoaded,
    pathname,
    path,
    forceRedirectUrl,
    fallbackRedirectUrl,
  ]);

  // 도매 계정 확인 중일 때 페이지 이탈(리다이렉트) 방지
  useEffect(() => {
    if (!isWholesalerChecking && !showWholesalerBlockModal) return;

    console.log("🛡️ [Wholesaler Block] 페이지 이탈 방지 활성화");

    // history.pushState를 가로채서 리다이렉트 방지
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = function (...args) {
      if (isWholesalerChecking || showWholesalerBlockModal) {
        console.log("🛡️ [Wholesaler Block] pushState 차단:", args[2]);
        return;
      }
      return originalPushState(...args);
    };

    history.replaceState = function (...args) {
      if (isWholesalerChecking || showWholesalerBlockModal) {
        console.log("🛡️ [Wholesaler Block] replaceState 차단:", args[2]);
        return;
      }
      return originalReplaceState(...args);
    };

    // window.location 변경 감지 (완전한 차단은 불가능하지만 로그는 가능)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showWholesalerBlockModal) {
        console.log("🛡️ [Wholesaler Block] beforeunload 이벤트 발생");
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      console.log("🛡️ [Wholesaler Block] 페이지 이탈 방지 해제");
    };
  }, [isWholesalerChecking, showWholesalerBlockModal]);

  // 소매사업자 확인 로직 (사용하지 않지만 타입 호환성을 위해 유지)

  // 모달 확인 핸들러
  const handleSignUpConfirm = () => {
    console.log("=".repeat(60));
    console.log("📝 [Modal] 확인 버튼 클릭!");

    // 모달 확인 후 소매 로그인 페이지로 리다이렉트
    const redirectUrl = pathname?.includes("/retailer")
      ? pathname
      : path?.includes("/retailer")
      ? path
      : "/sign-in/retailer";

    console.log("📝 [Modal] 리다이렉트 대상:", redirectUrl);
    console.log("📝 [Modal] pathname (현재 경로):", pathname);
    console.log("📝 [Modal] path prop:", path);
    console.log("=".repeat(60));

    setShowSignUpModal(false);

    // 같은 페이지로 리다이렉트할 때는 window.location을 사용하여 강제 새로고침
    // router.push는 같은 페이지로 이동할 때 작동하지 않을 수 있음
    window.location.href = redirectUrl;
  };

  const userTypeMessage =
    "소매사업자로 시작하려면 먼저 회원가입을 진행해주세요.";

  // 소매점 로그인 페이지인지 확인
  const isRetailerSignIn =
    pathname?.includes("/retailer") || path?.includes("/retailer");

  // ⚠️ 핵심: 로그인 완료 상태에서는 SignIn 컴포넌트를 렌더링하지 않음
  // Clerk SignIn 컴포넌트가 isSignedIn=true일 때 자동 리다이렉트하는 것을 방지
  const shouldHideSignIn = isRetailerSignIn && isLoaded && isSignedIn;

  return (
    <>
      {/* 역할 확인 중일 때 로딩 표시 */}
      {shouldHideSignIn && !roleCheckComplete && (
        <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">계정 정보를 확인하고 있습니다...</p>
        </div>
      )}

      {/* 로그인 완료 상태가 아닐 때만 SignIn 컴포넌트 렌더링 */}
      {!shouldHideSignIn && (
        <SignIn
          appearance={appearance}
          routing="path"
          path={path}
          signUpUrl={signUpUrl}
          fallbackRedirectUrl={
            isRetailerSignIn ? undefined : fallbackRedirectUrl || afterSignInUrl
          }
          forceRedirectUrl={isRetailerSignIn ? undefined : forceRedirectUrl}
        />
      )}

      {/* 회원가입 안내 모달 */}
      <Dialog
        open={showSignUpModal}
        onOpenChange={setShowSignUpModal}
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
              회원가입을 먼저 진행하세요!
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              가입되지 않은 계정으로 로그인을 시도하셨습니다.
              <br />
              {userTypeMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSignUpModal(false)}
              className="min-w-20"
            >
              취소
            </Button>
            <Button
              onClick={handleSignUpConfirm}
              className="min-w-20 bg-blue-600 hover:bg-blue-700"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 도매점 계정 차단 모달 */}
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
            <DialogDescription className="pt-2 text-base">
              도매점 계정으로는 소매점 로그인 페이지에서 로그인할 수 없습니다.
              <br />
              도매점 로그인 페이지를 이용해주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={async () => {
                setShowWholesalerBlockModal(false);
                // 모달 확인 후 로그아웃 처리
                try {
                  await signOut({ redirectUrl: "/sign-in/retailer" });
                } catch (error) {
                  console.error("❌ [Wholesaler Block] 로그아웃 실패:", error);
                  window.location.href = "/sign-in/retailer";
                }
              }}
              className="min-w-72 bg-green-600 hover:bg-green-700 text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 중복 계정 모달 (소셜 로그인 중복 가입 시도) */}
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
            {/* 경고 아이콘 */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
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
              onClick={() => {
                setShowDuplicateAccountModal(false);
                // 소매점 로그인 페이지로 이동
                window.location.href = "/sign-in/retailer";
              }}
              className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-base font-medium"
            >
              로그인하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
