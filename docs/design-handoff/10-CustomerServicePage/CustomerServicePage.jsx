import React from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, Clock, ChevronDown } from 'lucide-react';

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

const Button = ({ children, variant = 'primary', size = 'lg', className = '' }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all';
  const variants = {
    primary: 'bg-green-500 text-white border-b-4 border-green-700 shadow-lg hover:bg-green-400 active:border-b-0 active:translate-y-1',
  };
  const sizes = {
    lg: 'px-8 py-3.5 text-lg w-full',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 shadow-inner focus:outline-none focus:bg-white focus:border-green-500 transition-all"
  />
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const CustomerServicePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">고객센터</h1>
        <p className="text-gray-600">무엇을 도와드릴까요?</p>
      </div>

      {/* 연락처 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Card padding="md" className="text-center">
          <Phone className="mx-auto text-green-600 mb-3" size={32} />
          <div className="font-bold text-gray-800 mb-1">전화 문의</div>
          <div className="text-lg font-bold text-green-600">1588-0000</div>
          <div className="text-xs text-gray-500 mt-2">평일 09:00 - 18:00</div>
        </Card>
        <Card padding="md" className="text-center">
          <Mail className="mx-auto text-green-600 mb-3" size={32} />
          <div className="font-bold text-gray-800 mb-1">이메일 문의</div>
          <div className="text-sm text-green-600">support@farmtobiz.com</div>
          <div className="text-xs text-gray-500 mt-2">24시간 접수 가능</div>
        </Card>
        <Card padding="md" className="text-center">
          <Clock className="mx-auto text-green-600 mb-3" size={32} />
          <div className="font-bold text-gray-800 mb-1">운영 시간</div>
          <div className="text-sm text-gray-600">평일 09:00 - 18:00</div>
          <div className="text-xs text-gray-500 mt-2">주말 및 공휴일 휴무</div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <HelpCircle className="text-green-600" size={28} />
          자주 묻는 질문
        </h2>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap bg-green-600 text-white shadow-md">
            ALL
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200">
            주문/배송
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200">
            결제
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200">
            교환/환불
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200">
            상품
          </button>
        </div>

        {/* FAQ 목록 */}
        <div className="space-y-3">
          <Card padding="md" className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">주문/배송</span>
                <span className="font-bold text-gray-800">배송은 얼마나 걸리나요?</span>
              </div>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </Card>
          <Card padding="md" className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">주문/배송</span>
                <span className="font-bold text-gray-800">무료배송 조건이 어떻게 되나요?</span>
              </div>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </Card>
          <Card padding="md" className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">결제</span>
                <span className="font-bold text-gray-800">어떤 결제 수단을 사용할 수 있나요?</span>
              </div>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </Card>
        </div>
      </div>

      {/* 1:1 문의 */}
      <Card padding="md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MessageCircle className="text-green-600" size={28} />
          1:1 문의하기
        </h2>
        <div className="space-y-4">
          <Input placeholder="제목을 입력하세요" />
          <textarea
            placeholder="문의 내용을 입력하세요"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors min-h-[200px]"
          ></textarea>
          <Button variant="primary" size="lg">
            문의하기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerServicePage;
