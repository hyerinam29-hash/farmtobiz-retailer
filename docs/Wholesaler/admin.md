# 👨‍💼 관리자 페이지 개발 가이드라인

> **프로젝트명**: AI 기반 B2B 도매-소매 중개 플랫폼  
> **담당**: 관리자 페이지 개발  
> **개발 방식**: 커서 AI 바이브 코딩  
> **대상**: 초보 개발자  
> **최종 업데이트**: 2025-01-XX

---

## 📋 목차

1. [개요](#1-개요)
2. [고려사항](#2-고려사항)
3. [구현 순서](#3-구현-순서)
4. [단계별 구현 가이드](#4-단계별-구현-가이드)
5. [관리자 계정 생성](#5-관리자-계정-생성)
6. [보안 및 주의사항](#6-보안-및-주의사항)
7. [체크리스트](#7-체크리스트)

---

## 1. 개요

### 1.1 관리자 페이지란?

관리자가 도매사업자의 가입 승인/반려를 처리하고, 시스템을 관리하는 페이지입니다.

### 1.2 핵심 기능 (최소 버전)

- ✅ **도매 승인 대기 목록 조회**: `status='pending'`인 도매사업자 목록
- ✅ **도매 상세 정보 확인**: 사업자 정보 전체 조회
- ✅ **승인 처리**: 도매사업자 승인 (`status='approved'`)
- ✅ **반려 처리**: 도매사업자 반려 (`status='rejected'`, 반려 사유 입력)
- ✅ **감사 로그 기록**: 모든 관리자 액션 기록

### 1.3 접근 방식

- **URL 직접 접속**: `/admin` 경로로 직접 접속
- **로그인**: Clerk 인증을 통한 로그인
- **권한 체크**: `role='admin'`인 사용자만 접근 가능
- **버튼 없음**: 별도의 관리자 페이지 접근 버튼 없음 (보안상 직접 URL 입력)

---

## 2. 고려사항

### 2.1 관리자 권한 체크 (필수)

모든 `/admin/*` 경로는 관리자 권한을 확인해야 합니다.

- `lib/clerk/auth.ts`에 `requireAdmin()` 함수 추가 필요
- 관리자가 아니면 접근 차단 또는 홈으로 리다이렉트

### 2.2 관리자 레이아웃 보호

`app/admin/layout.tsx`에서 모든 하위 페이지를 보호합니다.

- 레이아웃 레벨에서 권한 체크
- 관리자가 아니면 접근 불가

### 2.3 관리자 계정 생성

관리자 계정은 **수동으로 생성**해야 합니다.

- Clerk에서 관리자 계정 생성 (Clerk 대시보드)
- Supabase에서 `profiles` 테이블에 수동 추가
- 초기에는 개발자만 관리자 계정 보유

### 2.4 도매 승인 대기 목록 조회

`/admin/wholesalers/pending`에서 `status='pending'`인 도매사업자 목록을 조회합니다.

- `wholesalers` 테이블에서 `status='pending'` 조회
- `profiles`와 조인하여 이메일 등 정보 포함
- 정렬: `created_at DESC` (최신순)

### 2.5 승인/반려 기능 (Server Action)

Server Action으로 승인/반려를 처리합니다.

- `wholesalers.status` 업데이트
- `approved_at` 또는 `rejection_reason` 저장
- `audit_logs`에 기록
- IP 주소 기록 (`headers()`에서 추출)

### 2.6 감사 로그 기록

모든 관리자 액션을 `audit_logs` 테이블에 기록합니다.

- 액션 타입: `wholesaler_approve`, `wholesaler_reject`
- 대상: `target_type='wholesaler'`, `target_id=wholesaler_id`
- IP 주소: `headers()`에서 추출
- 상세 정보: JSONB로 저장

### 2.7 IP 주소 추출

Next.js 15에서는 `headers()`가 Promise를 반환합니다.

```typescript
const headersList = await headers();
const ipAddress =
  headersList.get("x-forwarded-for") ||
  headersList.get("x-real-ip") ||
  "unknown";
```

### 2.8 에러 처리

- 승인/반려 실패 시 사용자에게 알림
- 데이터베이스 오류 처리
- 권한 오류 처리

---

## 3. 구현 순서

```
1단계: 관리자 권한 체크 함수 추가
   └─ lib/clerk/auth.ts에 requireAdmin() 추가

2단계: 관리자 레이아웃 생성
   └─ app/admin/layout.tsx (권한 체크 포함)

3단계: 도매 승인 대기 목록 페이지
   └─ app/admin/wholesalers/pending/page.tsx

4단계: 도매 상세 페이지
   └─ app/admin/wholesalers/[id]/page.tsx

5단계: 승인/반려 Server Action
   └─ actions/admin/wholesaler-approval.ts

6단계: 관리자 계정 생성 (수동)
   └─ Supabase에서 직접 INSERT
```

---

## 4. 단계별 구현 가이드

### 4.1 관리자 권한 체크 함수 추가

**파일**: `lib/clerk/auth.ts`

**커서 AI 프롬프트:**

```
lib/clerk/auth.ts 파일에 관리자 권한 체크 함수를 추가해줘.

요구사항:
- requireAdmin() 함수 추가
- requireAuth()를 먼저 호출하여 인증 확인
- role이 'admin'이 아니면 홈('/')으로 리다이렉트
- 관리자인 경우 ProfileWithDetails 반환
- JSDoc 주석 추가
```

**예상 코드:**

````typescript
/**
 * 관리자 권한 필수 검증
 *
 * 관리자 페이지에서 사용합니다.
 * 인증되지 않았거나 관리자가 아닌 경우 리다이렉트합니다.
 *
 * @returns {Promise<ProfileWithDetails>} 관리자 프로필 정보 (항상 반환됨, 권한 없으면 리다이렉트)
 *
 * @throws {never} 권한 없을 시 리다이렉트하므로 예외를 던지지 않음
 *
 * @example
 * ```tsx
 * export default async function AdminPage() {
 *   const profile = await requireAdmin();
 *   // 여기서는 항상 관리자
 *   return <div>관리자 페이지</div>;
 * }
 * ```
 */
export async function requireAdmin(): Promise<ProfileWithDetails> {
  const profile = await requireAuth();

  if (profile.role !== "admin") {
    console.log("🚫 [auth] requireAdmin: 관리자 권한 없음, 리다이렉트");
    redirect("/");
  }

  return profile;
}
````

---

### 4.2 관리자 레이아웃 생성

**파일**: `app/admin/layout.tsx`

**커서 AI 프롬프트:**

```
관리자 페이지 레이아웃을 만들어줘.

요구사항:
- requireAdmin()으로 관리자 권한 체크
- 관리자 전용 네비게이션 (사이드바 또는 헤더)
- 도매 승인 대기 목록 링크
- 감사 로그 링크 (선택)
- 깔끔한 관리자 UI

파일: app/admin/layout.tsx
```

**예상 코드:**

```typescript
// app/admin/layout.tsx
import { requireAdmin } from "@/lib/clerk/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 관리자 권한 체크
  const profile = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">관리자 페이지</h1>
            <nav className="flex gap-4">
              <Link
                href="/admin/wholesalers/pending"
                className="text-gray-700 hover:text-gray-900"
              >
                도매 승인 대기
              </Link>
              <Link
                href="/admin/audit-logs"
                className="text-gray-700 hover:text-gray-900"
              >
                감사 로그
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
```

---

### 4.3 도매 승인 대기 목록 페이지

**파일**: `app/admin/wholesalers/pending/page.tsx`

**커서 AI 프롬프트:**

```
도매 승인 대기 목록 페이지를 만들어줘.

요구사항:
- status='pending'인 도매사업자 목록 조회
- profiles 테이블과 조인하여 이메일 정보 포함
- 테이블 형태로 표시 (상호명, 사업자번호, 이메일, 신청일)
- 각 행 클릭 시 상세 페이지로 이동
- 정렬: created_at DESC (최신순)
- 로딩 상태 처리
- 빈 목록 처리

파일: app/admin/wholesalers/pending/page.tsx
```

**예상 코드:**

```typescript
// app/admin/wholesalers/pending/page.tsx
import { requireAdmin } from "@/lib/clerk/auth";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default async function PendingWholesalersPage() {
  await requireAdmin();

  const supabase = createClerkSupabaseClient();

  // 승인 대기 도매사업자 목록 조회
  const { data: wholesalers, error } = await supabase
    .from("wholesalers")
    .select(
      `
      id,
      business_name,
      business_number,
      representative,
      phone,
      created_at,
      profiles!inner (
        email
      )
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ [admin] 승인 대기 목록 조회 오류:", error);
    return <div>오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">도매 승인 대기 목록</h1>

      {wholesalers && wholesalers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          승인 대기 중인 도매사업자가 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상호명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사업자번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  대표자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wholesalers?.map((wholesaler) => (
                <tr key={wholesaler.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {wholesaler.business_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {wholesaler.business_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {wholesaler.representative}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(wholesaler.profiles as any)?.email || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(
                      new Date(wholesaler.created_at),
                      "yyyy-MM-dd HH:mm",
                      { locale: ko },
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/admin/wholesalers/${wholesaler.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

### 4.4 도매 상세 페이지

**파일**: `app/admin/wholesalers/[id]/page.tsx`

**커서 AI 프롬프트:**

```
도매사업자 상세 페이지를 만들어줘.

요구사항:
- 도매사업자 ID로 전체 정보 조회
- 사업자 정보 전체 표시 (상호명, 사업자번호, 대표자, 연락처, 주소, 계좌정보)
- 승인 버튼 (Server Action)
- 반려 버튼 (반려 사유 입력 모달)
- 승인/반려 후 목록 페이지로 리다이렉트
- 감사 로그 기록

파일: app/admin/wholesalers/[id]/page.tsx
```

**예상 코드:**

```typescript
// app/admin/wholesalers/[id]/page.tsx
import { requireAdmin } from "@/lib/clerk/auth";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  approveWholesaler,
  rejectWholesaler,
} from "@/actions/admin/wholesaler-approval";
import { WholesalerApprovalForm } from "@/components/admin/WholesalerApprovalForm";

export default async function WholesalerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAdmin();
  const { id } = await params;

  const supabase = createClerkSupabaseClient();

  // 도매사업자 정보 조회
  const { data: wholesaler, error } = await supabase
    .from("wholesalers")
    .select(
      `
      *,
      profiles!inner (
        email
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !wholesaler) {
    notFound();
  }

  // 이미 승인/반려된 경우 목록으로 리다이렉트
  if (wholesaler.status !== "pending") {
    redirect("/admin/wholesalers/pending");
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/wholesalers/pending"
          className="text-blue-600 hover:text-blue-900"
        >
          ← 목록으로
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">도매사업자 상세 정보</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">상호명</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {wholesaler.business_name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">사업자번호</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {wholesaler.business_number}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">대표자</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {wholesaler.representative}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">연락처</dt>
            <dd className="mt-1 text-sm text-gray-900">{wholesaler.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">이메일</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {(wholesaler.profiles as any)?.email || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">주소</dt>
            <dd className="mt-1 text-sm text-gray-900">{wholesaler.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">계좌정보</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {wholesaler.bank_account}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">익명 코드</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {wholesaler.anonymous_code}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">신청일</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(wholesaler.created_at).toLocaleString("ko-KR")}
            </dd>
          </div>
        </dl>
      </div>

      {/* 승인/반려 폼 */}
      <WholesalerApprovalForm
        wholesalerId={wholesaler.id}
        adminId={profile.id}
      />
    </div>
  );
}
```

---

### 4.5 승인/반려 Server Action

**파일**: `actions/admin/wholesaler-approval.ts`

**커서 AI 프롬프트:**

```
도매사업자 승인/반려 Server Action을 만들어줘.

요구사항:
- approveWholesaler() 함수: status='approved', approved_at 설정
- rejectWholesaler() 함수: status='rejected', rejection_reason 설정
- audit_logs 테이블에 기록 (액션, 대상, IP 주소)
- IP 주소는 headers()에서 추출
- 에러 처리 및 로깅

파일: actions/admin/wholesaler-approval.ts
```

**예상 코드:**

```typescript
// actions/admin/wholesaler-approval.ts
"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * IP 주소 추출
 */
async function getIpAddress(): Promise<string> {
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown";
  return ipAddress;
}

/**
 * 도매사업자 승인
 */
export async function approveWholesaler(wholesalerId: string, adminId: string) {
  try {
    const supabase = getServiceRoleClient();
    const ipAddress = await getIpAddress();

    // 도매사업자 승인 처리
    const { error: updateError } = await supabase
      .from("wholesalers")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq("id", wholesalerId);

    if (updateError) {
      console.error("❌ [admin] 도매사업자 승인 오류:", updateError);
      throw new Error("승인 처리 중 오류가 발생했습니다.");
    }

    // 감사 로그 기록
    const { error: logError } = await supabase.from("audit_logs").insert({
      user_id: adminId,
      action: "wholesaler_approve",
      target_type: "wholesaler",
      target_id: wholesalerId,
      details: {
        wholesaler_id: wholesalerId,
        approved_at: new Date().toISOString(),
      },
      ip_address: ipAddress,
    });

    if (logError) {
      console.error("❌ [admin] 감사 로그 기록 오류:", logError);
      // 감사 로그 실패는 치명적이지 않으므로 계속 진행
    }

    console.log("✅ [admin] 도매사업자 승인 완료:", wholesalerId);

    // 캐시 무효화 및 리다이렉트
    revalidatePath("/admin/wholesalers/pending");
    redirect("/admin/wholesalers/pending");
  } catch (error) {
    console.error("❌ [admin] approveWholesaler 예외:", error);
    throw error;
  }
}

/**
 * 도매사업자 반려
 */
export async function rejectWholesaler(
  wholesalerId: string,
  adminId: string,
  rejectionReason: string,
) {
  try {
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error("반려 사유를 입력해주세요.");
    }

    const supabase = getServiceRoleClient();
    const ipAddress = await getIpAddress();

    // 도매사업자 반려 처리
    const { error: updateError } = await supabase
      .from("wholesalers")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason.trim(),
        approved_at: null,
      })
      .eq("id", wholesalerId);

    if (updateError) {
      console.error("❌ [admin] 도매사업자 반려 오류:", updateError);
      throw new Error("반려 처리 중 오류가 발생했습니다.");
    }

    // 감사 로그 기록
    const { error: logError } = await supabase.from("audit_logs").insert({
      user_id: adminId,
      action: "wholesaler_reject",
      target_type: "wholesaler",
      target_id: wholesalerId,
      details: {
        wholesaler_id: wholesalerId,
        rejection_reason: rejectionReason.trim(),
        rejected_at: new Date().toISOString(),
      },
      ip_address: ipAddress,
    });

    if (logError) {
      console.error("❌ [admin] 감사 로그 기록 오류:", logError);
      // 감사 로그 실패는 치명적이지 않으므로 계속 진행
    }

    console.log("✅ [admin] 도매사업자 반려 완료:", wholesalerId);

    // 캐시 무효화 및 리다이렉트
    revalidatePath("/admin/wholesalers/pending");
    redirect("/admin/wholesalers/pending");
  } catch (error) {
    console.error("❌ [admin] rejectWholesaler 예외:", error);
    throw error;
  }
}
```

---

### 4.6 승인/반려 폼 컴포넌트

**파일**: `components/admin/WholesalerApprovalForm.tsx`

**커서 AI 프롬프트:**

```
도매사업자 승인/반려 폼 컴포넌트를 만들어줘.

요구사항:
- 승인 버튼 (확인 모달 포함)
- 반려 버튼 (반려 사유 입력 모달)
- react-hook-form 사용
- zod 스키마 검증
- 에러 처리 및 토스트 알림

파일: components/admin/WholesalerApprovalForm.tsx
```

**예상 코드:**

```typescript
// components/admin/WholesalerApprovalForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  approveWholesaler,
  rejectWholesaler,
} from "@/actions/admin/wholesaler-approval";
import { CheckCircle, XCircle } from "lucide-react";

const rejectSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, "반려 사유는 최소 10자 이상 입력해주세요.")
    .max(500, "반려 사유는 최대 500자까지 입력 가능합니다."),
});

type RejectFormData = z.infer<typeof rejectSchema>;

interface WholesalerApprovalFormProps {
  wholesalerId: string;
  adminId: string;
}

export function WholesalerApprovalForm({
  wholesalerId,
  adminId,
}: WholesalerApprovalFormProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const form = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const handleApprove = async () => {
    if (!confirm("정말 승인하시겠습니까?")) {
      return;
    }

    setIsApproving(true);
    try {
      await approveWholesaler(wholesalerId, adminId);
    } catch (error) {
      console.error("승인 오류:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (data: RejectFormData) => {
    setIsRejecting(true);
    try {
      await rejectWholesaler(wholesalerId, adminId, data.rejectionReason);
      setIsRejectDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("반려 오류:", error);
      alert(
        error instanceof Error
          ? error.message
          : "반려 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex gap-4">
      {/* 승인 버튼 */}
      <Button
        onClick={handleApprove}
        disabled={isApproving || isRejecting}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {isApproving ? "승인 중..." : "승인"}
      </Button>

      {/* 반려 버튼 */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={isApproving || isRejecting}>
            <XCircle className="w-4 h-4 mr-2" />
            반려
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>도매사업자 반려</DialogTitle>
            <DialogDescription>
              반려 사유를 입력해주세요. 이 사유는 도매사업자에게 전달됩니다.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleReject)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>반려 사유</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="반려 사유를 입력해주세요 (최소 10자)"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isRejecting}
                >
                  {isRejecting ? "반려 중..." : "반려 처리"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 5. 관리자 계정 생성

### 5.1 Clerk에서 관리자 계정 생성

1. Clerk 대시보드 접속
2. Users 메뉴에서 새 사용자 생성
3. 이메일/비밀번호로 계정 생성
4. 생성된 사용자의 `User ID` 복사 (예: `user_2abc123...`)

### 5.2 Supabase에서 프로필 생성

Supabase 대시보드의 SQL Editor에서 실행:

```sql
-- 관리자 프로필 생성
INSERT INTO profiles (clerk_user_id, email, role, status)
VALUES (
  'clerk_사용자_ID',  -- 위에서 복사한 Clerk User ID
  'admin@example.com',  -- 관리자 이메일
  'admin',
  'active'
);
```

### 5.3 확인

1. `/admin` 경로로 접속
2. Clerk 로그인 화면에서 관리자 계정으로 로그인
3. 관리자 페이지 접근 확인

---

## 6. 보안 및 주의사항

### 6.1 보안 체크리스트

- ✅ 모든 `/admin/*` 경로는 `requireAdmin()`으로 보호
- ✅ Server Action에서도 권한 재확인
- ✅ 감사 로그는 모든 관리자 액션에 기록
- ✅ IP 주소는 프록시 환경 고려하여 추출
- ✅ 프로덕션 배포 전 권한 체크 테스트 필수

### 6.2 주의사항

1. **관리자 계정은 초기에 수동으로만 생성**

   - 자동 생성 기능은 보안상 위험
   - 프로덕션에서는 반드시 수동 생성

2. **감사 로그는 필수**

   - 모든 관리자 액션 기록
   - 나중에 문제 발생 시 추적 가능

3. **에러 처리**

   - 사용자에게 친화적인 에러 메시지
   - 개발자용 상세 로그는 서버에만 기록

4. **프로덕션 배포 전**
   - 관리자 권한 체크 테스트
   - 승인/반려 기능 테스트
   - 감사 로그 기록 확인

---

## 7. 체크리스트

### 7.1 기본 구현

- [ ] `lib/clerk/auth.ts`에 `requireAdmin()` 함수 추가
- [ ] `app/admin/layout.tsx` 생성 (권한 체크 포함)
- [ ] `app/admin/wholesalers/pending/page.tsx` 생성
- [ ] `app/admin/wholesalers/[id]/page.tsx` 생성
- [ ] `actions/admin/wholesaler-approval.ts` 생성
- [ ] `components/admin/WholesalerApprovalForm.tsx` 생성

### 7.2 기능 구현

- [ ] 도매 승인 대기 목록 조회
- [ ] 도매 상세 정보 조회
- [ ] 승인 기능 (Server Action)
- [ ] 반려 기능 (Server Action, 반려 사유 입력)
- [ ] 감사 로그 기록
- [ ] IP 주소 추출 및 기록

### 7.3 관리자 계정

- [ ] Clerk에서 관리자 계정 생성
- [ ] Supabase에서 프로필 생성
- [ ] 관리자 페이지 접근 테스트

### 7.4 테스트

- [ ] 관리자 권한 체크 테스트
- [ ] 승인 기능 테스트
- [ ] 반려 기능 테스트
- [ ] 감사 로그 기록 확인
- [ ] 비관리자 접근 차단 확인

---

## 8. 참고 자료

- [도매 페이지 가이드라인](./WS_Guideline.md)
- [PRD 문서](../../PRD.md)
- [데이터베이스 스키마](../../../supabase/migrations/mk_schema2.sql)

---

**작성일**: 2025-01-XX  
**최종 업데이트**: 2025-01-XX
