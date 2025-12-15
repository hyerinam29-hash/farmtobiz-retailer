/**
 * @file app/retailer/cs/InquiryList.tsx
 * @description 문의 내역 목록 컴포넌트
 *
 * 사용자가 작성한 문의 내역을 조회하는 컴포넌트입니다.
 */

"use client";

import { useEffect, useState } from "react";
import type { Inquiry } from "@/types/inquiry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface InquiryListProps {
  userId: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "대기 중", variant: "secondary" },
  answered: { label: "답변 완료", variant: "default" },
  closed: { label: "종료", variant: "outline" },
};

export default function InquiryList({ userId }: InquiryListProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      console.log("📋 [InquiryList] 문의 내역 조회 시작", { userId });
      setIsLoading(true);

      try {
        // TODO: API 호출로 교체
        // const data = await getInquiries({ user_id: userId });
        
        // 임시: 빈 배열 반환
        setInquiries([]);
        console.log("✅ [InquiryList] 문의 내역 조회 완료", { count: 0 });
      } catch (error) {
        console.error("❌ [InquiryList] 문의 내역 조회 실패:", error);
        setInquiries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">로딩 중...</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <p className="text-gray-600 dark:text-gray-400 text-center py-8 transition-colors duration-200">
          문의 내역이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {inquiries.map((inquiry) => {
        const status = statusMap[inquiry.status] || statusMap.open;

        return (
          <Card key={inquiry.id} className="hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-200">{inquiry.title}</CardTitle>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 transition-colors duration-200">
                {inquiry.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                <span>
                  {format(new Date(inquiry.created_at), "yyyy년 MM월 dd일", { locale: ko })}
                </span>
                {inquiry.admin_reply && (
                  <span className="text-blue-600 dark:text-blue-400 transition-colors duration-200">답변 완료</span>
                )}
              </div>
              {inquiry.admin_reply && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                    관리자 답변:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    {inquiry.admin_reply}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

