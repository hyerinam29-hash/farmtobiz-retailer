/**
 * @file app/privacy/page.tsx
 * @description 개인정보처리방침 페이지
 *
 * Farm to Biz 플랫폼의 개인정보처리방침을 표시하는 페이지입니다.
 */

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/retailer/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors duration-200"
          >
            <ChevronLeft size={20} />
            <span>돌아가기</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
            개인정보 처리방침
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
            시행일: 2025년 12월 1일
          </p>
        </div>

        {/* 개인정보처리방침 내용 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 md:p-8 lg:p-10 space-y-8 transition-colors duration-200">
          {/* 서문 */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              [플랫폼 법인명] (이하 &quot;회사&quot;)은 정보주체의 개인정보를 「개인정보보호법」에 따라 처리하고, 본 처리방침을 통해 정보주체가 쉽게 확인할 수 있도록 상세하게 공개합니다.
            </p>
          </div>

          {/* 1. 개인정보의 처리 목적 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              1. 개인정보의 처리 목적
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-200">
              회사는 다음의 목적으로 개인정보를 처리하며, 목적 외의 용도로는 이용되지 않습니다.
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">회원 가입 및 관리:</strong> 본인 식별, 불량 회원 부정이용 방지, 회원 자격 유지 관리.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">서비스 제공:</strong> 재화 구매/판매 계약 이행, 요금 정산, 배송, 콘텐츠 제공.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">고충 처리:</strong> 민원인의 신원 확인, 민원 사항 확인, 사실 조사를 위한 연락/통지.
              </li>
            </ul>
          </section>

          {/* 2. 처리하는 개인정보 항목 및 수집 방법 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              2. 처리하는 개인정보 항목 및 수집 방법
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-200">
              회사는 서비스 제공을 위해 최소한의 개인정보를 수집하며, 항목은 서비스에 따라 다를 수 있습니다.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                  [수집 항목]
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                  <li>
                    <strong className="text-gray-900 dark:text-gray-100">회원 가입/관리 필수:</strong> 아이디, 비밀번호, 성명, 휴대전화번호, 이메일 주소, CI/DI (본인확인 시).
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-100">도매 파트너 필수:</strong> 사업자등록번호, 법인명, 대표자명, 정산 계좌번호, 담당자 연락처.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-100">결제 및 배송 필수:</strong> 수령인 성명, 주소, 연락처, 결제 정보(PG사 암호화 키).
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-100">서비스 이용 기록 (자동 수집):</strong> 접속 IP 정보, 쿠키, 서비스 이용 기록, 접속 로그.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                  [수집 방법]
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside transition-colors duration-200">
                  <li>홈페이지/앱 회원 가입 및 주문/결제 시.</li>
                  <li>서면, 전화, 이메일을 통한 상담 및 문의 시.</li>
                  <li>제휴사로부터의 제공 (동의 시).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 개인정보의 처리 및 보유 기간 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              3. 개인정보의 처리 및 보유 기간 (법적 보존 기간 명시)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-200">
              개인정보는 원칙적으로 수집 및 이용 목적이 달성되면 지체 없이 파기됩니다. 단, 관계 법령의 규정에 의하여 다음 기간 동안 보존합니다.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">전자상거래법:</strong> 계약 또는 청약철회, 대금 결제 및 재화 공급에 관한 기록: <strong className="text-gray-900 dark:text-gray-100">5년 보존</strong>.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">전자상거래법:</strong> 소비자의 불만 또는 분쟁 처리에 관한 기록: <strong className="text-gray-900 dark:text-gray-100">3년 보존</strong>.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">통신비밀보호법:</strong> 서비스 이용 관련 로그 기록 (접속지 추적 자료): <strong className="text-gray-900 dark:text-gray-100">3개월 보존</strong>.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">통신비밀보호법:</strong> 가입자 전기통신 일시, 개시·종료 시간 등: <strong className="text-gray-900 dark:text-gray-100">1년 보존</strong>.
              </li>
            </ul>
          </section>

          {/* 4. 개인정보의 제3자 제공 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-200">
              회사는 정보주체의 동의 없이 개인정보를 외부에 제공하지 않습니다.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">토스페이먼츠(PG사):</strong> 결제 승인 및 대금 정산 목적 (제공 항목: 성명, 연락처, 결제 정보).
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">법원, 수사기관:</strong> 법령에 정한 절차와 방법에 따라 제공 요청이 있는 경우.
              </li>
            </ul>
          </section>

          {/* 5. 개인정보 처리의 위탁 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              5. 개인정보 처리의 위탁 (배송 및 서비스 이행)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-200">
              회사는 원활한 업무 처리를 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있으며, 위탁 계약 체결 시 「개인정보보호법」에 따라 관리 감독을 철저히 하고 있습니다.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">도매 파트너 (판매자):</strong> 상품 배송 및 설치, CS 이행 (별도의 [개인정보 처리 위수탁 계약서] 참조).
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">택배사:</strong> 상품 배송 및 위치 추적 서비스 제공.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">[호스팅/서버 업체명]:</strong> 전산 시스템 관리 및 운영.
              </li>
            </ul>
          </section>

          {/* 6. 개인정보의 파기 절차 및 방법 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              6. 개인정보의 파기 절차 및 방법 (탈퇴 후 정보 분리 보관)
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                  파기 절차:
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 transition-colors duration-200">
                  회사는 이용 목적이 달성되거나 법정 보유 기간이 경과된 개인정보를 파기합니다.
                </p>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                    [회원 탈퇴 시 정보 처리]
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                    회원 탈퇴 시 즉시 파기되어야 할 개인정보를 제외하고, 법령에 따라 보존해야 하는 정보는 별도의 DB로 옮겨져 (종이의 경우 별도 보관함) 위 제3항에 명시된 법정 기간 동안 보유된 후 파기됩니다. 이 정보는 법률에 의한 경우가 아니고서는 보유 목적 외의 다른 용도로 이용되지 않습니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                  파기 방법:
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                  <li>
                    <strong className="text-gray-900 dark:text-gray-100">전자적 파일 형태:</strong> 기록을 재생할 수 없는 기술적 방법(로우레벨 포맷 등)을 사용하여 영구 삭제합니다.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-100">종이 문서:</strong> 분쇄하거나 소각하여 파기합니다.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7. 개인정보의 안전성 확보 조치 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              7. 개인정보의 안전성 확보 조치 (기술적/관리적/물리적 강화)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-200">
              회사는 「개인정보보호법」 제29조에 따라 다음과 같이 안전성 확보에 필요한 조치를 하고 있습니다.
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">관리적 조치:</strong> 내부관리계획 수립 및 시행, 정기적인 개인정보취급자 교육 시행, 접근 권한의 최소화.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">기술적 조치:</strong>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li><strong className="text-gray-900 dark:text-gray-100">암호화:</strong> 비밀번호, 고유식별정보 등 중요한 데이터는 암호화하여 저장 및 관리.</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">접근 통제:</strong> 침입 차단 시스템을 이용한 외부로부터의 무단 접근 통제.</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">접속 기록:</strong> 개인정보처리시스템 접속 기록을 최소 6개월 이상 보관 및 관리.</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">보안 프로그램:</strong> 해킹 및 바이러스 방지를 위한 보안 프로그램 설치 및 주기적인 갱신.</li>
                </ul>
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">물리적 조치:</strong> 전산실, 자료 보관실 등 개인정보 보관 장소에 대한 접근 통제 및 잠금 장치 마련.
              </li>
            </ul>
          </section>

          {/* 8. 정보주체와 법정대리인의 권리 및 행사 방법 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              8. 정보주체와 법정대리인의 권리 및 행사 방법
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              정보주체(만 14세 미만은 법정대리인)는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지 요구 등 개인정보 보호 관련 권리를 행사할 수 있으며, 회사는 이에 지체 없이 응합니다.
            </p>
          </section>

          {/* 9. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              9. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              회사는 서비스 제공을 위해 이용 정보를 저장하고 수시로 불러오는 <strong className="text-gray-900 dark:text-gray-100">&apos;쿠키(Cookie)&apos;</strong>를 사용하며, 이용자는 웹 브라우저 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다. (단, 거부 시 일부 서비스 이용이 제한될 수 있습니다.)
            </p>
          </section>

          {/* 10. 개인정보 보호 책임자 및 담당 부서 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              10. 개인정보 보호 책임자 및 담당 부서
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              <p>
                <strong className="text-gray-900 dark:text-gray-100">개인정보 보호 책임자:</strong> 성명: [이름] / 직책: [직책] / 연락처: [전화번호] / 이메일: [이메일 주소]
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">담당 부서:</strong> [담당 부서명]
              </p>
            </div>
          </section>

          {/* 11. 권익 침해 구제 방법 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
              11. 권익 침해 구제 방법
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-200">
              정보주체는 개인정보 침해에 대한 구제를 받기 위해 다음 기관에 분쟁 해결이나 상담을 신청할 수 있습니다.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">개인정보 분쟁조정위원회:</strong> (국번없이) 1833-6972 (<a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">www.kopico.go.kr</a>)
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">개인정보 침해신고센터:</strong> (국번없이) 118 (<a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">privacy.kisa.or.kr</a>)
              </li>
            </ul>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/retailer/dashboard"
            className="px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-xl font-bold hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
          >
            확인
          </Link>
        </div>
      </div>
    </div>
  );
}

