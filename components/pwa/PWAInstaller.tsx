'use client';

import { useEffect, useState } from 'react';

/**
 * @file PWAInstaller.tsx
 * @description PWA 설치 및 Service Worker 등록 컴포넌트
 *
 * 이 컴포넌트는:
 * 1. Service Worker를 등록하여 오프라인 지원 및 캐싱 기능 제공
 * 2. PWA 설치 프롬프트 표시 (선택적)
 *
 * @dependencies
 * - 브라우저의 Service Worker API
 * - 브라우저의 BeforeInstallPrompt 이벤트
 */

export default function PWAInstaller() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    console.log('[PWA] Service Worker 등록 시작...');

    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            '[PWA] Service Worker 등록 성공:',
            registration.scope
          );

          // 업데이트 확인
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('[PWA] 새 버전 사용 가능');
                  // 필요시 사용자에게 새로고침 안내 가능
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker 등록 실패:', error);
        });
    } else {
      console.warn('[PWA] Service Worker를 지원하지 않는 브라우저입니다.');
    }

    // PWA 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('[PWA] 설치 가능 상태');
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    // 이미 설치된 경우 감지
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA] 이미 설치된 PWA로 실행 중');
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    console.log('[PWA] 설치 프롬프트 표시');
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] 사용자 선택:', outcome);

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
  };

  // Service Worker만 등록 (UI는 PWAInstallBanner에서 처리)
  return null;
}

// BeforeInstallPromptEvent 타입 정의
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

