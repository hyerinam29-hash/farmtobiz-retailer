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

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InquiryForm from "./InquiryForm";
import InquiryList from "./InquiryList";

interface CsClientProps {
  userId: string;
}

export default function CsClient({ userId }: CsClientProps) {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-gray-100">
          고객 지원
        </h1>
        <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-400">
          궁금한 점이 있으신가요? AI 챗봇 또는 상담원을 통해 신속하게 해결해 드립니다.
        </p>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 border-b border-gray-200 dark:border-gray-700 bg-transparent p-0 h-auto rounded-none">
          <TabsTrigger
            value="new"
            className="data-[state=active]:border-b-[3px] data-[state=active]:border-blue-500 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-none pb-[13px] pt-4"
          >
            새 문의 작성
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:border-b-[3px] data-[state=active]:border-blue-500 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-none pb-[13px] pt-4"
          >
            내 문의 내역
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <InquiryForm userId={userId} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <InquiryList userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

