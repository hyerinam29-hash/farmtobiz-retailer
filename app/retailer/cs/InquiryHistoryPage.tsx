/**
 * @file app/retailer/cs/InquiryHistoryPage.tsx
 * @description 1:1 문의 내역 페이지 컴포넌트
 *
 * 문의 내역 목록을 표시하고 검색/필터링 기능을 제공합니다.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Calendar as CalendarIcon, Plus, ChevronDown, X, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import type { Inquiry } from "@/types/inquiry";
import { getInquiries } from "@/actions/retailer/get-inquiries";
import { updateInquiry } from "@/actions/retailer/update-inquiry";
import { deleteInquiry } from "@/actions/retailer/delete-inquiry";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // 문의 내역 조회 함수 (useCallback으로 메모이제이션)
  const fetchInquiries = useCallback(async () => {
    // 요청 ID 증가 (최신 요청 추적용)
    const currentRequestId = ++requestIdRef.current;

    // 최신 요청인지 확인 (이전 요청이 있으면 무시)
    if (currentRequestId !== requestIdRef.current) {
      console.log("🚫 [InquiryHistoryPage] 오래된 요청 무시됨");
      return;
    }

    setIsLoading(true); // 로딩 시작

    const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
    const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;
    
    console.log("📋 [InquiryHistoryPage] 문의 내역 조회 시작", { 
      userId, 
      searchTerm, 
      statusFilter,
      startDate,
      endDate,
      requestId: currentRequestId,
    });

    try {
      const result = await getInquiries({
        search: searchTerm.trim() || undefined,
        status: statusFilter !== "전체" ? statusFilter : undefined,
        startDate,
        endDate,
      });

      // 최신 요청인지 다시 확인
      if (currentRequestId !== requestIdRef.current) {
        console.log("🚫 [InquiryHistoryPage] 응답 수신 전 요청 취소됨");
        return;
      }

      if (result.success && result.data) {
        setInquiries(result.data);
        console.log("✅ [InquiryHistoryPage] 문의 내역 조회 완료", { count: result.data.length });
      } else {
        console.error("❌ [InquiryHistoryPage] 문의 내역 조회 실패", result.error);
        setInquiries([]);
      }
    } catch (error) {
      console.error("❌ [InquiryHistoryPage] 문의 내역 조회 예외:", error);
      // 최신 요청인 경우에만 에러 처리
      if (currentRequestId === requestIdRef.current) {
        setInquiries([]);
      }
    } finally {
      // 로딩 완료
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [userId, searchTerm, statusFilter, dateRange]);

  // 검색어 변경 시 디바운싱 적용 (10ms)
  useEffect(() => {
    // 검색어가 변경되면 로딩 상태로 변경
    setIsLoading(true);
    
    // 이전 타이머가 있으면 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 10ms 후 검색 실행
    searchTimeoutRef.current = setTimeout(() => {
      fetchInquiries();
    }, 10);

    // cleanup 함수: 타이머 정리
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, fetchInquiries]);

  // 상태 필터 또는 날짜 필터 변경 시 즉시 실행
  useEffect(() => {
    // 검색어 타이머가 실행 중이면 취소하고 즉시 실행
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    fetchInquiries();
  }, [statusFilter, dateRange, fetchInquiries]);

  // 초기 로드 시 실행 (userId 변경 시)
  useEffect(() => {
    // 검색어 타이머가 실행 중이면 취소하고 즉시 실행
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    fetchInquiries();
  }, [userId, fetchInquiries]);

  // 수정 모달 열기
  const handleEditClick = () => {
    if (selectedInquiry) {
      setEditTitle(selectedInquiry.title);
      setEditContent(selectedInquiry.content);
      setShowEditModal(true);
      setShowDetailModal(false);
    }
  };

  // 수정 제출
  const handleEditSubmit = async () => {
    if (!selectedInquiry) return;

    const title = editTitle.trim();
    const content = editContent.trim();

    if (!title || !content) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }

    if (title.length > 200) {
      toast.error("제목은 200자 이하로 입력해주세요.");
      return;
    }

    if (content.length < 10 || content.length > 3000) {
      toast.error("내용은 10자 이상 3000자 이하로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    console.log("✏️ [InquiryHistoryPage] 문의 수정 시작", { inquiryId: selectedInquiry.id });

    try {
      const result = await updateInquiry({
        inquiryId: selectedInquiry.id,
        title,
        content,
      });

      if (!result.success) {
        toast.error(result.error || "문의 수정에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      toast.success("문의가 수정되었습니다.");
      setShowEditModal(false);
      setIsSubmitting(false);
      
      // 문의 내역 새로고침
      fetchInquiries();
    } catch (error) {
      console.error("❌ [InquiryHistoryPage] 문의 수정 실패:", error);
      toast.error("문의 수정에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  // 삭제 확인 다이얼로그 열기
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setShowDetailModal(false);
  };

  // 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!selectedInquiry) return;

    setIsDeleting(true);
    console.log("🗑️ [InquiryHistoryPage] 문의 삭제 시작", { inquiryId: selectedInquiry.id });

    try {
      const result = await deleteInquiry({
        inquiryId: selectedInquiry.id,
      });

      if (!result.success) {
        toast.error(result.error || "문의 삭제에 실패했습니다.");
        setIsDeleting(false);
        return;
      }

      toast.success("문의가 삭제되었습니다.");
      setShowDeleteDialog(false);
      setIsDeleting(false);
      
      // 문의 내역 새로고침
      fetchInquiries();
    } catch (error) {
      console.error("❌ [InquiryHistoryPage] 문의 삭제 실패:", error);
      toast.error("문의 삭제에 실패했습니다. 다시 시도해주세요.");
      setIsDeleting(false);
    }
  };

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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-200" size={20} />
            <Input
              type="text"
              placeholder="제목 또는 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
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
              className="h-10 px-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <CalendarIcon size={18} className="mr-2 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
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
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                    >
                      <X size={16} className="text-gray-500 dark:text-gray-400 transition-colors duration-200" />
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
              className="h-10 px-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 min-w-[100px] justify-between transition-colors duration-200"
            >
              {statusFilter}
              <ChevronDown
                size={18}
                className={`ml-2 text-gray-600 dark:text-gray-400 transition-all duration-200 ${showStatusDropdown ? "rotate-180" : ""}`}
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
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 ${
                      statusFilter === option ? "bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400" : "text-gray-900 dark:text-gray-100"
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
          <div className="p-8 text-center text-gray-600 dark:text-gray-400 transition-colors duration-200">
            로딩중입니다.
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400 transition-colors duration-200">
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

                  {/* 관련 상품 정보 (product_id가 있는 경우) */}
                  {selectedInquiry.product_id && selectedInquiry.product && (
                    <Card className="w-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          관련 상품
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                          이 문의는 아래 상품에 대한 문의입니다.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          {/* 상품 이미지 */}
                          {(selectedInquiry.product.image_urls || selectedInquiry.product.images) &&
                            (selectedInquiry.product.image_urls || selectedInquiry.product.images)!.length > 0 && (
                              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                                <Image
                                  src={(selectedInquiry.product.image_urls || selectedInquiry.product.images)![0]}
                                  alt={selectedInquiry.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          {/* 상품 정보 */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 break-words">
                              {selectedInquiry.product.name}
                            </p>
                            <Link
                              href={`/retailer/products/${selectedInquiry.product_id}`}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block transition-colors"
                            >
                              상품 상세보기 →
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* 답변완료 상태일 때 수정/삭제 버튼 */}
              {selectedInquiry.status === "answered" && (
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleEditClick}
                    className="h-10 px-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Edit size={16} className="mr-2" />
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeleteClick}
                    className="h-10 px-4 border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <Trash2 size={16} className="mr-2" />
                    삭제
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 수정 모달 */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="w-[600px] max-w-[90vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-gray-900 dark:text-gray-100">
              문의 수정
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              문의 제목과 내용을 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 mt-4">
            {/* 제목 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                제목
              </Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                maxLength={200}
                className="h-12 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {editTitle.length}/200자
              </p>
            </div>

            {/* 내용 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-content" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  내용
                </Label>
                <span className={`text-xs ${
                  editContent.length > 3000 
                    ? "text-red-500" 
                    : editContent.length > 2800 
                    ? "text-orange-500" 
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {editContent.length}/3000자
                </span>
              </div>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="문의 내용을 입력하세요 (최대 3000자)"
                rows={8}
                maxLength={3000}
                className="resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
              className="h-10 px-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              취소
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              className="h-10 px-4 bg-green-600 dark:bg-green-600 hover:bg-green-500 dark:hover:bg-green-500 text-white transition-colors duration-200"
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[400px] max-w-[90vw] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-gray-900 dark:text-gray-100">
              문의 삭제
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              정말로 이 문의를 삭제하시겠습니까? 삭제된 문의는 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="h-10 px-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              취소
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="h-10 px-4 bg-red-600 dark:bg-red-600 hover:bg-red-500 dark:hover:bg-red-500 text-white transition-colors duration-200"
            >
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

