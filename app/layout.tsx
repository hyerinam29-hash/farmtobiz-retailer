import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAInstallBanner from "@/components/pwa/PWAInstallBanner";
import "./globals.css";

// FarmToBiz 브랜딩을 위한 커스텀 localization
const customKoKR = {
  ...koKR,
  socialButtonsBlockButton: "FarmToBiz로 계속",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FarmToBiz - 도매와 소매를 연결하는 B2B 중개 플랫폼",
  description:
    "도매의 민감 정보를 노출하지 않으면서 소매가 여러 도매의 상품을 비교하고 주문할 수 있는 B2B 플랫폼",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FarmToBiz",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    title: "FarmToBiz - 도매와 소매를 연결하는 B2B 중개 플랫폼",
    description:
      "도매의 민감 정보를 노출하지 않으면서 소매가 여러 도매의 상품을 비교하고 주문할 수 있는 B2B 플랫폼",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FarmToBiz 로고",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmToBiz - 도매와 소매를 연결하는 B2B 중개 플랫폼",
    description:
      "도매의 민감 정보를 노출하지 않으면서 소매가 여러 도매의 상품을 비교하고 주문할 수 있는 B2B 플랫폼",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={customKoKR}>
      <html lang="ko" suppressHydrationWarning>
        <head>
          {/* iOS Apple Touch Icon */}
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="/icons/icon-192x192.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="/icons/icon-512x512.png"
          />
          {/* Android Chrome Icons */}
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="/icons/icon-512x512.png"
          />
          {/* Samsung Internet Browser */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="FarmToBiz" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-200`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <SyncUserProvider>
                <PWAInstaller />
                <PWAInstallBanner />
                <Navbar />
                {children}
                <Toaster />
              </SyncUserProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
