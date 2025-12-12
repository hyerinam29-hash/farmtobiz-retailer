/**
 * @file app/retailer/cs/InquiryHistoryPage.tsx
 * @description 1:1 문의 내역 페이지 컴포넌트
 *
 * 문의 내역 목록을 표시하고 검색/필터링 기능을 제공합니다.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Calendar as CalendarIcon, Plus, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DateRange } from "react-day-picker";
import type { Inquiry } from "@/types/inquiry";
import { getInquiries } from "@/actions/retailer/get-inquiries";

interface InquiryHistoryPageProps {
  userId: string;
  onOpenInquiryForm: () => void;
}

const statusMap: Record<string, { label: string; className: string }> = {
  open: { label: "접수완료", className: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
  answered: { label: "답변완료", className: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" },
  closed: { label: "종료", className: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
};

export default function InquiryHistoryPage({ userId, onOpenInquiryForm }: InquiryHistoryPageProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 9, 1)); // 초기값: 2025년 10월
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const statusOptions = ["전체", "접수완료", "답변완료", "종료"];

  // 달력 표시 범위: 2025년 10월 ~ 2026년 2월
  const fromDate = new Date(2025, 9, 1); // 2025년 10월 1일
  const toDate = new Date(2026, 1, 28); // 2026년 2월 28일

  // 이전 월로 이동
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    // 범위 체크: fromDate보다 이전으로 갈 수 없음
    if (prevMonth >= fromDate) {
      setCurrentMonth(prevMonth);
    }
  };

  // 다음 월로 이동
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // 범위 체크: toDate보다 이후로 갈 수 없음
    if (nextMonth <= toDate) {
      setCurrentMonth(nextMonth);
    }
  };

  // 이전 월 이동 가능 여부
  const canGoPrevious = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth >= fromDate;
  };

  // 다음 월 이동 가능 여부
  const canGoNext = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth <= toDate;
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showStatusDropdown || showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown, showDatePicker]);

  // 문의 내역 조회
  useEffect(() => {
    const fetchInquiries = async () => {
      setIsLoading(true);
      const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
      const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;
      
      console.log("📋 [InquiryHistoryPage] 문의 내역 조회 시작", { 
        userId, 
        searchTerm, 
        statusFilter,
        startDate,
        endDate,
      });

      try {
        const result = await getInquiries({
          search: searchTerm || undefined,
          status: statusFilter !== "전체" ? statusFilter : undefined,
          startDate,
          endDate,
        });

        if (result.success && result.data) {
          setInquiries(result.data);
          console.log("✅ [InquiryHistoryPage] 문의 내역 조회 완료", { count: result.data.length });
        } else {
          console.error("❌ [InquiryHistoryPage] 문의 내역 조회 실패", result.error);
          setInquiries([]);
        }
      } catch (error) {
        console.error("❌ [InquiryHistoryPage] 문의 내역 조회 예외:", error);
        setInquiries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [userId, searchTerm, statusFilter, dateRange]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
            1:1 문의 내역
          </h2>
          <Button
            onClick={onOpenInquiryForm}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 h-10 flex items-center gap-2"
          >
            <Plus size={18} />
            문의하기
          </Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 검색 바 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="제목 또는 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800"
            />
          </div>

          {/* 조회 기간 설정 버튼 */}
          <div className="relative" ref={datePickerRef}>
            <Button
              variant="outline"
              onClick={() => {
                if (!showDatePicker) {
                  // 모달이 열릴 때 현재 월을 초기값으로 리셋
                  setCurrentMonth(new Date(2025, 9, 1));
                }
                setShowDatePicker(!showDatePicker);
              }}
              className="h-10 px-4 border-gray-200 dark:border-gray-700"
            >
              <CalendarIcon size={18} className="mr-2" />
              조회 기간 설정
              {dateRange?.from && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({format(dateRange.from, "yyyy-MM-dd", { locale: ko })}
                  {dateRange?.to && ` ~ ${format(dateRange.to, "yyyy-MM-dd", { locale: ko })}`})
                </span>
              )}
            </Button>
            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 p-4 w-[320px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    조회 기간 선택
                  </h3>
                  <div className="flex items-center gap-2">
                    {dateRange?.from && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDateRange(undefined);
                        }}
                        className="h-8 px-2 text-xs"
                      >
                        초기화
                      </Button>
                    )}
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <X size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* 월 네비게이션 */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={goToPreviousMonth}
                    disabled={!canGoPrevious()}
                    className={`p-2 rounded-md transition-colors ${
                      canGoPrevious()
                        ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {format(currentMonth, "yyyy년 MM월", { locale: ko })}
                  </span>
                  <button
                    onClick={goToNextMonth}
                    disabled={!canGoNext()}
                    className={`p-2 rounded-md transition-colors ${
                      canGoNext()
                        ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* 달력 */}
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  fromDate={fromDate}
                  toDate={toDate}
                  locale={ko}
                  numberOfMonths={1}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md"
                />
              </div>
            )}
          </div>

          {/* 상태 필터 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="h-10 px-4 border-gray-200 dark:border-gray-700 min-w-[100px] justify-between"
            >
              {statusFilter}
              <ChevronDown
                size={18}
                className={`ml-2 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`}
              />
            </Button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setStatusFilter(option);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      statusFilter === option ? "bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">로딩 중...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            문의 내역이 없습니다.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  번호
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {inquiries.map((inquiry, index) => {
                const status = statusMap[inquiry.status] || statusMap.open;
                return (
                  <tr
                    key={inquiry.id}
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setShowDetailModal(true);
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {inquiries.length - index}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(inquiry.created_at), "yyyy-MM-dd", { locale: ko })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {inquiry.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 문의 상세 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="w-[800px] h-[800px] max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col sm:max-w-[800px]">
          {selectedInquiry && (
            <>
              <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
                <DialogTitle className="text-lg font-black text-gray-900 dark:text-gray-100 break-words">
                  {selectedInquiry.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-col gap-4 mt-4 flex-1 overflow-y-auto min-h-0">
                {/* 문의 정보 */}
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      작성일: {format(new Date(selectedInquiry.created_at), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        statusMap[selectedInquiry.status]?.className || statusMap.open.className
                      }`}
                    >
                      {statusMap[selectedInquiry.status]?.label || "접수완료"}
                    </span>
                  </div>

                  {/* 문의 내용 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex-1 min-h-[200px] flex flex-col">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex-shrink-0">
                      문의 내용
                    </h4>
                    <div className="flex-1 overflow-y-auto">
                      <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line break-words">
                        {selectedInquiry.content}
                      </p>
                    </div>
                  </div>

                  {/* 관리자 답변 */}
                  {selectedInquiry.admin_reply ? (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 flex-1 min-h-[200px] flex flex-col">
                      <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2 flex-shrink-0">
                        관리자 답변
                        {selectedInquiry.replied_at && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-normal">
                            ({format(new Date(selectedInquiry.replied_at), "yyyy년 MM월 dd일 HH:mm", { locale: ko })})
                          </span>
                        )}
                      </h4>
                      <div className="flex-1 overflow-y-auto">
                        <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line break-words">
                          {selectedInquiry.admin_reply}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center flex items-center justify-center min-h-[200px] flex-shrink-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        아직 답변이 등록되지 않았습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

