import React from 'react';
import { CheckCircle, ShoppingBag, FileText } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Card = ({ children, padding = 'lg', className = '' }) => {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all';
  const variants = {
    primary: 'bg-green-500 text-white border-b-4 border-green-700 shadow-lg active:border-b-0 active:translate-y-1',
    outline: 'bg-transparent text-gray-600 border-2 border-b-4 border-gray-300 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const OrderCompletePage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-in fade-in duration-500 font-sans">
      <Card padding="lg" className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-4">주문이 완료되었습니다!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          고객님의 주문이 성공적으로 접수되었습니다.<br />
          빠르고 안전하게 배송해 드리겠습니다.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-200 inline-block w-full max-w-md">
          <div className="text-gray-500 mb-1 text-sm">주문번호</div>
          <div className="text-2xl font-bold text-gray-800 tracking-wider font-mono">ORD-20231201-1234</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex items-center justify-center gap-2"
          >
            <FileText size={20} />
            주문 내역 확인
          </Button>
          <Button 
            variant="primary" 
            size="lg" 
            className="flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            쇼핑 계속하기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderCompletePage;
