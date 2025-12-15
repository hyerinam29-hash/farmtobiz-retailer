-- 마이그레이션: 상품 테이블에 원산지 필드 추가 및 카테고리별 원산지 설정
-- 날짜: 2025-01-15
-- 설명: products 테이블에 origin 필드를 추가하고, 카테고리별로 적절한 원산지를 설정합니다.

-- 1단계: origin 필드 추가
ALTER TABLE products
ADD COLUMN IF NOT EXISTS origin TEXT;

-- 2단계: 카테고리별 원산지 업데이트
-- 과일: 제주도
UPDATE products
SET origin = '제주도'
WHERE category = '과일' AND (origin IS NULL OR origin = '');

-- 채소: 경기도
UPDATE products
SET origin = '경기도'
WHERE category = '채소' AND (origin IS NULL OR origin = '');

-- 수산물: 부산
UPDATE products
SET origin = '부산'
WHERE category = '수산물' AND (origin IS NULL OR origin = '');

-- 곡물/견과류: 전라북도
UPDATE products
SET origin = '전라북도'
WHERE category = '곡물/견과류' AND (origin IS NULL OR origin = '');

-- 기타: 국내
UPDATE products
SET origin = '국내'
WHERE category = '기타' AND (origin IS NULL OR origin = '');

-- 3단계: origin 필드에 코멘트 추가
COMMENT ON COLUMN products.origin IS '상품 원산지 (예: 제주도, 경기도, 부산 등)';

