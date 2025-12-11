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
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Clock, 
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

// TODO: 추후 API로 교체 예정
// 임시 목 데이터 - 최근 주문 (현재 사용되지 않음, 추후 API 연동 시 사용 예정)
// const mockRecentOrders = [...];

// TODO: 추후 API로 교체 예정
// 임시 목 데이터 - 배송 예정 알림 (현재 사용되지 않음, 추후 API 연동 시 사용 예정)
// const mockDeliverySchedules = [...];

// 버튼 컴포넌트
const Button = ({ children, variant = 'primary', className = '', onClick }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline'; className?: string; onClick?: () => void }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 relative overflow-hidden transition-all';
  const variants = {
    primary: 'bg-green-600 text-white border-b-4 border-green-800 shadow-lg hover:bg-green-500 active:border-b-0 active:translate-y-1',
    secondary: 'bg-white text-green-600 border-2 border-b-4 border-green-600 shadow-md hover:bg-green-50 active:border-b-2 active:translate-y-0.5',
    outline: 'bg-transparent text-gray-600 border-2 border-b-4 border-gray-300 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5',
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

  // URL 해시가 있으면 해당 섹션으로 스크롤
  useEffect(() => {
    const scrollToRecentOrders = () => {
      const element = document.getElementById("recent-orders");
      if (element) {
        console.log("📦 [대시보드] 최근 주문 내역 섹션으로 스크롤");
        // 약간의 오프셋을 주어 헤더에 가려지지 않도록
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    // 해시가 있으면 스크롤
    if (window.location.hash === "#recent-orders") {
      // 페이지가 완전히 로드된 후 스크롤 (여러 번 시도)
      setTimeout(scrollToRecentOrders, 100);
      setTimeout(scrollToRecentOrders, 300);
      setTimeout(scrollToRecentOrders, 500);
    }

    // 해시 변경 감지 (뒤로가기/앞으로가기 등)
    const handleHashChange = () => {
      if (window.location.hash === "#recent-orders") {
        setTimeout(scrollToRecentOrders, 100);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
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

  const { hours, minutes, seconds } = formatTime(timeLeft);

  // 일일특가 상품 상세 페이지 이동 핸들러
  const handleDailyDealClick = () => {
    console.log("🍊 [대시보드] 일일특가 상품 클릭, 상세 페이지로 이동");
    router.push("/retailer/products/b7e0c37e-222e-4d93-bd63-5bde7459b99b");
  };

  // 장바구니 담기 핸들러
  const handleAddToCart = (product: RetailerProduct) => {
    console.log("🛒 [대시보드-HOT DEAL] 장바구니 담기 시도:", {
      productId: product.id,
      productName: product.name,
    });

    addToCart({
      product_id: product.id,
      variant_id: null,
      quantity: product.moq ?? 1,
      unit_price: product.price,
      delivery_method: "normal",
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
    <div className="pb-20 relative overflow-hidden min-h-screen font-sans bg-[#F8F9FA]">
      {/* 3D 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-100/0 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-yellow-100/40 to-orange-50/0 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 to-indigo-50/0 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

      {/* 3D 플로팅 오브젝트 */}
      <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 -z-10"></div>
      <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-gradient-to-br from-green-100/60 to-emerald-50/10 backdrop-blur-md rounded-[2rem] rotate-12 shadow-lg border border-white/30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12 relative z-10">
        {/* 섹션 1: 이 상품 어때요? */}
        <ProductRecommendationSection />

        {/* 일일 특가 섹션 */}
        <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border border-red-100 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-bold text-xl md:text-2xl">
              <Clock size={24} />
              <span>일일특가 24시간 한정</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              제주 노지 감귤 10kg
            </h2>
            
            <p className="text-gray-600 text-lg">제주의 햇살을 머금은 달콤한 감귤</p>
            
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-gray-900">11,000원</span>
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
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-orange-100 group-hover:scale-[1.02] transition-transform duration-500">
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
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
                놓치면 후회할 가격 😱
              </h2>
              <p className="text-gray-600 text-lg">최대 50% 할인된 특가 상품을 만나보세요</p>
            </div>
            <button className="text-gray-400 hover:text-green-600 font-medium flex items-center gap-1 transition-colors">
              전체보기 <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {isHotDealsLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 rounded-2xl h-full border border-gray-100 shadow-md animate-pulse"
                >
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              hotDeals.map((product) => {
                const imageSrc = product.image_url;
                return (
                  <div
                    key={product.id}
                    className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100 group-hover:bg-green-50 transition-colors">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500 text-4xl">
                          🛒
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                        산지직송
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:text-white"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                    <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          {product.wholesaler_region || "산지 미정"} · 무료배송
                        </p>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="font-black text-xl text-green-600 tracking-tight">
                          {product.price.toLocaleString()}원
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {product.specification || "규격 정보 준비중"}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full py-2 text-sm h-10 border-gray-200"
                        onClick={() => handleAddToCart(product)}
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
          <div className="bg-white/80 backdrop-blur-xl border border-green-100 rounded-3xl p-8 shadow-lg h-full relative overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Truck size={24} className="text-green-600" /> 배송 조회
              </h3>
              <button className="text-sm text-gray-400 hover:text-green-600">더보기</button>
            </div>
            <div className="space-y-4">
              <div 
                onClick={() => {
                  console.log("🚚 [대시보드] 배송 카드 클릭, 배송 조회 페이지로 이동");
                  router.push("/retailer/delivery-tracking");
                }}
                className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:border-green-200 transition-all group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                  <Truck size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">오전 정기 배송</div>
                  <div className="text-sm text-green-600 font-medium">14:00 도착 예정</div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-lg">배송중</span>
              </div>
              <div 
                onClick={() => {
                  console.log("🚚 [대시보드] 오후 긴급 배송 카드 클릭, 배송 조회 페이지로 이동");
                  router.push("/retailer/delivery-tracking");
                }}
                className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:border-green-200 transition-all group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                  <Truck size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">오후 긴급 배송</div>
                  <div className="text-sm text-green-600 font-medium">18:00 도착 예정</div>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-lg">배송준비</span>
              </div>
            </div>
          </div>

          {/* 주문 내역 */}
          <div id="recent-orders" className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 shadow-lg h-full relative overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package size={24} className="text-purple-600" /> 최근 주문 내역
              </h3>
              <button className="text-sm text-gray-400 hover:text-green-600">더보기</button>
            </div>
            <div className="space-y-4">
              <div 
                onClick={() => {
                  console.log("📦 [대시보드] 최근 주문 클릭, 주문 상세 페이지로 이동, orderId: 1");
                  router.push("/retailer/orders/1");
                }}
                className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:border-purple-200 transition-all group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm text-gray-600 group-hover:scale-110 transition-transform">
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">양파, 마늘 외 5건</div>
                  <div className="text-sm text-gray-500">2023.11.28</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">154,000원</div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("🔄 [대시보드] 재주문 버튼 클릭");
                      // TODO: 재주문 기능 구현
                    }}
                    className="text-xs text-green-600 font-bold hover:underline mt-1"
                  >
                    재주문
                  </button>
                </div>
              </div>
              <div 
                onClick={() => {
                  console.log("📦 [대시보드] 최근 주문 클릭, 주문 상세 페이지로 이동, orderId: 2");
                  router.push("/retailer/orders/2");
                }}
                className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:border-purple-200 transition-all group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm text-gray-600 group-hover:scale-110 transition-transform">
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">제주 감귤 10박스</div>
                  <div className="text-sm text-gray-500">2023.11.27</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">150,000원</div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("🔄 [대시보드] 재주문 버튼 클릭");
                      // TODO: 재주문 기능 구현
                    }}
                    className="text-xs text-green-600 font-bold hover:underline mt-1"
                  >
                    재주문
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 브랜드 배너 */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
             <h2 className="text-2xl md:text-4xl font-black text-white mb-4 drop-shadow-lg">
               Farm to Biz 멤버십
             </h2>
             <p className="text-gray-200 mb-8 max-w-xl mx-auto text-lg">
               지금 가입하고 매달 쏟아지는 할인 쿠폰과<br/>
               무료 배송 혜택을 받아보세요!
             </p>
             <Link 
               href="/sign-up-custom?type=retailer"
               className="bg-white text-gray-900 px-10 py-4 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95 inline-block"
             >
               멤버십 혜택 자세히 보기
             </Link>
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
    </div>
  );
}
