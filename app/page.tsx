/**
 * @file app/page.tsx
 * @description 루트 페이지 - 소매업자 로그인 페이지로 리다이렉트
 *
 * 루트 경로(/)에 접속하면 자동으로 소매업자 로그인 페이지로 리다이렉트합니다.
 */

import { redirect } from "next/navigation";

export default function Home() {
  console.log("🏠 [Home] 루트 페이지 접근 - /sign-in/retailer로 리다이렉트");
  redirect("/sign-in/retailer");
}
