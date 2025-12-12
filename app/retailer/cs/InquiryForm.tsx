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
import { Label } from "@/components/ui/label";
import { Upload, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createInquiry } from "@/actions/retailer/create-inquiry";

const inquirySchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하로 입력해주세요"),
  content: z.string().min(10, "내용을 10자 이상 입력해주세요").max(3000, "내용은 3000자 이하로 입력해주세요"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  userId: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function InquiryForm({ userId, onBack, onSuccess }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [contentLength, setContentLength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    console.log("📝 [InquiryForm] 문의 제출 시작", { data, userId });
    setIsSubmitting(true);

    try {
      // Server Action 호출
      const result = await createInquiry({
        title: data.title,
        content: data.content,
      });

      if (!result.success) {
        toast.error(result.error || "문의 제출에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      toast.success("문의가 제출되었습니다.");
      reset();
      setFile(null);
      setContentLength(0);
      setIsSubmitting(false);
      
      // 성공 후 콜백 실행 (문의 내역 목록으로 이동)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
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
    <div className="flex flex-col gap-6">
      {/* 문의 작성 폼 */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="뒤로가기"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <MessageSquare className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">1:1 문의하기</h2>
          </div>
        </div>
        <p className="text-sm md:text-base font-normal leading-normal text-gray-600 dark:text-gray-400 mb-6">
          문의를 제출해주시면 담당자가 확인 후 답변드리겠습니다.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="inquiry-title" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              제목
            </Label>
            <Input
              id="inquiry-title"
              placeholder="제목을 입력하세요"
              className="h-12 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 border-gray-200 dark:border-gray-700"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 내용 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="inquiry-content" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                내용
              </Label>
              <span className={`text-xs ${
                contentLength > 3000 
                  ? "text-red-500" 
                  : contentLength > 2800 
                  ? "text-orange-500" 
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {contentLength}/3000자
              </span>
            </div>
            <Textarea
              id="inquiry-content"
              placeholder="문의 내용을 입력하세요 (최대 3000자)"
              rows={6}
              maxLength={3000}
              className="resize-none bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 border-gray-200 dark:border-gray-700"
              {...register("content", {
                onChange: (e) => {
                  setContentLength(e.target.value.length);
                },
              })}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* 파일 첨부 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="file-upload" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              파일 첨부 (선택)
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">클릭하여 업로드</span>하거나 파일을 드래그하세요.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
                  {file && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">선택된 파일: {file.name}</p>
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
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px] h-12 px-6 bg-green-500 hover:bg-green-400"
            >
              {isSubmitting ? "제출 중..." : "문의하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

