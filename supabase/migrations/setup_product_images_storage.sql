-- 상품 이미지용 Storage 버킷 생성 및 RLS 정책 설정
-- 모든 사용자가 상품 이미지를 조회할 수 있도록 public 조회 허용
-- 도매상만 자신의 폴더에 업로드 가능

-- 1. product-images 버킷 생성 (이미 존재하면 무시됨)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,  -- public bucket (모든 사용자가 조회 가능)
  10485760,  -- 10MB 제한 (10 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']  -- 이미지 파일만 허용
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- 2. 기존 정책 삭제 (이미 존재하는 경우 대비)
DROP POLICY IF EXISTS "Wholesalers can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Wholesalers can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Wholesalers can update own files" ON storage.objects;

-- 3. INSERT: 인증된 사용자(도매상)만 자신의 폴더에 업로드 가능
-- 경로 구조: {clerk_user_id}/{filename}
-- TODO: 나중에 wholesaler_id로 변경 필요 시 정책 수정
CREATE POLICY "Wholesalers can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

-- SELECT: 모든 사용자가 상품 이미지 조회 가능 (public)
-- 인증 없이도 상품 이미지를 볼 수 있어야 함
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- DELETE: 인증된 사용자만 자신의 파일 삭제 가능
CREATE POLICY "Wholesalers can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

-- UPDATE: 인증된 사용자만 자신의 파일 업데이트 가능
CREATE POLICY "Wholesalers can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
)
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

