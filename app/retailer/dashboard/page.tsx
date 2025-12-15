/**
 * @file app/retailer/dashboard/page.tsx
 * @description 소매점 대시보드 페이지
 *
 * 소매점 사용자의 메인 대시보드입니다.
 *
 * 주요 기능:
 * 1. AI 추천 상품 모듈 (R.DASH.02)
 * 2. 최근 주문 요약 (R.DASH.03)
 * 3. 배송 예정 알림
 * 4. 일일 특가 섹션
 * 5. 반응형 디자인 (모바일/태블릿/데스크톱)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - components/retailer/ai-recommendation-list.tsx (AI 추천 상품 리스트)
 *
 * @see {@link PRD.md} - R.DASH.01~04 요구사항
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, type MouseEvent } from "react";
import Image from "next/image";
import { 
  ChevronRight, 
  ShoppingCart, 
  Truck, 
  Package,
  Check,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useCartStore } from "@/stores/cart-store";
import ProductRecommendationSection from "@/components/retailer/product-recommendation-section";
import { getHotDealProducts } from "@/actions/retailer/get-hot-deal-products";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";
import {
  getRecentOrdersForDashboard,
  type DashboardRecentOrder,
} from "@/actions/retailer/get-recent-orders";
import { getAllOrders } from "@/actions/retailer/get-all-orders";
import type { OrderDetail } from "@/types/order";
import ChatbotWidget from "@/components/retailer/chatbot/chatbot-widget";

// TODO: 추후 API로 교체 예정
// 임시 목 데이터 - 최근 주문 (현재 사용되지 않음, 추후 API 연동 시 사용 예정)
// const mockRecentOrders = [...];

// TODO: 추후 API로 교체 예정
// 임시 목 데이터 - 배송 예정 알림 (현재 사용되지 않음, 추후 API 연동 시 사용 예정)
// const mockDeliverySchedules = [...];

// 버튼 컴포넌트
const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200';
  const variants = {
    primary: 'bg-green-600 dark:bg-green-700 text-white border-b-4 border-green-800 dark:border-green-900 shadow-lg hover:bg-green-500 dark:hover:bg-green-600 active:border-b-0 active:translate-y-1',
    secondary: 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-2 border-b-4 border-green-600 dark:border-green-500 shadow-md hover:bg-green-50 dark:hover:bg-green-900/30 active:border-b-2 active:translate-y-0.5',
    outline: 'bg-transparent text-gray-600 dark:text-gray-300 border-2 border-b-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 active:border-b-2 active:translate-y-0.5',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default function RetailerDashboardPage() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  // 카운트다운 타이머 상태 (24시간 = 86400초)
  const [timeLeft, setTimeLeft] = useState(86400);
  const [hotDeals, setHotDeals] = useState<RetailerProduct[]>([]);
  const [isHotDealsLoading, setIsHotDealsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<DashboardRecentOrder[]>([]);
  const [isRecentOrdersLoading, setIsRecentOrdersLoading] = useState(true);
  const [shippingOrders, setShippingOrders] = useState<OrderDetail[]>([]);
  const [isShippingOrdersLoading, setIsShippingOrdersLoading] = useState(true);

  const statusLabelMap: Record<string, string> = {
    pending: "준비 중",
    confirmed: "준비 중",
    shipped: "배송중",
    completed: "배송완료",
    cancelled: "주문 취소",
  };

  // URL 해시가 있으면 해당 섹션으로 스크롤
  useEffect(() => {
    const scrollToElement = (elementId: string, logMessage: string) => {
      const element = document.getElementById(elementId);
      if (element) {
        console.log(logMessage);
        // 약간의 오프셋을 주어 헤더에 가려지지 않도록
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        return true;
      } else {
        console.warn(`⚠️ [대시보드] ${elementId} 요소를 찾을 수 없습니다`);
        return false;
      }
    };

    const scrollToRecentOrders = () => {
      scrollToElement("recent-orders", "📦 [대시보드] 최근 주문 내역 섹션으로 스크롤");
    };

    const scrollToDeliveryTracking = () => {
      scrollToElement("delivery-tracking", "🚚 [대시보드] 배송 조회 섹션으로 스크롤");
    };

    // sessionStorage에서 스크롤 위치 확인 (해시 없이 이동한 경우)
    const scrollToSection = sessionStorage.getItem("scrollToSection");
    if (scrollToSection) {
      console.log(`📌 [대시보드] sessionStorage에서 스크롤 위치 확인: ${scrollToSection}`);
      // 스크롤 실행
      if (scrollToSection === "recent-orders") {
        setTimeout(() => scrollToRecentOrders(), 100);
        setTimeout(() => scrollToRecentOrders(), 300);
        setTimeout(() => scrollToRecentOrders(), 500);
      } else if (scrollToSection === "delivery-tracking") {
        setTimeout(() => scrollToDeliveryTracking(), 100);
        setTimeout(() => scrollToDeliveryTracking(), 300);
        setTimeout(() => scrollToDeliveryTracking(), 500);
      }
      // 사용 후 삭제 (한 번만 실행되도록)
      sessionStorage.removeItem("scrollToSection");
    }

    // 해시에 따라 스크롤하는 함수
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash === "#recent-orders") {
        scrollToRecentOrders();
      } else if (hash === "#delivery-tracking") {
        scrollToDeliveryTracking();
      }
    };

    // 초기 해시 확인 및 스크롤
    if (window.location.hash) {
      // 페이지가 완전히 로드된 후 스크롤 (여러 번 시도)
      // DOM이 완전히 렌더링될 때까지 대기
      setTimeout(handleHashScroll, 100);
      setTimeout(handleHashScroll, 300);
      setTimeout(handleHashScroll, 500);
      setTimeout(handleHashScroll, 800);
    }

    // 해시 변경 감지 (뒤로가기/앞으로가기, router.push 등)
    const handleHashChange = () => {
      setTimeout(handleHashScroll, 100);
      setTimeout(handleHashScroll, 300);
    };

    // URL 변경 감지 (Next.js router.push로 해시가 변경될 때)
    const checkHash = () => {
      if (window.location.hash) {
        setTimeout(handleHashScroll, 100);
        setTimeout(handleHashScroll, 300);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // URL이 변경될 때마다 체크 (popstate 이벤트)
    window.addEventListener("popstate", checkHash);
    // 주기적으로 해시 확인 (router.push로 해시가 변경될 때 대응)
    const hashCheckInterval = setInterval(checkHash, 100);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", checkHash);
      clearInterval(hashCheckInterval);
    };
  }, []);

  // 1초마다 시간 감소시키는 useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          console.log("⏰ [대시보드] 타이머 종료!");
          clearInterval(timer);
          return 0;
        }
        const newTime = prev - 1;
        if (newTime % 60 === 0) {
          console.log("⏰ [대시보드] 타이머 업데이트, 남은 시간:", newTime, "초");
        }
        return newTime;
      });
    }, 1000);

    // 컴포넌트가 사라질 때 타이머 정리
    return () => {
      console.log("⏰ [대시보드] 타이머 정리");
      clearInterval(timer);
    };
    // timeLeft는 함수형 업데이트(prev => ...)를 사용하므로 의존성 배열에 포함하지 않음
  }, []);

  // HOT DEAL 데이터 로드
  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        console.log("🔥 [대시보드-HOT DEAL] 실데이터 불러오기 시작");
        const products = await getHotDealProducts();
        setHotDeals(products);
        console.log("🔥 [대시보드-HOT DEAL] 실데이터 불러오기 완료", {
          count: products.length,
        });
      } catch (error) {
        console.error("❌ [대시보드-HOT DEAL] 불러오기 실패", error);
      } finally {
        setIsHotDealsLoading(false);
      }
    };

    fetchHotDeals();
  }, []);

  // 최근 주문 데이터 로드
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        console.log("📦 [대시보드] 최근 주문 불러오기 시작");
        const data = await getRecentOrdersForDashboard();
        setRecentOrders(data);
        console.log("📦 [대시보드] 최근 주문 불러오기 완료", {
          count: data.length,
        });
      } catch (error) {
        console.error("❌ [대시보드] 최근 주문 불러오기 실패", error);
        setRecentOrders([]);
      } finally {
        setIsRecentOrdersLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  // 전체 주문 목록 데이터 로드 (주문 내역 페이지와 동일)
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        console.log("🚚 [대시보드] 전체 주문 목록 불러오기 시작");
        const data = await getAllOrders();
        setShippingOrders(data);
        console.log("🚚 [대시보드] 전체 주문 목록 불러오기 완료", {
          count: data.length,
        });
      } catch (error) {
        console.error("❌ [대시보드] 전체 주문 목록 불러오기 실패", error);
        setShippingOrders([]);
      } finally {
        setIsShippingOrdersLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // 초를 시:분:초 형식으로 변환하는 함수
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  // formatTime 함수는 현재 사용되지 않지만 향후 사용 예정이므로 유지
  // const { hours, minutes, seconds } = formatTime(timeLeft);

  // 일일특가 상품 상세 페이지 이동 핸들러
  const handleDailyDealClick = () => {
    console.log("🍊 [대시보드] 일일특가 상품 클릭, 상세 페이지로 이동");
    router.push("/retailer/products/b7e0c37e-222e-4d93-bd63-5bde7459b99b");
  };

  // HOT DEAL 카드 클릭 시 상품 상세 이동
  const handleProductClick = (productId: string) => {
    console.log("🛒 [대시보드-HOT DEAL] 상품 카드 클릭, 상세 페이지 이동", {
      productId,
    });
    router.push(`/retailer/products/${productId}`);
  };

  // 장바구니 담기 핸들러
  const handleAddToCart = (product: RetailerProduct, event?: MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    console.log("🛒 [대시보드-HOT DEAL] 장바구니 담기 시도:", {
      productId: product.id,
      productName: product.name,
    });

    addToCart({
      product_id: product.id,
      variant_id: null,
      quantity: product.moq ?? 1,
      unit_price: product.price,
      shipping_fee: product.shipping_fee,
        delivery_method: product.delivery_method ?? "courier",
      wholesaler_id: product.wholesaler_id,
      product_name: product.name,
      anonymous_seller_id: product.wholesaler_anonymous_code,
      seller_region: product.wholesaler_region,
      product_image: product.image_url,
      specification: product.specification,
      moq: product.moq,
      stock_quantity: product.stock_quantity,
    });

    console.log("✅ [대시보드-HOT DEAL] 장바구니 담기 완료, 장바구니 페이지로 이동");
    router.push("/retailer/cart");
  };
  return (
    <div className="pb-20 relative overflow-hidden min-h-screen font-sans bg-[#F8F9FA] dark:bg-gray-900 transition-colors duration-200">
      {/* 3D 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 dark:from-green-900/20 to-emerald-100/0 dark:to-emerald-900/0 rounded-full blur-3xl -z-10 animate-pulse transition-colors duration-200"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-yellow-100/40 dark:from-yellow-900/20 to-orange-50/0 dark:to-orange-900/0 rounded-full blur-3xl -z-10 animate-pulse delay-700 transition-colors duration-200"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 dark:from-blue-900/20 to-indigo-50/0 dark:to-indigo-900/0 rounded-full blur-3xl -z-10 animate-pulse delay-1000 transition-colors duration-200"></div>

      {/* 3D 플로팅 오브젝트 */}
      <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-gradient-to-br from-white/60 dark:from-gray-800/60 to-white/10 dark:to-gray-800/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 dark:border-gray-700/30 -z-10 transition-colors duration-200"></div>
      <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-gradient-to-br from-green-100/60 dark:from-green-900/40 to-emerald-50/10 dark:to-emerald-900/10 backdrop-blur-md rounded-[2rem] rotate-12 shadow-lg border border-white/30 dark:border-gray-700/30 -z-10 transition-colors duration-200"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12 relative z-10">
        {/* 섹션 1: 이 상품 어때요? */}
        <ProductRecommendationSection />

        {/* 일일 특가 섹션 */}
        <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center bg-gradient-to-br from-red-50 dark:from-red-900/20 via-orange-50 dark:via-orange-900/20 to-yellow-50 dark:to-yellow-900/20 rounded-3xl p-8 md:p-12 border border-red-100 dark:border-red-800/50 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight transition-colors duration-200">
              제주 노지 감귤 10kg
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-200">제주의 햇살을 머금은 달콤한 감귤</p>
            
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-gray-900 dark:text-gray-100 transition-colors duration-200">11,000원</span>
            </div>
             
            <Button 
              variant="primary" 
              className="w-full md:w-auto px-10 py-4 text-lg mt-10 bg-red-500 border-red-700 hover:bg-red-600"
              onClick={handleDailyDealClick}
            >
              지금 바로 구매하기
            </Button>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-orange-100 dark:bg-orange-900/30 group-hover:scale-[1.02] transition-all duration-500">
              <Image
                src="https://fmqaxnuemcmcjjgodath.supabase.co/storage/v1/object/public/product-images/user_35uP8PkUebv7sUo56uMlk5W0Mt5/products/1764297672342-3xkhizr.jpg"
                alt="감귤 10kg"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* 배너 광고 */}
        <section className="w-full h-32 md:h-40 rounded-2xl overflow-hidden relative cursor-pointer flex items-center justify-center hover:scale-[1.01] transition-transform">
          {/* 배경 이미지 */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80"
              alt="신선한 농산물"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* 텍스트 */}
          <div className="text-center text-white z-10 relative">
            <h3 className="text-2xl font-bold mb-1">우리 농산물 살리기 프로젝트</h3>
            <p className="text-white/90">산지 직송으로 더 신선하게 만나보세요</p>
          </div>
        </section>

        {/* 섹션 2: 놓치면 후회할 가격 */}
        <section className="relative">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-block mb-3">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  HOT DEAL
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                놓치면 후회할 가격 😱
              </h2>
            </div>
            <button
              className="text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 font-medium flex items-center gap-1 transition-colors duration-200"
              onClick={() => {
                console.log("🔥 [대시보드-HOT DEAL] 전체보기 클릭 -> 상품 목록 이동");
                router.push("/retailer/products");
              }}
            >
              전체보기 <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {isHotDealsLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-gray-800/80 rounded-2xl h-full border border-gray-100 dark:border-gray-700 shadow-md animate-pulse transition-colors duration-200"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              hotDeals.map((product) => {
                const imageSrc = product.image_url;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 dark:border-gray-700 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors duration-200">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform duration-500 text-4xl">
                          🛒
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                        산지직송
                      </span>
                      <button
                        onClick={(event) => handleAddToCart(product, event)}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:text-white"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                    <div className="p-5 space-y-3 flex-1 flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 line-clamp-2 transition-colors duration-200">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 transition-colors duration-200">
                          {product.wholesaler_region || "산지 미정"} · 무료배송
                        </p>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 transition-colors duration-200">
                        <div className="font-black text-xl text-green-600 dark:text-green-400 tracking-tight transition-colors duration-200">
                          {product.price.toLocaleString()}원
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors duration-200">
                          {product.specification || "규격 정보 준비중"}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full py-2 text-sm h-10 border-gray-200 dark:border-gray-700"
                        onClick={(event) => handleAddToCart(product, event)}
                      >
                        <ShoppingCart size={16} />
                        <span>담기</span>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 배송 조회 & 주문 내역 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* 배송 조회 */}
          <div id="delivery-tracking" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-green-100 dark:border-green-800 rounded-3xl p-8 shadow-lg h-full relative overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Truck size={24} className="text-green-600 dark:text-green-400" /> 배송 조회
              </h3>
            <button
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400"
              onClick={() => {
                console.log("🚚 [대시보드] 배송 조회 더보기 클릭, 주문 내역 페이지로 이동");
                router.push("/retailer/orders");
              }}
            >
              더보기
            </button>
            </div>
            <div className="space-y-4">
              {isShippingOrdersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-400 text-sm">배송 정보를 불러오는 중...</div>
                </div>
              ) : shippingOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Truck size={32} className="text-gray-300 mb-2" />
                  <div className="text-gray-400 text-sm">주문 내역이 없습니다</div>
                </div>
              ) : (
                shippingOrders.slice(0, 2).map((order) => {
                  const productName =
                    order.product?.name ||
                    order.product?.standardized_name ||
                    "상품명 없음";
                  
                  // 주문 상태에 따른 라벨 및 스타일
                  const orderStatus = order.status;
                  const statusInfo = (() => {
                    switch (orderStatus) {
                      case "pending":
                      case "confirmed":
                        return {
                          label: "준비 중",
                          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
                          textColor: "text-yellow-700 dark:text-yellow-500",
                          timeText: "준비 중",
                        };
                      case "shipped":
                        return {
                          label: "배송중",
                          bgColor: "bg-green-100 dark:bg-green-900/30",
                          textColor: "text-green-700 dark:text-green-500",
                          timeText: (() => {
                            const orderDate = new Date(order.created_at);
                            const estimatedHour = orderDate.getHours() + 24;
                            return `${estimatedHour.toString().padStart(2, "0")}:00 도착 예정`;
                          })(),
                        };
                      case "completed":
                        return {
                          label: "배송완료",
                          bgColor: "bg-blue-100 dark:bg-blue-900/30",
                          textColor: "text-blue-700 dark:text-blue-500",
                          timeText: new Date(order.created_at).toLocaleDateString("ko-KR"),
                        };
                      default:
                        return {
                          label: "준비 중",
                          bgColor: "bg-gray-100 dark:bg-gray-900/30",
                          textColor: "text-gray-700 dark:text-gray-500",
                          timeText: "확인 중",
                        };
                    }
                  })();

                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        console.log("🚚 [대시보드] 배송 카드 클릭", {
                          orderId: order.id,
                          orderNumber: order.order_number,
                          status: orderStatus,
                        });
                        // 배송 중이거나 완료된 경우에만 배송 조회 페이지로 이동
                        if (orderStatus === "shipped" || orderStatus === "completed") {
                          router.push(`/retailer/delivery-tracking?orderId=${order.id}`);
                        } else {
                          // 그 외의 경우 주문 상세 페이지로 이동
                          router.push(`/retailer/orders/${order.id}`);
                        }
                      }}
                      className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-white dark:hover:bg-gray-700 hover:border-green-200 dark:hover:border-green-800 transition-all group"
                    >
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-full shadow-sm text-green-600 dark:text-green-500 group-hover:scale-110 transition-transform">
                        <Truck size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 dark:text-gray-100 truncate">
                          {productName}
                        </div>
                        <div className={`text-sm ${statusInfo.textColor} font-medium`}>
                          {statusInfo.timeText}
                        </div>
                      </div>
                      <span className={`${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 주문 내역 */}
          <div id="recent-orders" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-purple-100 dark:border-purple-800/50 rounded-3xl p-8 shadow-lg h-full relative overflow-hidden hover:shadow-xl transition-shadow transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors duration-200">
                <Package size={24} className="text-purple-600 dark:text-purple-400" /> 최근 주문 내역
              </h3>
              <button
                className="text-sm text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                onClick={() => {
                  console.log("📦 [대시보드] 최근 주문 더보기 클릭, 프로필 페이지로 이동");
                  router.push("/retailer/profile");
                }}
              >
                더보기
              </button>
            </div>
            <div className="space-y-4">
              {isRecentOrdersLoading ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-200"
                  >
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-full shadow-sm w-12 h-12 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-16 animate-pulse ml-auto" />
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-12 animate-pulse ml-auto" />
                    </div>
                  </div>
                ))
              ) : recentOrders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  최근 주문이 없습니다.
                </div>
              ) : (
                recentOrders.map((order) => {
                  const otherItems = order.quantity > 1 ? order.quantity - 1 : 0;
                  const displayName =
                    otherItems > 0
                      ? `${order.productName} 외 ${otherItems}건`
                      : order.productName;
                  const formattedDate = new Date(order.createdAt).toLocaleDateString("ko-KR");
                  const formattedPrice = order.totalAmount.toLocaleString();
                  const statusLabel = statusLabelMap[order.status] ?? "준비 중";

                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        console.log("📦 [대시보드] 최근 주문 클릭, 주문 상세 페이지 이동", {
                          orderId: order.id,
                        });
                        router.push(`/retailer/orders/${order.id}`);
                      }}
                      className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-white dark:hover:bg-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200 group"
                    >
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-full shadow-sm text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform">
                        <Package size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">{displayName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{formattedDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800 dark:text-green-500">{formattedPrice}원</div>
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-lg bg-gray-100 text-gray-600 mt-1">
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* 회사소개 */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-100 shadow-lg mb-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Farm to Biz</h2>
            <p className="text-gray-600 text-lg mb-10">농장에서 당신의 비즈니스까지, 신선함을 전달합니다</p>
            
            {/* 특징 3가지 - 아이콘 배지 추가 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="flex flex-col items-center">
                {/* 체크 아이콘 배지 */}
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">산지 직송</h3>
                <p className="text-gray-600 text-sm">신선한 농산물을 직접 배송</p>
              </div>
              
              <div className="flex flex-col items-center">
                {/* 달러 아이콘 배지 */}
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" strokeWidth={3} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">합리적인 가격</h3>
                <p className="text-gray-600 text-sm">중간 유통 없는 최저가</p>
              </div>
              
              <div className="flex flex-col items-center">
                {/* 동그라미 안에 체크 아이콘 배지 */}
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={3} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">품질 보증</h3>
                <p className="text-gray-600 text-sm">엄선된 프리미엄 상품</p>
              </div>
            </div>
            
            {/* 구분선 */}
            <div className="border-t border-gray-200 pt-8">
              {/* 회사 정보 4칼럼 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm">
                <div>
                  <p className="font-bold text-gray-700 mb-1">회사명</p>
                  <p className="text-gray-500">팜투비즈</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 mb-1">대표이사</p>
                  <p className="text-gray-500">홍길동</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 mb-1">사업자등록번호</p>
                  <p className="text-gray-500">123-45-67890</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 mb-1">고객센터</p>
                  <p className="text-gray-500">1588-0000</p>
                </div>
              </div>
              
              {/* 주소 */}
              <p className="text-gray-500 text-sm mb-2">
                서울특별시 강남구 테헤란로 123 (우편번호 06234)
              </p>
              
              {/* 저작권 */}
              <p className="text-gray-500 text-sm">
                © 2024 Farm to Biz. All rights reserved.
              </p>
            </div>
          </div>
        </section>

      </div>
      <ChatbotWidget />
    </div>
  );
}
