/**
 * @file components/retailer/profile/ProfileEditForm.tsx
 * @description 내 정보 수정 폼 컴포넌트
 *
 * 소매점의 기본 정보(상호명, 전화번호, 주소)를 수정하는 폼입니다.
 *
 * @dependencies
 * - react-hook-form
 * - zod
 * - @hookform/resolvers
 * - actions/retailer/update-profile.ts
 * - lib/validation/retailer.ts
 */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  retailerProfileUpdateSchema,
  type RetailerProfileUpdateFormData,
} from "@/lib/validation/retailer";
import { updateRetailerProfile } from "@/actions/retailer/update-profile";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export default function ProfileEditForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<{
    business_name?: string;
    phone?: string;
    address?: string;
  } | null>(null);

  const form = useForm<RetailerProfileUpdateFormData>({
    resolver: zodResolver(retailerProfileUpdateSchema),
    defaultValues: {
      business_name: "",
      phone: "",
      address: "",
    },
  });

  const supabase = useClerkSupabaseClient();

  // 초기 데이터 로드
  useEffect(() => {
    async function loadProfile() {
      try {
        // 현재 사용자의 프로필 조회
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role")
          .single();

        if (profileError || !profile || profile.role !== "retailer") {
          console.error("프로필 조회 실패:", profileError);
          return;
        }

        // 소매점 정보 조회
        const { data: retailers, error: retailerError } = await supabase
          .from("retailers")
          .select("business_name, phone, address")
          .eq("profile_id", profile.id)
          .limit(1);

        if (retailerError) {
          console.error("소매점 정보 조회 실패:", retailerError);
          return;
        }

        if (retailers && retailers.length > 0) {
          const retailer = retailers[0];
          setInitialData({
            business_name: retailer.business_name,
            phone: retailer.phone,
            address: retailer.address,
          });
          form.reset({
            business_name: retailer.business_name,
            phone: retailer.phone,
            address: retailer.address,
          });
        }
      } catch (error) {
        console.error("프로필 로드 실패:", error);
        toast.error("프로필 정보를 불러오는 중 오류가 발생했습니다.");
      }
    }

    loadProfile();
  }, [form, supabase]);

  // 전화번호 하이픈 자동 추가 핸들러
  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let formatted = value;

    if (digits.length <= 3) {
      formatted = digits;
    } else if (digits.length <= 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length <= 11) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    } else {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }

    form.setValue("phone", formatted, { shouldValidate: true });
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: RetailerProfileUpdateFormData) => {
    setIsLoading(true);
    console.group("📝 [retailer] 프로필 수정 제출");

    try {
      const result = await updateRetailerProfile(data);

      if (result.success) {
        console.log("✅ [retailer] 프로필 수정 성공");
        toast.success("프로필 정보가 수정되었습니다.");
        // 초기 데이터 업데이트
        setInitialData({
          business_name: data.business_name || initialData?.business_name,
          phone: data.phone || initialData?.phone,
          address: data.address || initialData?.address,
        });
      } else {
        console.error("❌ [retailer] 프로필 수정 실패:", result.error);
        toast.error(result.error || "프로필 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ [retailer] 프로필 수정 중 예외 발생:", error);
      toast.error("예기치 않은 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-6xl">내 정보 수정</CardTitle>
        <CardDescription className="text-3xl">
          소매점의 기본 정보를 수정할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-20">
            {/* 상호명 */}
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-3xl">상호명</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 강남식자재마트"
                      {...field}
                      disabled={isLoading}
                      className="h-24 text-3xl"
                    />
                  </FormControl>
                  <FormDescription className="text-3xl">
                    현재 상호명: {initialData?.business_name || "없음"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 전화번호 */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-3xl">전화번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="010-1234-5678"
                      {...field}
                      onChange={(e) => {
                        handlePhoneChange(e.target.value);
                      }}
                      disabled={isLoading}
                      className="h-24 text-3xl"
                    />
                  </FormControl>
                  <FormDescription className="text-3xl">
                    현재 전화번호: {initialData?.phone || "없음"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 주소 */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-3xl">주소</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 서울시 강남구 테헤란로 123"
                      {...field}
                      disabled={isLoading}
                      className="h-24 text-3xl"
                    />
                  </FormControl>
                  <FormDescription className="text-3xl">
                    현재 주소: {initialData?.address || "없음"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 제출 버튼 */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="h-24 text-3xl px-12 py-6">
                {isLoading && <Loader2 className="mr-6 h-12 w-12 animate-spin" />}
                수정하기
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

