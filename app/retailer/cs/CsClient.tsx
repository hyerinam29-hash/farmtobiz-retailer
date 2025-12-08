/**
 * @file app/retailer/cs/CsClient.tsx
 * @description 고객센터 클라이언트 컴포넌트
 *
 * 문의 작성 및 내역 조회 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 탭 전환 (새 문의 작성 / 내 문의 내역)
 * 2. 문의 작성 폼
 * 3. 문의 내역 목록
 */

"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, Clock, ChevronDown } from "lucide-react";
import InquiryForm from "./InquiryForm";

interface CsClientProps {
  userId: string;
}

const categories = [
  { id: "all", label: "ALL" },
  { id: "주문/배송", label: "주문/배송" },
  { id: "결제", label: "결제" },
  { id: "교환/환불", label: "교환/환불" },
  { id: "상품", label: "상품" },
];

const faqItems = [
  {
    id: "faq-1",
    category: "주문/배송",
    badge: "주문/배송",
    question: "배송은 얼마나 걸리나요?",
    answer: "주문 후 결제 완료 기준 영업일 1~2일 이내 출고되며, 지역에 따라 추가로 1~2일이 소요될 수 있습니다.",
  },
  {
    id: "faq-2",
    category: "주문/배송",
    badge: "주문/배송",
    question: "무료배송 조건이 어떻게 되나요?",
    answer: "주문 금액 30,000원 이상 구매 시 무료배송이 적용됩니다. 일부 도서산간 지역은 추가 운임이 발생할 수 있습니다.",
  },
  {
    id: "faq-3",
    category: "결제",
    badge: "결제",
    question: "어떤 결제 수단을 사용할 수 있나요?",
    answer: "신용카드, 체크카드, 간편결제(네이버페이, 카카오페이 등), 계좌이체를 지원합니다.",
  },
  {
    id: "faq-4",
    category: "교환/환불",
    badge: "교환/환불",
    question: "신선식품도 교환/환불이 가능한가요?",
    answer: "상품 하자나 오배송의 경우 수령 후 24시간 이내 사진과 함께 문의해 주시면 교환 또는 환불을 도와드립니다.",
  },
  {
    id: "faq-5",
    category: "상품",
    badge: "상품",
    question: "재고가 없는 상품은 언제 입고되나요?",
    answer: "상품 상세 페이지의 ‘재입고 알림’ 신청 시 재입고되는 즉시 알림을 드립니다.",
  },
];

export default function CsClient({ userId }: CsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const filteredFaq = useMemo(() => {
    if (activeCategory === "all") return faqItems;
    return faqItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* 헤더 */}
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-gray-900">
          고객센터
        </h1>
        <p className="text-base md:text-lg font-normal leading-normal text-gray-600">
          무엇을 도와드릴까요?
        </p>
      </div>

      {/* 연락처 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <Phone className="text-green-600" size={28} />
          </div>
          <p className="text-sm text-gray-700 font-semibold">전화 문의</p>
          <p className="text-2xl font-bold text-green-600">1588-0000</p>
          <p className="text-xs text-gray-500">평일 09:00 - 18:00</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <Mail className="text-green-600" size={28} />
          </div>
          <p className="text-sm text-gray-700 font-semibold">이메일 문의</p>
          <p className="text-base font-semibold text-green-600">support@farmtobiz.com</p>
          <p className="text-xs text-gray-500">24시간 접수 가능</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <Clock className="text-green-600" size={28} />
          </div>
          <p className="text-sm text-gray-700 font-semibold">운영 시간</p>
          <p className="text-base font-semibold text-gray-700">평일 09:00 - 18:00</p>
          <p className="text-xs text-gray-500">주말 및 공휴일 휴무</p>
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-green-500 text-green-600 flex items-center justify-center text-sm font-bold">
            ?
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">자주 묻는 질문</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                activeCategory === category.id
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredFaq.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                className="bg-white w-full text-left rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                      {item.badge}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
                {isOpen && (
                  <p className="text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
                    {item.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1:1 문의하기 */}
      <InquiryForm userId={userId} />
    </div>
  );
}

