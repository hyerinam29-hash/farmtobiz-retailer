import React from 'react';
import { User, Lock, MapPin, Camera } from 'lucide-react';

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

const Button = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all px-4 py-3 w-full';
  const variants = {
    primary: 'bg-green-500 text-white border-b-4 border-green-700 shadow-lg active:border-b-0 active:translate-y-1',
    outline: 'bg-white text-green-600 border-2 border-b-4 border-green-600 shadow-md active:border-b-2 active:translate-y-0.5',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ value, onChange, disabled, className = '', ...props }) => (
  <input
    type="text"
    defaultValue={value}
    disabled={disabled}
    className={`w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 shadow-inner focus:outline-none focus:bg-white focus:border-green-500 transition-all ${className}`}
    {...props}
  />
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const ProfileEditPage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-500 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">회원정보 수정</h1>

      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group cursor-pointer">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            <User size={48} className="text-gray-400" />
          </div>
          <div className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-md">
            <Camera size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 기본 정보 */}
        <Card padding="lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} className="text-green-600" /> 기본 정보
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <Input value="김사장" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상호명</label>
              <Input value="맛있는 식당" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <Input 
                value="kim@restaurant.com" 
                disabled 
                className="bg-gray-100 text-gray-500 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호</label>
              <Input value="010-1234-5678" />
            </div>
            <div className="pt-2">
              <Button>저장하기</Button>
            </div>
          </div>
        </Card>

        {/* 비밀번호 변경 */}
        <Card padding="lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lock size={20} className="text-green-600" /> 비밀번호 변경
          </h2>
          <div className="space-y-4">
            <Input type="password" placeholder="현재 비밀번호" />
            <Input type="password" placeholder="새 비밀번호" />
            <Input type="password" placeholder="새 비밀번호 확인" />
            <div className="pt-2">
              <Button variant="outline">비밀번호 변경</Button>
            </div>
          </div>
        </Card>

        {/* 배송지 관리 */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={20} className="text-green-600" /> 배송지 관리
            </h2>
            <button className="text-sm text-green-600 font-bold">+ 추가</button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">우리 가게</span>
                  <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded">기본</span>
                </div>
                <div className="text-sm text-gray-600">서울특별시 강남구 테헤란로 123 팜투비즈 빌딩 1층</div>
                <div className="text-sm text-gray-500 mt-1">010-1234-5678</div>
              </div>
              <button className="text-xs text-gray-400 underline hover:text-gray-600">수정</button>
            </div>
          </div>
        </Card>

        <div className="text-center pt-4">
          <button className="text-gray-400 text-sm underline hover:text-gray-600">회원 탈퇴</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
