'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * @file PWAInstallBanner.tsx
 * @description PWA 설치 배지 컴포넌트
 *
 * 모바일 브라우저에서 "앱 설치" 배지를 표시하여
 * 사용자가 홈 화면에 추가할 수 있도록 안내합니다.
 *
 * @dependencies
 * - 브라우저의 BeforeInstallPrompt 이벤트
 * - lucide-react 아이콘
 * - shadcn/ui Button 컴포넌트
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log('[PWA Install Banner] 초기화 중...');

    // 이미 설치된 경우 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA Install Banner] 이미 설치된 PWA로 실행 중');
      setIsInstalled(true);
      return;
    }

    // 로컬 스토리지에서 배지 표시 여부 확인
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (bannerDismissed === 'true') {
      console.log('[PWA Install Banner] 사용자가 배지를 닫았음');
      return;
    }

    // PWA 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
      console.log('[PWA Install Banner] 설치 가능 상태, 배지 표시');
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    // 앱이 설치되면 배지 숨김
    window.addEventListener('appinstalled', () => {
      console.log('[PWA Install Banner] 앱 설치 완료');
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

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

    console.log('[PWA Install Banner] 설치 프롬프트 표시');
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA Install Banner] 사용자 선택:', outcome);

    if (outcome === 'accepted') {
      console.log('[PWA Install Banner] 사용자가 설치 수락');
      setShowBanner(false);
      setIsInstalled(true);
    } else {
      console.log('[PWA Install Banner] 사용자가 설치 거부');
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    console.log('[PWA Install Banner] 사용자가 배지 닫기');
    localStorage.setItem('pwa-banner-dismissed', 'true');
    setShowBanner(false);
  };

  // 설치되었거나 배지를 표시하지 않아야 하는 경우
  if (isInstalled || !showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            FarmToBiz 앱 설치
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            홈 화면에 추가하여 더 빠르고 편리하게 이용하세요
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <Download className="w-4 h-4 mr-2" />
            설치
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

