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

import { useMemo, useState, useEffect } from "react";
import { Mail, Phone, Clock, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import InquiryForm from "./InquiryForm";
import InquiryHistoryPage from "./InquiryHistoryPage";
import { getAnnouncements, type Announcement } from "@/actions/retailer/get-announcements";

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
  const [activeTab, setActiveTab] = useState<"notice" | "inquiry">("inquiry");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
  const [openAnnouncementId, setOpenAnnouncementId] = useState<string | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const filteredFaq = useMemo(() => {
    if (activeCategory === "all") return faqItems;
    return faqItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // 공지사항 목록 조회
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (activeTab === "notice") {
        setIsLoadingAnnouncements(true);
        console.log("📢 [CsClient] 공지사항 목록 조회 시작");
        try {
          const result = await getAnnouncements();
          if (result.success && result.data) {
            setAnnouncements(result.data);
            console.log("✅ [CsClient] 공지사항 목록 조회 완료", { count: result.data.length });
          } else {
            console.error("❌ [CsClient] 공지사항 조회 실패", result.error);
            setAnnouncements([]);
          }
        } catch (error) {
          console.error("❌ [CsClient] 공지사항 조회 예외:", error);
          setAnnouncements([]);
        } finally {
          setIsLoadingAnnouncements(false);
        }
      }
    };

    fetchAnnouncements();
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* 헤더 */}
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-gray-100 transition-colors duration-200">
          고객센터
        </h1>
        <p className="text-base md:text-lg font-normal leading-normal text-gray-600 dark:text-gray-300 transition-colors duration-200">
          무엇을 도와드릴까요?
        </p>
      </div>

      {/* 연락처 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center gap-2 transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center transition-colors duration-200">
            <Phone className="text-green-600 dark:text-green-400" size={28} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold transition-colors duration-200">전화 문의</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-200">1588-0000</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">평일 09:00 - 18:00</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center gap-2 transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center transition-colors duration-200">
            <Mail className="text-green-600 dark:text-green-400" size={28} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold transition-colors duration-200">이메일 문의</p>
          <p className="text-base font-semibold text-green-600 dark:text-green-400 transition-colors duration-200">support@farmtobiz.com</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">24시간 접수 가능</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center gap-2 transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center transition-colors duration-200">
            <Clock className="text-green-600 dark:text-green-400" size={28} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold transition-colors duration-200">운영 시간</p>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-200">평일 09:00 - 18:00</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">주말 및 공휴일 휴무</p>
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold transition-colors duration-200">
            ?
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 transition-colors duration-200">자주 묻는 질문</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
                activeCategory === category.id
                  ? "bg-green-600 dark:bg-green-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                className="bg-white dark:bg-gray-800 w-full text-left rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-5 py-4 flex flex-col gap-3 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded transition-colors duration-200">
                      {item.badge}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base transition-colors duration-200">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 dark:text-gray-400 transition-all duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
                {isOpen && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3 transition-colors duration-200">
                    {item.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 카테고리 필터 및 콘텐츠 */}
      <div className="flex flex-col gap-6">
        {/* 카테고리 필터 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("notice")}
            className={`px-6 py-3 rounded-full text-base font-bold transition-colors ${
              activeTab === "notice"
                ? "bg-green-600 dark:bg-green-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            공지사항
          </button>
          <button
            onClick={() => {
              setActiveTab("inquiry");
              setShowInquiryForm(false); // 탭 클릭 시 항상 내역 페이지로 이동
            }}
            className={`px-6 py-3 rounded-full text-base font-bold transition-colors ${
              activeTab === "inquiry"
                ? "bg-green-600 dark:bg-green-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            1:1문의
          </button>
        </div>

        {/* 선택된 카테고리에 따른 콘텐츠 표시 */}
        {activeTab === "notice" && (
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            {isLoadingAnnouncements ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">로딩 중...</p>
            ) : announcements.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                등록된 공지사항이 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {announcements.map((announcement) => {
                  const isOpen = openAnnouncementId === announcement.id;
                  return (
                    <button
                      key={announcement.id}
                      onClick={() => setOpenAnnouncementId(isOpen ? null : announcement.id)}
                      className="bg-gray-50 dark:bg-gray-800 w-full text-left rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-5 py-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                            {announcement.title}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(announcement.created_at), "yyyy년 MM월 dd일", {
                              locale: ko,
                            })}
                          </span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {isOpen && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {announcement.content}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "inquiry" && (
          <>
            {showInquiryForm ? (
              <InquiryForm
                userId={userId}
                onBack={() => setShowInquiryForm(false)}
                onSuccess={() => setShowInquiryForm(false)}
              />
            ) : (
              <InquiryHistoryPage userId={userId} onOpenInquiryForm={() => setShowInquiryForm(true)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

