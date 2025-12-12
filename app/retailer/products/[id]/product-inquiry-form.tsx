"use client";

import { useState } from "react";
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

const inquirySchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하로 입력해주세요"),
  content: z.string().min(10, "내용을 10자 이상 입력해주세요").max(3000, "내용은 3000자 이하로 입력해주세요"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface ProductInquiryFormProps {
  wholesalerId: string;
  productName: string;
  orderId?: string | null;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ProductInquiryForm({
  wholesalerId,
  productName,
  orderId,
}: ProductInquiryFormProps) {
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
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

  const uploadFile = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("지원하지 않는 이미지 형식입니다. (JPG, PNG, WEBP만 가능)");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("파일 크기는 5MB 이하여야 합니다.");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = `${user.id}/inquiries/${fileName}`;

    console.log("📤 [product-inquiry-form] 파일 업로드 시작", {
      fileName: file.name,
      filePath,
    });

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ [product-inquiry-form] 파일 업로드 실패", error);
      throw new Error(`파일 업로드에 실패했습니다: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    console.log("✅ [product-inquiry-form] 파일 업로드 성공", publicUrl);
    return publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`최대 ${MAX_FILES}개까지 업로드 가능합니다.`);
      return;
    }

    setUploadingFiles(true);
    try {
      const uploadPromises = selectedFiles.map((file) => uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      
      setFiles((prev) => [...prev, ...selectedFiles]);
      setFileUrls((prev) => [...prev, ...urls]);
      
      console.log("✅ [product-inquiry-form] 파일 선택 완료", {
        count: selectedFiles.length,
        totalFiles: files.length + selectedFiles.length,
      });
    } catch (error) {
      console.error("❌ [product-inquiry-form] 파일 업로드 실패", error);
      toast.error(error instanceof Error ? error.message : "파일 업로드에 실패했습니다.");
    } finally {
      setUploadingFiles(false);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileUrls((prev) => prev.filter((_, i) => i !== index));
    console.log("🗑️ [product-inquiry-form] 파일 제거", { index });
  };

  const onSubmit = async (data: InquiryFormData) => {
    console.log("📝 [product-inquiry-form] 문의 제출 시작", {
      title: data.title,
      contentLength: data.content.length,
      fileCount: fileUrls.length,
      wholesalerId,
    });

    setIsSubmitting(true);

    try {
      const result = await createProductInquiry({
        title: data.title,
        content: data.content,
        wholesaler_id: wholesalerId,
        order_id: orderId || null,
        attachment_urls: fileUrls,
      });

      if (!result.success) {
        toast.error(result.error || "문의 제출에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      console.log("✅ [product-inquiry-form] 문의 제출 성공", {
        inquiryId: result.inquiryId,
      });

      toast.success("문의가 제출되었습니다. 도매 판매자가 답변드리겠습니다.");
      reset();
      setFiles([]);
      setFileUrls([]);
      setContentLength(0);
      setIsSubmitting(false);
    } catch (error) {
      console.error("❌ [product-inquiry-form] 문의 제출 실패:", error);
      toast.error("문의 제출에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            상품 문의하기
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {productName}에 대한 문의를 작성해주세요. 도매 판매자가 답변드리겠습니다.
          </p>
        </div>
      </div>

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
            <span
              className={`text-xs ${
                contentLength > 3000
                  ? "text-red-500"
                  : contentLength > 2800
                  ? "text-orange-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
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
            첨부 파일 (선택, 최대 {MAX_FILES}개)
          </Label>
          
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    aria-label="파일 제거"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length < MAX_FILES && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploadingFiles
                    ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-wait"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    {uploadingFiles ? (
                      <span>업로드 중...</span>
                    ) : (
                      <>
                        <span className="font-semibold">클릭하여 업로드</span>하거나 파일을 드래그하세요.
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, WEBP (MAX. 5MB, 최대 {MAX_FILES}개)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  disabled={uploadingFiles}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || uploadingFiles}
            className="min-w-[140px] h-12 px-6 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold transition-colors"
          >
            {isSubmitting ? "제출 중..." : "문의하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}

