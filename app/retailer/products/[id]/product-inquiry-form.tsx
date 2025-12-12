"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { createProductInquiry } from "@/actions/retailer/create-product-inquiry";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { uploadInquiryAttachment } from "@/lib/supabase/storage-inquiry";

const inquirySchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하로 입력해주세요"),
  content: z.string().min(10, "내용을 10자 이상 입력해주세요").max(3000, "내용은 3000자 이하로 입력해주세요"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface ProductInquiryFormProps {
  productId: string; // ✨ 추가: 상품 ID
  wholesalerId: string;
  productName: string;
  onSuccess?: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function ProductInquiryForm({
  productId, // ✨ 추가
  wholesalerId,
  productName,
  onSuccess,
}: ProductInquiryFormProps) {
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > 5) {
      toast.error("첨부 파일은 최대 5개까지 업로드 가능합니다.");
      return;
    }

    selectedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} 파일 크기는 5MB 이하여야 합니다.`);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} 파일 형식이 지원되지 않습니다.`);
        return;
      }

      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "";

      setFiles((prev) => [...prev, { file, preview }]);
    });

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const onSubmit = async (data: InquiryFormData) => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      const attachmentUrls: string[] = [];
      for (const fileItem of files) {
        try {
          const url = await uploadInquiryAttachment(
            fileItem.file,
            user.id,
            supabase
          );
          attachmentUrls.push(url);
        } catch {
          toast.error(`${fileItem.file.name} 업로드에 실패했습니다.`);
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        }
      }

      setIsUploading(false);

      console.log("📝 [product-inquiry-form] 문의 제출 시작", {
        productId,
        wholesalerId,
        title: data.title,
        attachmentCount: attachmentUrls.length,
      });

      const result = await createProductInquiry({
        title: data.title,
        content: data.content,
        product_id: productId, // ✨ 추가: 상품 ID 전달
        wholesaler_id: wholesalerId,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      });

      if (!result.success) {
        toast.error(result.error || "문의 제출에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      toast.success("문의가 제출되었습니다. 도매 판매자가 확인 후 답변드리겠습니다.");
      
      reset();
      files.forEach((fileItem) => {
        if (fileItem.preview) {
          URL.revokeObjectURL(fileItem.preview);
        }
      });
      setFiles([]);
      setContentLength(0);
      setIsSubmitting(false);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } catch (error) {
      console.error("❌ [product-inquiry-form] 문의 제출 실패:", error);
      toast.error("문의 제출에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            상품 문의하기
          </h3>
        </div>
        <p className="text-sm md:text-base font-normal leading-normal text-gray-600 dark:text-gray-400 mb-6">
          {productName}에 대한 문의를 작성해주세요. 도매 판매자가 확인 후 답변드리겠습니다.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="inquiry-title" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              제목
            </Label>
            <Input
              id="inquiry-title"
              placeholder="문의 제목을 입력하세요"
              className="h-12 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 border-gray-200 dark:border-gray-700"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

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

          <div className="flex flex-col gap-2">
            <Label htmlFor="file-upload" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              파일 첨부 (선택, 최대 5개)
            </Label>
            
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {files.map((fileItem, index) => (
                  <div
                    key={index}
                    className="relative flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {fileItem.preview ? (
                      <Image
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">PDF</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                      {fileItem.file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      aria-label="파일 제거"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {files.length < 5 && (
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
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, PDF (MAX. 5MB, 최대 5개)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="min-w-[140px] h-12 px-6 bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500 text-white"
            >
              {isUploading
                ? "업로드 중..."
                : isSubmitting
                ? "제출 중..."
                : "문의하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
