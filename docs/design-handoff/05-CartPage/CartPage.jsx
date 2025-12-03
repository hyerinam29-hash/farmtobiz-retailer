import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Tag, AlertCircle } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Button = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all';
  const variants = {
    primary: 'bg-green-500 text-white border-b-4 border-green-700 shadow-lg active:border-b-0 active:translate-y-1',
    outline: 'bg-transparent text-gray-600 border-2 border-b-4 border-gray-300 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg w-full',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, padding = 'md', className = '' }) => {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const CartPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-screen bg-[#F8F9FA] font-sans">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
          <ShoppingCart size={32} className="text-green-600" />
          장바구니
        </h1>
        <p className="text-gray-500">총 2개의 상품이 담겨있습니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 좌측: 상품 목록 */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* 상품 1 */}
          <Card padding="md" className="hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-4xl">
                🍎
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">청송 꿀사과 5kg</h3>
                <p className="text-sm text-gray-500 mb-2">국산 (경북 청송)</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">오늘출발</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
                <div className="text-right mb-3">
                  <div className="font-bold text-xl text-gray-800">64,000원</div>
                  <div className="text-sm text-gray-500">단가: 32,000원</div>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button className="p-2 text-gray-500 hover:text-gray-800">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold">2</span>
                  <button className="p-2 text-gray-500 hover:text-gray-800">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* 상품 2 */}
          <Card padding="md" className="hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-4xl">
                🧄
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">의성 깐마늘 1kg</h3>
                <p className="text-sm text-gray-500 mb-2">국산 (경북 의성)</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">오늘출발</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
                <div className="text-right mb-3">
                  <div className="font-bold text-xl text-gray-800">34,500원</div>
                  <div className="text-sm text-gray-500">단가: 11,500원</div>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button className="p-2 text-gray-500 hover:text-gray-800">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold">3</span>
                  <button className="p-2 text-gray-500 hover:text-gray-800">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* 우측: 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* 쿠폰 입력 */}
            <Card padding="md">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Tag size={18} className="text-green-600" />
                쿠폰 적용
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="쿠폰 코드 입력"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                />
                <Button variant="outline" size="sm">적용</Button>
              </div>
            </Card>

            {/* 주문 금액 */}
            <Card padding="md">
              <h3 className="font-bold text-gray-800 mb-4">주문 금액</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>98,500원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>무료배송 혜택 적용됨</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800">총 결제 금액</span>
                    <span className="font-extrabold text-2xl text-green-600">98,500원</span>
                  </div>
                </div>
              </div>

              <Button variant="primary" size="lg" className="mt-6">
                98,500원 결제하기
              </Button>
            </Card>

            {/* 안내 사항 */}
            <Card padding="sm" className="bg-gray-50">
              <div className="text-xs text-gray-600 space-y-1">
                <p>• 5만원 이상 구매 시 무료배송</p>
                <p>• 신선식품은 배송 후 교환/환불 불가</p>
                <p>• 결제 후 영업일 기준 1-2일 내 배송</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
