/**
 * @file app/retailer/cart/page.tsx
 * @description 소매점 장바구니 페이지
 *
 * 주요 기능:
 * 1. 장바구니 상품 목록 관리 (R.CART.01)
 * 2. 수량/삭제 수정 (R.CART.02)
 * 3. 예상 총합계 (R.CART.03)
 * 4. 주문 검증 및 주문하기 이동 (R.CART.04)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - stores/cart-store.ts (장바구니 상태 관리)
 * - lib/utils/cart-validation.ts (검증 로직)
 *
 * @see {@link PRD.md} - R.CART.01~04 요구사항
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingCart, AlertCircle, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { calculateTotals } from "@/lib/utils/shipping";
import {
  validateCartItems,
  formatValidationError,
  getErrorColorClass,
} from "@/lib/utils/cart-validation";
import type { ValidationError } from "@/types/cart";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // 선택된 항목 ID 배열 관리 (초기 상태: 빈 배열 - 아무것도 선택 안 됨)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // 전체 선택/해제 핸들러
  const handleSelectAll = (checked: boolean) => {
    console.log("🔘 [장바구니] 전체 선택:", checked);
    if (checked) {
      setSelectedItemIds(items.map((item) => item.id));
      console.log("✅ [장바구니] 전체 선택 완료:", items.length, "개 항목");
    } else {
      setSelectedItemIds([]);
      console.log("✅ [장바구니] 전체 해제 완료");
    }
  };

  // 개별 선택/해제 핸들러
  const handleSelectItem = (itemId: string, checked: boolean) => {
    console.log("🔘 [장바구니] 개별 선택:", { itemId, checked });
    if (checked) {
      setSelectedItemIds((prev) => [...prev, itemId]);
      console.log("✅ [장바구니] 항목 선택 완료");
    } else {
      setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
      console.log("✅ [장바구니] 항목 해제 완료");
    }
  };

  // 선택 삭제 핸들러
  const handleRemoveSelected = () => {
    console.log("🗑️ [장바구니] 선택 삭제 시도:", selectedItemIds);
    selectedItemIds.forEach((itemId) => {
      removeFromCart(itemId);
    });
    setSelectedItemIds([]);
    console.log("✅ [장바구니] 선택 삭제 완료");
  };

  // 전체 선택 여부 계산
  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length;
  const isIndeterminate = selectedItemIds.length > 0 && selectedItemIds.length < items.length;

  // 선택된 항목만 필터링하여 요약 계산
  const summary = useMemo(() => {
    const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
    const totals = selectedItems.reduce(
      (sum, item) => {
        const { productTotal, shippingFee, total } = calculateTotals({
          unitPrice: item.unit_price,
          shippingUnitFee: item.shipping_fee ?? 0,
          quantity: item.quantity,
        });

        return {
          product: sum.product + productTotal,
          shipping: sum.shipping + shippingFee,
          total: sum.total + total,
        };
      },
      { product: 0, shipping: 0, total: 0 }
    );

    const itemCount = selectedItems.length;

    return {
      totalProductPrice: totals.product,
      totalShippingFee: totals.shipping,
      totalPrice: totals.total,
      itemCount,
    };
  }, [items, selectedItemIds]);

  // 수량 감소
  const handleDecreaseQuantity = (itemId: string, currentQuantity: number, moq: number) => {
    console.log("➖ [장바구니] 수량 감소 시도:", { itemId, currentQuantity, moq });
    
    if (currentQuantity > moq) {
      updateCartItem({ id: itemId, quantity: currentQuantity - 1 });
      console.log("✅ [장바구니] 수량 감소 완료:", currentQuantity - 1);
    } else {
      console.log("⚠️ [장바구니] 최소 주문 수량 이하로 감소 불가");
    }
  };

  // 수량 증가
  const handleIncreaseQuantity = (itemId: string, currentQuantity: number, stockQuantity: number) => {
    console.log("➕ [장바구니] 수량 증가 시도:", { itemId, currentQuantity, stockQuantity });
    
    if (currentQuantity < stockQuantity) {
      updateCartItem({ id: itemId, quantity: currentQuantity + 1 });
      console.log("✅ [장바구니] 수량 증가 완료:", currentQuantity + 1);
    } else {
      console.log("⚠️ [장바구니] 재고 부족으로 증가 불가");
    }
  };

  // 삭제
  const handleRemoveItem = (itemId: string) => {
    console.log("🗑️ [장바구니] 상품 삭제 시도:", itemId);
    removeFromCart(itemId);
    console.log("✅ [장바구니] 상품 삭제 완료");
  };

  // 장바구니 검증 (선택된 항목만)
  const validationResult = useMemo(() => {
    const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
    
    // 장바구니 자체가 비어있으면 특별 처리
    if (items.length === 0) {
      const error: ValidationError = {
        code: "CART_EMPTY",
        message: "장바구니가 비어있습니다.",
        product_id: "",
        product_name: "",
      };
      return {
        isValid: false,
        errors: [error],
      };
    }
    
    // 선택된 항목이 없으면 (상품은 있지만 선택 안 함)
    if (selectedItems.length === 0) {
      const error: ValidationError = {
        code: "NO_ITEMS_SELECTED",
        message: "상품을 선택해주세요.",
        product_id: "",
        product_name: "",
      };
      return {
        isValid: false,
        errors: [error],
      };
    }
    
    return validateCartItems(selectedItems);
  }, [items, selectedItemIds]);

  // 주문하기 버튼 활성화 여부 (선택된 항목이 있어야 함)
  const canCheckout = validationResult.isValid && selectedItemIds.length > 0;

  // 선택된 항목들의 product_id와 quantity를 쿼리 파라미터로 생성
  const checkoutUrl = useMemo(() => {
    if (selectedItemIds.length === 0) {
      return "/retailer/checkout";
    }

    const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
    const productIds = selectedItems.map((item) => item.product_id).join(",");
    const quantities = selectedItems.map((item) => item.quantity).join(",");

    const url = `/retailer/checkout?productIds=${encodeURIComponent(productIds)}&quantities=${encodeURIComponent(quantities)}`;
    
    console.log("🔗 [장바구니] 결제 페이지 URL 생성:", {
      selectedItems: selectedItems.map((item) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
      })),
      url,
    });

    return url;
  }, [items, selectedItemIds]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* 헤더 */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3 mb-2">
            <ShoppingCart size={28} className="text-green-600" />
            장바구니
          </h1>
          <p className="text-gray-500">총 {items.length}개의 상품이 담겨있습니다</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 왼쪽: 장바구니 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 검증 에러 메시지 */}
            {!validationResult.isValid && validationResult.errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-900 mb-2">
                      주문 전 확인이 필요합니다
                    </h3>
                    <ul className="space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li
                          key={index}
                          className={`text-sm ${getErrorColorClass(error.code)}`}
                        >
                          {error.product_name ? (
                            <>
                              <span className="font-medium">{error.product_name}:</span>{" "}
                              {formatValidationError(error)}
                            </>
                          ) : (
                            formatValidationError(error)
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 전체 선택 */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  전체 선택 ({selectedItemIds.length}/{items.length})
                </span>
              </label>
              <button
                onClick={handleRemoveSelected}
                disabled={selectedItemIds.length === 0}
                className="text-sm text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                선택 삭제
              </button>
            </div>

            {/* 상품 목록 */}
            {items.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  장바구니가 비어있습니다.
                </p>
                <Link
                  href="/retailer/dashboard"
                  className="inline-block px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  쇼핑하러 가기
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 md:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3 md:gap-4">
                    {/* 체크박스 */}
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="w-5 h-5 mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500 flex-shrink-0"
                    />

                    {/* 이미지 */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🛒
                        </div>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-2">
                          <Link
                            href={`/retailer/products/${item.product_id}`}
                            className="font-bold text-base md:text-lg text-gray-800 hover:text-green-600 line-clamp-2 block"
                          >
                            {item.product_name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.anonymous_seller_id} ({item.seller_region})
                          </p>
                          {/* 오늘출발 배지 */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                              오늘출발
                            </span>
                          </div>
                        </div>
                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="상품 삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* 가격 및 수량 - 모바일에서는 세로 배치 */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3">
                        {/* 가격 정보 */}
                        {(() => {
                          const { productTotal, shippingFee, total } = calculateTotals({
                            unitPrice: item.unit_price,
                            shippingUnitFee: item.shipping_fee ?? 0,
                            quantity: item.quantity,
                          });

                          return (
                            <div className="text-right md:text-left order-1 md:order-2">
                              <div className="font-bold text-lg md:text-xl text-gray-800 dark:text-gray-100">
                                ₩{total.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                상품: ₩{productTotal.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                배송비: ₩{(item.shipping_fee ?? 0).toLocaleString()} /개 → ₩
                                {shippingFee.toLocaleString()}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 수량 조절 */}
                        <div className="flex items-center bg-gray-100 rounded-lg order-2 md:order-1 self-start md:self-auto">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id, item.quantity, item.moq)}
                            disabled={item.quantity <= item.moq}
                            className="p-2.5 text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.stock_quantity)}
                            disabled={item.quantity >= item.stock_quantity}
                            className="p-2.5 text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 오른쪽: 주문 요약 (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* 주문 금액 */}
              <div className="p-5 md:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">주문 금액</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>상품 금액</span>
                    <span>₩{summary.totalProductPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>배송비</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      ₩{summary.totalShippingFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-gray-100">총 결제 금액</span>
                      <span className="font-extrabold text-xl md:text-2xl text-green-600 dark:text-green-400">
                        ₩{summary.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {canCheckout ? (
                  <Link
                    href={checkoutUrl}
                    className="flex items-center justify-center gap-2 w-full mt-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl border-b-4 border-green-700 shadow-lg active:border-b-0 active:translate-y-1 transition-all"
                  >
                    <span>₩{summary.totalPrice.toLocaleString()} 결제하기</span>
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 w-full mt-6 py-3.5 bg-gray-300 text-gray-500 font-bold rounded-xl cursor-not-allowed"
                  >
                    <span>결제하기</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {/* 안내 사항 */}
              <div className="p-4 bg-gray-100 rounded-2xl">
                <div className="text-xs text-gray-600 space-y-1.5">
                  <p>• 5만원 이상 구매 시 무료배송</p>
                  <p>• 신선식품은 배송 후 교환/환불 불가</p>
                  <p>• 결제 후 영업일 기준 1-2일 내 배송</p>
                </div>
              </div>

              {/* 쇼핑 계속하기 링크 */}
              <Link
                href="/retailer/dashboard"
                className="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                쇼핑 계속하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
