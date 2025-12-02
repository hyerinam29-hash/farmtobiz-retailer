-- ============================================
-- orders 테이블에 배송 옵션/시간 필드 추가
-- ============================================
-- 
-- 📌 변경 내용:
-- 1. delivery_option: 배송 옵션 (dawn: 새벽배송, normal: 일반배송)
-- 2. delivery_time: 배송 희망 시간 (예: "06:00-07:00")
-- 3. payment_key: 토스 페이먼츠 결제 키 (결제 승인 후 저장)
-- 4. paid_at: 결제 완료 시간
-- 
-- ============================================

-- 1단계: delivery_option 필드 추가
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_option TEXT DEFAULT 'normal';

COMMENT ON COLUMN public.orders.delivery_option IS '배송 옵션: dawn(새벽배송), normal(일반배송)';

-- 2단계: delivery_time 필드 추가
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_time TEXT;

COMMENT ON COLUMN public.orders.delivery_time IS '배송 희망 시간 (예: 06:00-07:00)';

-- 3단계: payment_key 필드 추가 (토스 페이먼츠 결제 키)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_key TEXT;

COMMENT ON COLUMN public.orders.payment_key IS '토스 페이먼츠 결제 키';

-- 4단계: paid_at 필드 추가 (결제 완료 시간)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

COMMENT ON COLUMN public.orders.paid_at IS '결제 완료 시간';

-- 완료 로그
DO $$
BEGIN
  RAISE NOTICE '✅ orders 테이블에 delivery_option, delivery_time, payment_key, paid_at 필드 추가 완료';
END $$;

