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
import { Trash2, Minus, Plus, ShoppingBag, AlertCircle } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import {
  validateCartItems,
  formatValidationError,
  getErrorColorClass,
} from "@/lib/utils/cart-validation";

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
    const totalProductPrice = selectedItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const totalPrice = totalProductPrice;
    const itemCount = selectedItems.length;

    return { totalProductPrice, totalPrice, itemCount };
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
    return validateCartItems(selectedItems);
  }, [items, selectedItemIds]);

  // 주문하기 버튼 활성화 여부 (선택된 항목이 있어야 함)
  const canCheckout = validationResult.isValid && selectedItemIds.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-12 md:py-16">
      {/* 헤더 */}
      <div className="mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          장바구니
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400">
          {items.length}개 상품
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* 왼쪽: 장바구니 목록 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 검증 에러 메시지 */}
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-6">
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-4">
                    주문 전 확인이 필요합니다
                  </h3>
                  <ul className="space-y-2">
                    {validationResult.errors.map((error, index) => (
                      <li
                        key={index}
                        className={`text-lg ${getErrorColorClass(error.code)}`}
                      >
                        <span className="font-medium">{error.product_name}:</span>{" "}
                        {formatValidationError(error)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 전체 선택 */}
          <div className="flex items-center justify-between p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <label className="flex items-center gap-6 cursor-pointer">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-10 h-10 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
              />
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                전체 선택 ({selectedItemIds.length}/{items.length})
              </span>
            </label>
            <button
              onClick={handleRemoveSelected}
              disabled={selectedItemIds.length === 0}
              className="text-lg text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              선택 삭제
            </button>
          </div>

          {/* 상품 목록 */}
          {items.length === 0 ? (
            <div className="p-24 text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <ShoppingBag className="w-32 h-32 mx-auto text-gray-300 dark:text-gray-600 mb-8" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                장바구니가 비어있습니다.
              </p>
              <Link
                href="/retailer/products"
                className="inline-block mt-8 px-12 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-lg transition-colors"
              >
                쇼핑하러 가기
              </Link>
            </div>
          ) : (
            items.map((item) => (
            <div
              key={item.id}
              className="p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row gap-8">
                {/* 체크박스 및 이미지 */}
                <div className="flex items-start gap-6 sm:gap-8">
                  {/* 체크박스 */}
                  <input
                    type="checkbox"
                    checked={selectedItemIds.includes(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    className="mt-2 w-10 h-10 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 flex-shrink-0"
                  />

                  {/* 이미지 */}
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 상품 정보 */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                  {/* 판매자 */}
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {item.anonymous_seller_id} · {item.seller_region}
                  </p>

                  {/* 상품명 */}
                  <Link
                    href={`/retailer/products/${item.product_id}`}
                    className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 line-clamp-2"
                  >
                    {item.product_name}
                  </Link>

                  {/* 규격 */}
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {item.specification}
                  </p>

                  {/* 배송 방법 */}
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    배송 방법:{" "}
                    {item.delivery_method === "dawn" ? "새벽 배송" : "일반 배송"}
                  </p>

                  {/* 수량 조절 및 가격 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-4">
                    {/* 수량 조절 */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity, item.moq)}
                        disabled={item.quantity <= item.moq}
                        className="flex items-center justify-center w-16 h-16 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Minus className="w-8 h-8" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-24 h-16 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg"
                      />
                      <button
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.stock_quantity)}
                        disabled={item.quantity >= item.stock_quantity}
                        className="flex items-center justify-center w-16 h-16 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="w-8 h-8" />
                      </button>
                    </div>

                    {/* 가격 */}
                    <div className="flex items-center justify-between sm:justify-end gap-8">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {(item.unit_price * item.quantity).toLocaleString()}원
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                        aria-label="상품 삭제"
                      >
                        <Trash2 className="w-10 h-10" />
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
          <div className="sticky top-48 p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              주문 요약
            </h2>

            <div className="space-y-6 text-lg mb-12">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  상품 금액
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {summary.totalProductPrice.toLocaleString()}원
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between text-xl font-bold">
                <span className="text-gray-900 dark:text-gray-100">
                  총 결제 예상 금액
                </span>
                <span className="text-green-600 dark:text-green-400">
                  {summary.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {canCheckout ? (
            <Link
              href="/retailer/checkout"
              className="flex items-center justify-center gap-4 w-full py-8 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-lg transition-colors"
            >
              <ShoppingBag className="w-10 h-10" />
              <span>주문하기</span>
            </Link>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-4 w-full py-8 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-lg font-bold rounded-lg cursor-not-allowed"
              >
                <ShoppingBag className="w-10 h-10" />
                <span>주문하기</span>
              </button>
            )}

            <Link
              href="/retailer/products"
              className="block text-center mt-6 text-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

