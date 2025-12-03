import React from 'react';
import { ChevronLeft, Phone, MessageCircle, MapPin, Package, CheckCircle, Truck, Clock } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

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

export const DeliveryTrackingPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">실시간 배송 조회</h1>
      </div>

      {/* 배송 상태 요약 */}
      <Card padding="lg" className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">송장번호 1234-5678-9012</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              고객님께 <span className="text-green-600">배송 중</span>입니다
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Clock size={16} /> 도착 예정: <span className="font-bold">14:00 ~ 15:00</span>
            </p>
          </div>
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-sm">
            배송중
          </span>
        </div>

        {/* 타임라인 */}
        <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 my-8">
          {/* 단계 1 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center bg-white border-green-500 text-green-500">
              <CheckCircle size={16} fill="currentColor" className="text-white" />
            </div>
            <div className="pl-6">
              <div className="font-bold text-gray-900">배송출발</div>
              <div className="text-sm text-gray-500 mt-1">
                이천 물류센터 <span className="mx-1">·</span> 09:30
              </div>
            </div>
          </div>

          {/* 단계 2 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center bg-white border-green-500 text-green-500">
              <CheckCircle size={16} fill="currentColor" className="text-white" />
            </div>
            <div className="pl-6">
              <div className="font-bold text-gray-900">터미널도착</div>
              <div className="text-sm text-gray-500 mt-1">
                강남 터미널 <span className="mx-1">·</span> 11:20
              </div>
            </div>
          </div>

          {/* 단계 3 (현재) */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center bg-white border-green-500 text-green-500">
              <CheckCircle size={16} fill="currentColor" className="text-white" />
            </div>
            <div className="pl-6">
              <div className="font-bold text-green-600 text-lg">배송중</div>
              <div className="text-sm text-gray-500 mt-1">
                역삼동 인근 <span className="mx-1">·</span> 13:45
              </div>
            </div>
          </div>

          {/* 단계 4 (예정) */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center bg-white border-gray-200 text-gray-300">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <div className="pl-6">
              <div className="font-bold text-gray-900">배송완료</div>
              <div className="text-sm text-gray-500 mt-1">
                고객님 도착지 <span className="mx-1">·</span> 도착 예정
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 택배사 정보 */}
        <Card padding="md">
          <h3 className="font-bold text-gray-900 mb-4">택배사 정보</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Truck size={32} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900">팜투비즈 물류</div>
                <div className="text-sm text-gray-500">신선 농산물 전문 배송</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">고객센터</span>
                <span className="font-medium text-gray-900">1588-0000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">배송 문의</span>
                <span className="font-medium text-gray-900">평일 09:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">배송 방식</span>
                <span className="font-medium text-green-600">산지 직송 · 신선배송</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 배송 물품 */}
        <Card padding="md">
          <h3 className="font-bold text-gray-900 mb-4">배송 물품</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Package size={16} className="text-gray-400" />
                <span className="text-gray-700 font-medium">청송 꿀사과 5kg</span>
              </div>
              <span className="text-gray-500 text-sm">2개</span>
            </div>
            <div className="flex justify-between items-center py-2 pt-2">
              <div className="flex items-center gap-3">
                <Package size={16} className="text-gray-400" />
                <span className="text-gray-700 font-medium">신선 양파 3kg</span>
              </div>
              <span className="text-gray-500 text-sm">1개</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="text-xs text-gray-400 underline hover:text-gray-600">
              운송장 조회하기
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;
