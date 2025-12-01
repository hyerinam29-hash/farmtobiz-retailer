/**
 * @file app/retailer/cs/InquiryForm.tsx
 * @description 문의 작성 폼 컴포넌트
 *
 * 고객센터 문의 작성 폼입니다.
 * 문의 유형, 제목, 내용, 파일 첨부를 입력받습니다.
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Bot } from "lucide-react";
import { toast } from "sonner";
import { createInquiry } from "@/actions/retailer/create-inquiry";

const inquirySchema = z.object({
  type: z.string().min(1, "문의 유형을 선택해주세요"),
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하로 입력해주세요"),
  content: z.string().min(10, "내용을 10자 이상 입력해주세요"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  userId: string;
}

export default function InquiryForm({ userId }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      type: "",
      title: "",
      content: "",
    },
  });

  const inquiryType = watch("type");

  const onSubmit = async (data: InquiryFormData) => {
    console.log("📝 [InquiryForm] 문의 제출 시작", { data, userId });
    setIsSubmitting(true);

    try {
      // Server Action 호출
      const result = await createInquiry({
        type: data.type,
        title: data.title,
        content: data.content,
      });

      if (!result.success) {
        toast.error(result.error || "문의 제출에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      // AI 답변 표시
      if (result.aiResponse) {
        setAiResponse(result.aiResponse);
      } else {
        // AI 답변 생성 실패 시 기본 메시지
        setAiResponse(
          "죄송합니다. AI 답변 생성에 실패했습니다. 문의는 정상적으로 접수되었으며, 담당자가 확인 후 답변드리겠습니다.",
        );
      }

      toast.success("문의가 제출되었습니다.");
      reset();
      setFile(null);
      setIsSubmitting(false);
    } catch (error) {
      console.error("❌ [InquiryForm] 문의 제출 실패:", error);
      toast.error("문의 제출에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      setFile(selectedFile);
      console.log("📎 [InquiryForm] 파일 선택됨", selectedFile.name);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 문의 작성 폼 */}
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-sm">
        <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-gray-100 mb-3">
          무엇을 도와드릴까요?
        </h2>
        <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-400 mb-6">
          문의를 제출하시면 AI가 먼저 답변을 드립니다. AI의 답변이 만족스럽지 않을 경우, 사람 상담원에게 연결할 수 있습니다.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 문의 유형 */}
            <div>
              <Label htmlFor="inquiry-type" className="mb-2">
                문의 유형
              </Label>
              <Select
                value={inquiryType}
                onValueChange={(value) => setValue("type", value)}
              >
                <SelectTrigger id="inquiry-type" className="h-12">
                  <SelectValue placeholder="문의 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">계정 문의</SelectItem>
                  <SelectItem value="order">주문/결제</SelectItem>
                  <SelectItem value="delivery">배송 관련</SelectItem>
                  <SelectItem value="system">시스템 오류</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* 제목 */}
            <div>
              <Label htmlFor="inquiry-title" className="mb-2">
                제목
              </Label>
              <Input
                id="inquiry-title"
                placeholder="문의 제목을 입력해주세요."
                className="h-12"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* 내용 */}
          <div>
            <Label htmlFor="inquiry-content" className="mb-2">
              내용
            </Label>
            <Textarea
              id="inquiry-content"
              placeholder="상세한 문의 내용을 작성해주세요."
              rows={6}
              className="resize-none"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* 파일 첨부 */}
          <div>
            <Label htmlFor="file-upload" className="mb-2">
              파일 첨부 (선택)
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">클릭하여 업로드</span>하거나 파일을 드래그하세요.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, PDF (MAX. 5MB)
                  </p>
                  {file && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      선택된 파일: {file.name}
                    </p>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px] h-12 px-6"
            >
              {isSubmitting ? "제출 중..." : "AI에게 문의하기"}
            </Button>
          </div>
        </form>
      </div>

      {/* AI 답변 섹션 */}
      {aiResponse && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 sm:p-8 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
            <Bot className="w-6 h-6 text-blue-500" />
            AI 챗봇의 답변입니다.
          </h3>
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 text-base font-normal leading-relaxed whitespace-pre-line">
              {aiResponse}
            </p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              이 답변이 도움이 되셨나요?
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <span className="mr-2">👍</span>
                네
              </Button>
              <Button variant="outline" size="sm">
                <span className="mr-2">👎</span>
                아니요
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50">
                <span className="mr-2">💬</span>
                사람 상담 연결
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

