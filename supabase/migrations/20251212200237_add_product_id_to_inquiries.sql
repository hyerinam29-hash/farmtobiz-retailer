-- inquiries 테이블에 product_id 컬럼 추가
-- 상품 상세 페이지에서 작성한 문의의 경우 관련 상품을 추적할 수 있도록 함

-- product_id 컬럼 추가 (NULL 허용, 외래키 제약조건 없음 - 기존 데이터 호환성)
ALTER TABLE "inquiries" 
ADD COLUMN IF NOT EXISTS "product_id" UUID;

-- 외래키 제약조건 추가 (products 테이블 참조)
-- ON DELETE SET NULL: 상품이 삭제되어도 문의는 유지
ALTER TABLE "inquiries"
ADD CONSTRAINT IF NOT EXISTS fk_inquiries_product 
FOREIGN KEY ("product_id") 
REFERENCES "products"("id") 
ON DELETE SET NULL;

-- 인덱스 추가 (product_id로 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id 
ON "inquiries" ("product_id");

COMMENT ON COLUMN "inquiries"."product_id" IS '관련 상품 ID (상품 상세 페이지에서 작성한 문의의 경우)';

