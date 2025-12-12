/**
 * @file storage-inquiry.ts
 * @description 문의 첨부 파일 업로드 유틸리티
 *
 * 문의 첨부 파일을 Supabase Storage에 업로드하는 함수를 제공합니다.
 * product-images 버킷의 inquiries/{clerk_user_id}/ 경로에 저장됩니다.
 *
 * @dependencies
 * - @supabase/supabase-js: SupabaseClient 타입
 */

import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET_NAME = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5; // 최대 5개
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

/**
 * 문의 첨부 파일 업로드
 *
 * @param file 업로드할 파일
 * @param clerkUserId Clerk 사용자 ID (경로에 사용)
 * @param supabase Supabase 클라이언트 인스턴스
 * @returns 업로드된 파일의 Public URL
 * @throws 파일 타입/크기 검증 실패 또는 업로드 실패 시 에러
 */
export async function uploadInquiryAttachment(
  file: File,
  clerkUserId: string,
  supabase: SupabaseClient,
): Promise<string> {
  console.log("📤 [storage-inquiry] 첨부 파일 업로드 시작", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  // 파일 타입 검증
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    const allowedTypes = ALLOWED_TYPES.join(", ");
    throw new Error(
      `지원하지 않는 파일 형식입니다. 허용 형식: ${allowedTypes}`,
    );
  }

  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    throw new Error(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
  }

  // 파일명 생성 (타임스탬프 + 랜덤 문자열)
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const fileName = `${timestamp}-${randomStr}.${fileExt}`;
  const filePath = `${clerkUserId}/inquiries/${fileName}`;

  console.log("📁 [storage-inquiry] 파일 경로:", filePath);

  // 업로드
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false, // 기존 파일 덮어쓰기 방지
    });

  if (error) {
    console.error("❌ [storage-inquiry] 파일 업로드 실패:", error);
    throw new Error(`파일 업로드에 실패했습니다: ${error.message}`);
  }

  console.log("✅ [storage-inquiry] 파일 업로드 성공:", data.path);

  // Public URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  console.log("🔗 [storage-inquiry] Public URL:", publicUrl);

  return publicUrl;
}

