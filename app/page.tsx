/**
 * @file app/page.tsx
 * @description FarmToBiz 메인 랜딩 페이지
 *
 * 역할 선택 및 프로젝트 소개를 제공하는 랜딩 페이지입니다.
 * - Hero 섹션: 역할 선택 카드 (소매점/도매점)
 * - 프로젝트 소개 섹션: 서비스 개요, 주요 취급 품목, MD 추천 상품, 경쟁력, 타깃 사용자, 기술 스택
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserProfile, redirectByRole } from "@/lib/clerk/auth";
import RoleSelectionHeader from "@/components/role-selection-header";

export default async function Home() {
  // 로그인한 사용자는 역할에 따라 대시보드로 리다이렉트
  const profile = await getUserProfile();

  // pending 상태인 도매업자인지 확인 (버튼 링크 동적 변경용)
  let isPendingWholesaler = false;
  if (
    profile &&
    profile.role === "wholesaler" &&
    profile.wholesalers &&
    profile.wholesalers.length > 0
  ) {
    const wholesaler = profile.wholesalers[0];
    if (wholesaler && wholesaler.status === "pending") {
      isPendingWholesaler = true;
    }
  }

<<<<<<< HEAD
  if (profile && profile.role) {
    // 도매업자이고 pending 상태인 경우 리다이렉트하지 않음 (승인 대기 중)
    if (
      profile.role === "wholesaler" &&
      profile.wholesalers &&
      profile.wholesalers.length > 0
    ) {
      const wholesaler = profile.wholesalers[0];
      if (wholesaler && wholesaler.status === "pending") {
        console.log("⚠️ [home] 도매업자 승인 대기 중, 메인페이지 유지");
        // pending 상태인 경우 리다이렉트하지 않고 메인페이지 표시
      } else {
        // 승인된 도매업자는 대시보드로 리다이렉트
        redirectByRole(profile.role);
      }
    } else {
      // 다른 역할(소매업자, 관리자)은 대시보드로 리다이렉트
      redirectByRole(profile.role);
    }
  }
  // 역할이 없는 사용자는 메인 페이지에서 역할 선택 가능

  // 목업 상품 데이터
  const recommendedProducts = [
    {
      id: 1,
      name: "햇살농장 고당도 설향 딸기 1kg",
      price: 15900,
      vendor: "VENDOR-001",
      category: "과일",
      image: "/strawberry.jpg",
    },
    {
      id: 2,
      name: "바다의선물 노르웨이 생연어 필렛 500g",
      price: 22000,
      vendor: "VENDOR-002",
      category: "수산물",
      image: "/salmon.jpg",
    },
    {
      id: 3,
      name: "푸른채소 무농약 아스파라거스 1단",
      price: 4500,
      vendor: "VENDOR-003",
      category: "채소",
      image: "/asparagus.png",
    },
    {
      id: 4,
      name: "참된목장 유기농 동물복지 유정란 10구",
      price: 7800,
      vendor: "VENDOR-004",
      category: "가공식품",
      image: "/eggs.jpg",
    },
  ];

  const categories = [
    {
      name: "과일",
      icon: Apple,
      image:
        "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=300&h=300&fit=crop&q=80",
    },
    {
      name: "채소",
      icon: Carrot,
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop&q=80",
    },
    {
      name: "육류",
      icon: Beef,
      image:
        "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=300&h=300&fit=crop&q=80",
    },
    {
      name: "수산물",
      icon: Fish,
      image: "/seafood.jpg",
    },
  ];
=======
  // 로그인하지 않은 사용자에게는 역할 선택 페이지를 보여줌
>>>>>>> 9ea05efb0d027d86d9df91851a3e1853bfd06c3b

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f7f8] dark:bg-[#101922] overflow-x-hidden">
      {/* 헤더 */}
      <RoleSelectionHeader />

      {/* 메인 콘텐츠 - 역할 선택 */}
      <main className="flex flex-1 justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-6xl flex-1">
          {/* 제목 섹션 */}
          <div className="flex flex-wrap justify-center gap-4 text-center mb-10">
            <div className="flex w-full flex-col gap-3">
              <h1 className="text-[#111418] dark:text-[#f0f2f4] text-4xl font-black leading-tight tracking-[-0.033em]">
                환영합니다! 시작할 역할을 선택해주세요.
              </h1>
              <p className="text-[#617589] dark:text-[#a8b5c4] text-base font-normal leading-normal">
                소매업자 또는 도매업자 중 하나를 선택하여 대시보드로 이동하세요.
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 소매점 카드 */}
            <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">소매업자</CardTitle>
                <CardDescription className="text-base">
                  다양한 도매업체의 상품을 발견하고 합리적인 가격으로
                  주문하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      다양한 상품 검색 및 필터링
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShoppingCart className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      간편한 주문 및 결제
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      거래 내역 및 배송 추적
                    </span>
                  </div>
                </div>
                <Link
                  href={
                    isPendingWholesaler
                      ? "/pending-approval"
                      : "/sign-in/retailer"
                  }
                  className="mt-auto"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg">
                    소매업자로 시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 도매점 카드 */}
            <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">도매업자</CardTitle>
                <CardDescription className="text-base">
                  전국의 소매업체에게 상품을 판매하고 비즈니스를 확장하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      상품 등록 및 재고 관리
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClipboardList className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      주문 접수 및 처리
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      판매 데이터 및 정산 관리
                    </span>
                  </div>
                </div>
                <Link
                  href={
                    isPendingWholesaler
                      ? "/pending-approval"
                      : "/sign-in/wholesaler"
                  }
                  className="mt-auto"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
                    도매업자로 시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 서비스 개요 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            도매와 소매를 연결하는 B2B 중개 플랫폼
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FarmToBiz는 도매의 민감 정보(상호명, 연락처)를 노출하지 않으면서
            소매가 여러 도매의 상품을 비교하고 주문할 수 있는 환경을 제공합니다.
          </p>
        </div>
      </section>

      {/* 주요 취급 품목 섹션 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            주요 취급 품목
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.name}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* MD 추천 상품 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            MD 추천 상품
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {product.name}
=======
          {/* 역할 선택 카드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 소매업자 카드 */}
            <Link href="/sign-in/retailer" className="group block cursor-pointer">
              <div className="flex flex-col h-full rounded-xl bg-white dark:bg-[#1f2937] shadow-sm hover:shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-[#137fec] transition-all duration-300">
                <div className="flex flex-col gap-4 p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-[#f0f2f4]">
                    소매업자
