import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, CreditCard, MapPin, Truck, Check } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/formatters';

/**
 * 주문 상세 페이지
 * 
 * 주요 기능:
 * - 주문 상태 타임라인
 * - 주문 상품 목록
 * - 배송지 및 결제 정보 표시
 */
export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock 데이터
  const order = {
    id: id || 'ORD-042',
    date: '2023.11.28',
    status: '배송중',
    totalAmount: 98000,
    items: [
      { name: '청송 꿀사과 5kg', price: 32000, quantity: 2, img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80' },
      { name: '제주 감귤 3kg', price: 34000, quantity: 1, img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=200&q=80' }
    ],
    shipping: {
      name: '김사장',
      phone: '010-1234-5678',
      address: '서울특별시 강남구 테헤란로 123',
      detail: '팜투비즈 빌딩 3층'
    },
    payment: {
      method: '신용카드',
      cardName: '현대카드',
      installment: '일시불'
    }
  };

  const steps = ['주문완료', '결제완료', '상품준비', '배송중', '배송완료'];
  const currentStep = 3; // 배송중

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">주문 상세 내역</h1>
      </div>

      {/* 주문 상태 타임라인 */}
      <Card padding="lg" className="mb-8 overflow-hidden">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-1000" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
          
          {steps.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                idx <= currentStep 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {idx <= currentStep ? <Check size={16} /> : idx + 1}
              </div>
              <span className={`text-xs font-bold ${idx <= currentStep ? 'text-green-600' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-green-50 rounded-lg flex items-center gap-3 text-green-800">
          <Truck size={24} />
          <span className="font-bold">고객님의 상품이 배송 중입니다. (롯데택배 1234-5678-9012)</span>
        </div>
      </Card>

      {/* 주문 정보 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card padding="md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-green-600" /> 배송지 정보
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-bold text-gray-900 text-base">{order.shipping.name}</p>
            <p>{order.shipping.phone}</p>
            <p>{order.shipping.address}</p>
            <p>{order.shipping.detail}</p>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-green-600" /> 결제 정보
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">결제수단</span>
              <span className="text-gray-900 font-medium">{order.payment.method} ({order.payment.cardName})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">할부정보</span>
              <span className="text-gray-900 font-medium">{order.payment.installment}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800">총 결제금액</span>
              <span className="font-black text-xl text-green-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 주문 상품 목록 */}
      <Card padding="md">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package size={20} className="text-green-600" /> 주문 상품 ({order.items.length})
        </h3>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
              <img src={item.img} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                <div className="text-sm text-gray-500 mb-2">{formatPrice(item.price)} / {item.quantity}개</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/product/review/${order.id}`)}>리뷰 쓰기</Button>
                  <Button size="sm" variant="outline">재구매</Button>
                </div>
              </div>
              <div className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailPage;

