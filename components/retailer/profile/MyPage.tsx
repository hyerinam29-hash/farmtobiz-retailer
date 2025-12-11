/**
 * @file components/retailer/profile/MyPage.tsx
 * @description 마이페이지 메인 컴포넌트
 *
 * 디자인 핸드오프 12-MyPage에 맞춘 마이페이지 UI를 제공합니다.
 *
 * 주요 기능:
 * 1. 사용자 정보 카드 (프로필, 이름, VIP 뱃지, 상호명, 이메일)
 * 2. 주문 통계 카드 (전체 주문, 배송 중, 배송 완료)
 * 3. 메뉴 영역 (주문 내역, 찜한 상품, 설정, 로그아웃)
 * 4. 최근 주문 내역 리스트
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile, getCurrentUser)
 * - lib/supabase/queries/orders.ts (getOrderStats, getOrders)
 * - next/navigation (useRouter)
 * - lucide-react (아이콘)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  User,
  Package,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { OrderDetail } from "@/types/order";

// VIP 뱃지 기준: 주문 횟수 30개 이상
const VIP_ORDER_THRESHOLD = 30;

interface MyPageProps {
  /** 사용자 이름 */
  userName: string;
  /** 상호명 */
  businessName: string;
  /** 이메일 */
  email: string;
  /** 전체 주문 수 */
  totalOrders: number;
  /** 배송 중 주문 수 */
  shippingOrders: number;
  /** 배송 완료 주문 수 */
  completedOrders: number;
  /** 최근 주문 내역 */
  recentOrders: OrderDetail[];
}

/**
 * 주문 상태를 한글로 변환
 */
function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "준비 중",
    confirmed: "준비 중",
    shipped: "배송중",
    completed: "배송완료",
    cancelled: "주문 취소",
  };
  return statusMap[status] || "준비 중";
}

/**
 * 주문 상태에 따른 뱃지 스타일
 */
function getStatusBadgeClass(status: string): string {
  if (status === "shipped") {
    return "bg-green-100 text-green-700";
  }
  if (status === "completed") {
    return "bg-gray-100 text-gray-600";
  }
  return "bg-gray-100 text-gray-600";
}

/**
 * 날짜 포맷팅 (YYYY.MM.DD)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * 금액 포맷팅 (천 단위 콤마)
 */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export default function MyPage({
  userName,
  businessName,
  email,
  totalOrders,
  shippingOrders,
  completedOrders,
  recentOrders,
}: MyPageProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // VIP 뱃지 표시 여부
  const isVip = totalOrders >= VIP_ORDER_THRESHOLD;

  // 로그아웃 처리
  const handleLogout = async () => {
    if (isLoggingOut) return;

    console.log("🚪 [MyPage] 로그아웃 시작");
    setIsLoggingOut(true);

    try {
      await signOut({ redirectUrl: "/sign-in/retailer" });
      console.log("✅ [MyPage] 로그아웃 완료");
    } catch (error) {
      console.error("❌ [MyPage] 로그아웃 실패:", error);
      setIsLoggingOut(false);
    }
  };

  // 설정 버튼 클릭 (프로필 수정 페이지로 이동)
  const handleSettingsClick = () => {
    router.push("/retailer/profile/edit");
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F8F9FA] font-sans">
      {/* 3D 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-100/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-blue-100/40 to-cyan-50/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-100/30 to-indigo-50/0 rounded-full blur-3xl -z-10"></div>

      {/* 3D 플로팅 오브젝트 */}
      <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 -z-10"></div>
      <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-gradient-to-br from-green-100/60 to-emerald-50/10 backdrop-blur-md rounded-[2rem] rotate-12 shadow-lg border border-white/30 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 relative z-10">
        {/* 사용자 정보 카드 */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl shadow-lg border-none p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User size={40} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{userName}</h2>
                  {isVip && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-green-100 mb-1">{businessName}</p>
                <p className="text-sm text-green-100 opacity-80">{email}</p>
              </div>
            </div>
            <button
              onClick={handleSettingsClick}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="설정"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* 주문 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-2 font-bold">전체 주문</div>
            <div className="text-3xl font-black text-blue-600">{totalOrders}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-2 font-bold">배송 중</div>
            <div className="text-3xl font-black text-green-600">{shippingOrders}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-2 font-bold">배송 완료</div>
            <div className="text-3xl font-black text-gray-600">{completedOrders}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 메뉴 */}
          <div className="lg:col-span-1 space-y-3">
            <Link
              href="/retailer/orders"
              className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="text-green-600" size={24} />
                  <span className="font-bold text-gray-800">주문 내역</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                    {totalOrders}
                  </span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </Link>

            <button
              onClick={handleSettingsClick}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="text-green-600" size={24} />
                  <span className="font-bold text-gray-800">설정</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-white rounded-2xl shadow-sm border border-red-100 bg-red-50/50 p-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 text-left disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogOut className="text-red-500" size={24} />
                  <span className="font-bold text-red-500">
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* 우측: 최근 주문 내역 */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-green-600" size={24} />
              최근 주문 내역
            </h3>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                  주문 내역이 없습니다.
                </div>
              ) : (
                recentOrders.map((order) => {
                  const productName =
                    order.product?.name ||
                    order.product?.standardized_name ||
                    "상품명 없음";
                  const otherItemsCount = order.quantity > 1 ? order.quantity - 1 : 0;
                  const displayName =
                    otherItemsCount > 0
                      ? `${productName} 외 ${otherItemsCount}건`
                      : productName;

                  return (
                    <Link
                      key={order.id}
                      href={`/retailer/orders/${order.id}`}
                      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            {formatDate(order.created_at)}
                          </div>
                          <div className="font-bold text-gray-800 mb-1">
                            {displayName}
                          </div>
                          <div className="text-xs text-gray-500">
                            주문번호: {order.order_number}
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="font-bold text-lg text-gray-800">
                          {formatPrice(order.total_amount)}원
                        </span>
                        <span className="text-sm text-green-600 font-bold hover:text-green-700">
                          상세보기 →
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

