import React from 'react';
import { CheckCircle, MapPin, CreditCard, Truck, FileText, ChevronDown } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Card = ({ children, padding = 'md', className = '' }) => {
  const paddings = { sm: 'p-4', md: 'p-6' };
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

const Input = ({ placeholder, value }) => (
  <input
    type="text"
    placeholder={placeholder}
    defaultValue={value}
    className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 shadow-inner focus:outline-none focus:bg-white focus:border-green-500 transition-all"
  />
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const OrderPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-screen bg-[#F8F9FA] font-sans">
      {/* 진행 단계 */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-gray-200 text-gray-500">1</div>
            <span className="text-sm mt-2 text-gray-500">장바구니</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-green-600 text-white">2</div>
            <span className="text-sm mt-2 text-green-600 font-bold">주문/결제</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-gray-200 text-gray-500">3</div>
            <span className="text-sm mt-2 text-gray-500">주문완료</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 좌측: 배송 및 결제 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 배송지 정보 */}
          <Card padding="md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-green-600" size={24} />
              배송지 정보
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="이름" />
                <Input placeholder="연락처" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1"><Input placeholder="주소" /></div>
                <button className="px-4 rounded-xl border-2 border-b-4 border-gray-300 text-gray-600 font-bold hover:bg-gray-50">주소 검색</button>
              </div>
              <Input placeholder="상세 주소" />
              <Input placeholder="배송 요청사항 (선택)" />
            </div>
          </Card>

          {/* 배송 방법 */}
          <Card padding="md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Truck className="text-green-600" size={24} />
              배송 방법
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <div className="font-bold text-gray-800">일반 배송 (무료)</div>
                  <div className="text-sm text-gray-600">영업일 기준 1-2일 내 배송</div>
                </div>
              </div>
            </div>
          </Card>

          {/* 결제 수단 */}
          <Card padding="md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-green-600" size={24} />
              결제 수단
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all border-green-600 bg-green-50">
                <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-green-600" />
                <span className="text-2xl">💳</span>
                <span className="font-medium text-gray-800">신용/체크카드</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all border-gray-200 hover:border-gray-300">
                <input type="radio" name="payment" className="w-4 h-4 text-green-600" />
                <span className="text-2xl">🏦</span>
                <span className="font-medium text-gray-800">계좌이체</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all border-gray-200 hover:border-gray-300">
                <input type="radio" name="payment" className="w-4 h-4 text-green-600" />
                <span className="text-2xl">📄</span>
                <span className="font-medium text-gray-800">가상계좌</span>
              </label>
            </div>
          </Card>

          {/* 약관 동의 */}
          <Card padding="md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="text-green-600" size={24} />
              약관 동의
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                <span className="font-bold text-gray-800">전체 동의</span>
              </label>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                    <span className="text-gray-700">이용약관 동의 (필수)</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </label>
                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                    <span className="text-gray-700">개인정보 처리방침 동의 (필수)</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </label>
                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                    <span className="text-gray-700">결제 대행 서비스 이용약관 (필수)</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* 우측: 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card padding="md">
              <h3 className="font-bold text-gray-800 mb-4">주문 상품</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">청송 꿀사과 5kg x 2</span>
                  <span className="font-medium">64,000원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">의성 깐마늘 1kg x 3</span>
                  <span className="font-medium">34,500원</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>98,500원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span className="text-green-600 font-bold">무료</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800">최종 결제 금액</span>
                    <span className="font-extrabold text-2xl text-green-600">98,500원</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all">
                98,500원 결제하기
              </button>
            </Card>

            <Card padding="sm" className="bg-gray-50">
              <div className="text-xs text-gray-600 space-y-1">
                <p>• 신선식품 특성상 배송 후 교환/환불 불가</p>
                <p>• 주문 폭주 시 배송 지연 가능</p>
                <p>• 문의사항은 고객센터로 연락주세요</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
