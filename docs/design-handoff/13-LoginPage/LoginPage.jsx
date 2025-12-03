import React from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';

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

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            🌱
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">로그인</h1>
          <p className="text-gray-600">사장님, 환영합니다!</p>
        </div>

        {/* 로그인 폼 */}
        <Card>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="이메일"
              icon={<Mail size={18} />}
            />
            <Input
              type="password"
              placeholder="비밀번호"
              icon={<Lock size={18} />}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                <span className="text-gray-600">로그인 상태 유지</span>
              </label>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                비밀번호 찾기
              </a>
            </div>

            <Button variant="primary" size="lg">
              <LogIn size={20} /> 로그인
            </Button>

            <div className="text-center text-sm text-gray-600 pt-2">
              아직 회원이 아니신가요?{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-bold">
                회원가입
              </a>
            </div>
          </div>
        </Card>

        {/* 소셜 로그인 */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F8F9FA] text-gray-500">또는</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-[#FEE500] hover:brightness-95 transition-all border-none shadow-sm">
              <span className="font-bold text-[#000000]">카카오 로그인</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-[#03C75A] hover:brightness-95 transition-all border-none shadow-sm">
              <span className="font-bold text-white">네이버 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
