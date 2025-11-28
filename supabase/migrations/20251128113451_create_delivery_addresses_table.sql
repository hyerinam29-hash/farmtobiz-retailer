-- ============================================
-- 배송지 관리 테이블 생성
-- ============================================
-- 소매점이 주문 시 사용할 배송지를 저장하고 관리하는 테이블
-- ============================================

CREATE TABLE "delivery_addresses" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "retailer_id" UUID NOT NULL,
    "name" TEXT NOT NULL, -- 배송지 별칭 (예: "본점", "지점1")
    "recipient_name" TEXT NOT NULL, -- 수령인 이름
    "recipient_phone" TEXT NOT NULL, -- 수령인 전화번호
    "address" TEXT NOT NULL, -- 기본 주소
    "address_detail" TEXT, -- 상세 주소
    "postal_code" TEXT, -- 우편번호
    "is_default" BOOLEAN DEFAULT false NOT NULL, -- 기본 배송지 여부
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 외래키 제약조건
ALTER TABLE "delivery_addresses"
ADD CONSTRAINT "fk_delivery_addresses_retailer_id"
FOREIGN KEY ("retailer_id") REFERENCES "retailers"("id") ON DELETE CASCADE;

-- 인덱스 생성
CREATE INDEX "idx_delivery_addresses_retailer_id" ON "delivery_addresses"("retailer_id");
CREATE INDEX "idx_delivery_addresses_is_default" ON "delivery_addresses"("retailer_id", "is_default") WHERE "is_default" = true;

-- updated_at 자동 갱신 트리거
CREATE TRIGGER "update_delivery_addresses_updated_at"
BEFORE UPDATE ON "delivery_addresses"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 기본 배송지는 소매점당 하나만 존재하도록 제약조건
-- (애플리케이션 레벨에서 처리하거나, UNIQUE 제약조건 사용)
-- 참고: PostgreSQL의 부분 인덱스로 처리 가능하지만, 
-- 애플리케이션 레벨에서 검증하는 것이 더 유연함

COMMENT ON TABLE "delivery_addresses" IS '소매점 배송지 관리 테이블';
COMMENT ON COLUMN "delivery_addresses"."name" IS '배송지 별칭 (예: "본점", "지점1")';
COMMENT ON COLUMN "delivery_addresses"."recipient_name" IS '수령인 이름';
COMMENT ON COLUMN "delivery_addresses"."recipient_phone" IS '수령인 전화번호';
COMMENT ON COLUMN "delivery_addresses"."address" IS '기본 주소';
COMMENT ON COLUMN "delivery_addresses"."address_detail" IS '상세 주소';
COMMENT ON COLUMN "delivery_addresses"."postal_code" IS '우편번호';
COMMENT ON COLUMN "delivery_addresses"."is_default" IS '기본 배송지 여부 (소매점당 하나만 true)';

