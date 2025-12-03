import React from 'react';
import { User, Mail, Lock, Phone, Building, CheckCircle } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Card = ({ children, padding = 'lg' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-8`}>
      {children}
    </div>
  );
};

const Input = ({ type = 'text', placeholder, icon }) => (
  <div className="relative group">
    {icon && (
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
        {icon}
      </div>
    )}
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 ${icon ? 'pl-12' : ''} shadow-inner focus:outline-none focus:bg-white focus:border-green-500 transition-all`}
    />
  </div>
);

const Button = ({ children, variant = 'primary', size = 'lg', className = '' }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all';
  const variants = {
    primary: 'bg-green-500 text-white border-b-4 border-green-700 shadow-lg hover:bg-green-400 active:border-b-0 active:translate-y-1',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} w-full py-3.5 text-lg ${className}`}>
      {children}
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const SignupPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">회원가입</h1>
          <p className="text-gray-600">Farm to Biz와 함께 성공적인 비즈니스를 시작하세요</p>
        </div>

        <Card>
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-green-600" /> 기본 정보
              </h3>
              <div className="space-y-4">
                <Input placeholder="이름" icon={<User size={18} />} />
                <Input type="email" placeholder="이메일" icon={<Mail size={18} />} />
                <Input type="password" placeholder="비밀번호 (8자 이상)" icon={<Lock size={18} />} />
                <Input type="password" placeholder="비밀번호 확인" icon={<Lock size={18} />} />
                <Input placeholder="연락처" icon={<Phone size={18} />} />
              </div>
            </div>

            {/* 사업자 정보 */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building size={20} className="text-green-600" /> 사업자 정보 (선택)
              </h3>
              <div className="space-y-4">
                <Input placeholder="상호명" icon={<Building size={18} />} />
                <Input placeholder="사업자등록번호" icon={<FileTextIcon size={18} />} />
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">약관 동의</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-green-600 rounded accent-green-600" />
                  <span className="font-bold text-gray-800">전체 동의</span>
                </label>

                <div className="ml-2 space-y-2">
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 rounded accent-green-600" />
                      <span className="text-gray-700">이용약관 동의 (필수)</span>
                    </div>
                    <a href="#" className="text-xs text-gray-400 hover:text-gray-600 border-b border-gray-300">보기</a>
                  </label>

                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 rounded accent-green-600" />
                      <span className="text-gray-700">개인정보 처리방침 동의 (필수)</span>
                    </div>
                    <a href="#" className="text-xs text-gray-400 hover:text-gray-600 border-b border-gray-300">보기</a>
                  </label>

                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 rounded accent-green-600" />
                      <span className="text-gray-700">마케팅 정보 수신 동의 (선택)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 가입 버튼 */}
            <Button variant="primary" size="lg" className="mt-6">
              <CheckCircle size={20} /> 가입하기
            </Button>

            <div className="text-center text-sm text-gray-600">
              이미 회원이신가요?{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-bold">
                로그인
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// 아이콘 래퍼 (lucide-react에 FileText가 없어 임시 대체)
const FileTextIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default SignupPage;
