import React from 'react';
import { Star, Upload, X } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Card = ({ children, padding = 'lg' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8`}>
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'lg', className = '' }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all';
  const variants = {
    primary: 'bg-green-500 text-white border-b-4 border-green-700 shadow-lg active:border-b-0 active:translate-y-1',
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

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const ReviewWritePage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-500 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">리뷰 작성</h1>

      <Card padding="lg">
        {/* 상품 정보 */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">🍎</div>
          <div>
            <div className="text-sm text-gray-500 mb-1">구매한 상품</div>
            <div className="font-bold text-gray-800">청송 꿀사과 5kg</div>
          </div>
        </div>

        {/* 별점 평가 */}
        <div className="text-center mb-8">
          <div className="text-gray-800 font-bold mb-3 text-lg">상품은 만족하셨나요?</div>
          <div className="flex justify-center gap-2">
            {/* 5점 만점 예시 */}
            <Star size={40} className="text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
            <Star size={40} className="text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
            <Star size={40} className="text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
            <Star size={40} className="text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
            <Star size={40} className="text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
          </div>
          <div className="text-sm text-gray-500 mt-2 font-medium">
            최고예요! 👍
          </div>
        </div>

        {/* 내용 작성 */}
        <div className="mb-6">
          <label className="block font-bold text-gray-800 mb-2">어떤 점이 좋았나요?</label>
          <textarea
            placeholder="상품의 품질, 배송, 맛 등에 대한 솔직한 리뷰를 남겨주세요. (최소 10자 이상)"
            className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            defaultValue="배송도 빠르고 사과가 정말 달고 맛있어요! 재구매 의사 100% 입니다."
          />
          <div className="text-right text-xs text-gray-400 mt-1">45 / 1000</div>
        </div>

        {/* 사진 첨부 */}
        <div className="mb-8">
          <label className="block font-bold text-gray-800 mb-2">사진 첨부 (선택)</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all flex-shrink-0">
              <Upload size={20} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">추가</span>
            </label>
            
            {/* 첨부된 이미지 예시 */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 group bg-gray-100 flex items-center justify-center text-3xl">
              🍎
              <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                <X size={12} />
              </button>
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" className="w-full">
          등록하기
        </Button>
      </Card>
    </div>
  );
};

export default ReviewWritePage;
