import type { MetadataRoute } from "next";

/**
 * PWA Manifest 설정
 * Next.js 15 권장 방식: app/manifest.ts 사용
 * 
 * 이 파일은 웹 앱이 모바일 기기에 설치될 때 사용되는 메타데이터를 정의합니다.
 * 브라우저가 이 정보를 사용하여 앱 아이콘, 이름, 테마 색상 등을 설정합니다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FarmToBiz - 도매와 소매를 연결하는 B2B 중개 플랫폼",
    short_name: "FarmToBiz",
    description:
      "도매의 민감 정보를 노출하지 않으면서 소매가 여러 도매의 상품을 비교하고 주문할 수 있는 B2B 플랫폼",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["business", "shopping", "productivity"],
    lang: "ko",
    dir: "ltr",
  };
}
