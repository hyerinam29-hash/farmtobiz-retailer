import React from 'react';
import { User, Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Card = ({ children, padding = 'md', className = '', ...props }) => {
  const paddings = { md: 'p-6' };
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddings[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const MyPage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F8F9FA] font-sans">
      {/* 3D 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-100/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-blue-100/40 to-cyan-50/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-100/30 to-indigo-50/0 rounded-full blur-3xl -z-10"></div>

      {/* 3D 플로팅 오브젝트 */}
      <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 -z-10"></div>
      <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-gradient-to-br from-green-100/60 to-emerald-50/10 backdrop-blur-md rounded-[2rem] rotate-12 shadow-lg border border-white/30 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 relative z-10">
      
        {/* 사용자 정보 카드 */}
        <Card padding="md" className="mb-8 bg-gradient-to-r from-green-600 to-emerald-500 text-white border-none shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User size={40} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">김사장님</h2>
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    VIP
                  </span>
                </div>
                <p className="text-green-100 mb-1">맛있는 식당</p>
                <p className="text-sm text-green-100 opacity-80">kim@restaurant.com</p>
              </div>
            </div>
            <button className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
              <Settings size={24} />
            </button>
          </div>
        </Card>

        {/* 주문 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card padding="md" className="text-center hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-2 font-bold">전체 주문</div>
            <div className="text-3xl font-black text-blue-600">42</div>
          </Card>
          <Card padding="md" className="text-center hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-2 font-bold">배송 중</div>
            <div className="text-3xl font-black text-green-600">3</div>
          </Card>
          <Card padding="md" className="text-center hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-2 font-bold">배송 완료</div>
            <div className="text-3xl font-black text-gray-600">39</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 메뉴 */}
          <div className="lg:col-span-1 space-y-3">
            <Card padding="md" className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="text-green-600" size={24} />
                  <span className="font-bold text-gray-800">주문 내역</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">42</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </Card>
            <Card padding="md" className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="text-green-600" size={24} />
                  <span className="font-bold text-gray-800">찜한 상품</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">8</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </Card>
            <Card padding="md" className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="text-green-600" size={24} />
                  <span className="font-bold text-gray-800">설정</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </Card>

            <Card padding="md" className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 border-red-100 bg-red-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogOut className="text-red-500" size={24} />
                  <span className="font-bold text-red-500">로그아웃</span>
                </div>
              </div>
            </Card>
          </div>

          {/* 우측: 최근 주문 내역 */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-green-600" size={24} />
              최근 주문 내역
            </h3>
            <div className="space-y-3">
              <Card padding="md" className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">2023.11.28</div>
                    <div className="font-bold text-gray-800 mb-1">청송 꿀사과 외 2건</div>
                    <div className="text-xs text-gray-500">주문번호: ORD-042</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                    배송중
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-bold text-lg text-gray-800">98,000원</span>
                  <button className="text-sm text-green-600 font-bold hover:text-green-700">
                    상세보기 →
                  </button>
                </div>
              </Card>

              <Card padding="md" className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">2023.11.25</div>
                    <div className="font-bold text-gray-800 mb-1">의성 깐마늘 외 1건</div>
                    <div className="text-xs text-gray-500">주문번호: ORD-041</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    배송완료
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-bold text-lg text-gray-800">45,500원</span>
                  <button className="text-sm text-green-600 font-bold hover:text-green-700">
                    상세보기 →
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