>>>>>>> 9ea05efb0d027d86d9df91851a3e1853bfd06c3b
                  </h3>
                  <p className="text-base text-[#617589] dark:text-[#a8b5c4]">
                    다양한 도매업체의 상품을 발견하고 합리적인 가격으로 주문하세요.
                  </p>
                  <hr className="border-gray-200 dark:border-gray-700 my-2" />
                  <ul className="flex flex-col gap-3 text-sm text-[#617589] dark:text-[#a8b5c4]">
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">search</span>
                      <span>다양한 상품 검색 및 필터링</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">shopping_cart</span>
                      <span>간편한 주문 및 결제</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">local_shipping</span>
                      <span>거래 내역 및 배송 추적</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto p-6 sm:p-8 pt-0">
                  <div className="flex w-full max-w-[480px] mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-medium leading-normal">
                    <span className="truncate">소매업자로 시작하기</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* 도매업자 카드 */}
            <Link href="/sign-in/wholesaler" className="group block cursor-pointer">
              <div className="flex flex-col h-full rounded-xl bg-white dark:bg-[#1f2937] shadow-sm hover:shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-[#137fec] transition-all duration-300">
                <div className="flex flex-col gap-4 p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-[#f0f2f4]">
                    도매업자
                  </h3>
                  <p className="text-base text-[#617589] dark:text-[#a8b5c4]">
                    전국의 소매업체에게 상품을 판매하고 비즈니스를 확장하세요.
                  </p>
                  <hr className="border-gray-200 dark:border-gray-700 my-2" />
                  <ul className="flex flex-col gap-3 text-sm text-[#617589] dark:text-[#a8b5c4]">
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">inventory_2</span>
                      <span>상품 등록 및 재고 관리</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">receipt_long</span>
                      <span>주문 접수 및 처리</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">monitoring</span>
                      <span>판매 데이터 및 정산 관리</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto p-6 sm:p-8 pt-0">
                  <div className="flex w-full max-w-[480px] mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-medium leading-normal">
                    <span className="truncate">도매업자로 시작하기</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}
