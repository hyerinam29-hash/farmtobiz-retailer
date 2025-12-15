// Service Worker for FarmToBiz PWA
const CACHE_NAME = 'farmtobiz-v1';
const RUNTIME_CACHE = 'farmtobiz-runtime-v1';

// 캐시할 정적 리소스 목록
const STATIC_ASSETS = [
  '/',
  '/logo.png',
  '/logo.ico',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// 설치 이벤트: 정적 리소스 캐싱
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 설치 중...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 정적 리소스 캐싱 중...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 활성화 이벤트: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 활성화 중...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
            );
          })
          .map((cacheName) => {
            console.log('[Service Worker] 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  return self.clients.claim();
});

// fetch 이벤트: 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }

  // 외부 API 요청은 네트워크만 사용
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('clerk.com') ||
    event.request.url.includes('supabase.co')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 네트워크 요청 시도
      return fetch(event.request)
        .then((response) => {
          // 응답이 유효한 경우 캐시에 저장
          if (
            response &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시된 응답 반환
          if (cachedResponse) {
            return cachedResponse;
          }
          // 캐시도 없으면 오프라인 페이지 반환
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
    })
  );
});

