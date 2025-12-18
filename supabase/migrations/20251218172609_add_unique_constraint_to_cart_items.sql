-- Migration: Add unique constraint to cart_items table
-- Purpose: Prevent duplicate cart items for the same retailer/product/variant combination
-- Date: 2025-12-18

-- Step 1: 기존 중복 데이터 정리
-- 같은 (retailer_id, product_id, variant_id) 조합에서 가장 최근 것만 남기고 삭제
DELETE FROM cart_items
WHERE id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY retailer_id, product_id, COALESCE(variant_id::text, 'null')
        ORDER BY updated_at DESC, created_at DESC
      ) AS rn
    FROM cart_items
  ) AS ranked
  WHERE rn > 1
);

-- Step 2: UNIQUE INDEX 추가 (NULL도 고유성 검사에 포함)
-- NULLS NOT DISTINCT: variant_id가 NULL인 경우도 중복으로 간주
-- PostgreSQL 15+ 기능으로 NULL 값도 유일성 검사에 포함됨
CREATE UNIQUE INDEX cart_items_retailer_product_variant_unique
ON cart_items (retailer_id, product_id, variant_id)
NULLS NOT DISTINCT;

-- Note: NULLS NOT DISTINCT 옵션이 없으면 NULL은 각각 다른 값으로 간주되어 중복 허용됨
-- 예: (retailer1, product1, NULL)과 (retailer1, product1, NULL)은 이제 중복으로 간주됨
