/**
 * @file components/retailer/profile/DeliveryAddressForm.tsx
 * @description 배송지 추가/수정 폼 컴포넌트
 *
 * 배송지 정보를 입력받아 추가하거나 수정하는 폼입니다.
 *
 * @dependencies
 * - react-hook-form
 * - zod
 * - @hookform/resolvers
 * - actions/retailer/delivery-addresses.ts
 * - lib/validation/retailer.ts
 */

"use client";

import { useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  deliveryAddressSchema,
  type DeliveryAddressFormData,
} from "@/lib/validation/retailer";
import {
  createDeliveryAddress,
  updateDeliveryAddress,
} from "@/actions/retailer/delivery-addresses";
import type { DeliveryAddress } from "@/types/database";

interface DeliveryAddressFormProps {
  initialData?: DeliveryAddress;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeliveryAddressForm({
  initialData,
  onSuccess,
  onCancel,
}: DeliveryAddressFormProps) {
  const isEditing = !!initialData;

  const form = useForm<DeliveryAddressFormData>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: {
      name: "",
      recipient_name: "",
      recipient_phone: "",
      address: "",
      address_detail: "",
      postal_code: "",
      is_default: false,
    },
  });

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        recipient_name: initialData.recipient_name,
        recipient_phone: initialData.recipient_phone,
        address: initialData.address,
        address_detail: initialData.address_detail || "",
        postal_code: initialData.postal_code || "",
        is_default: initialData.is_default,
      });
    }
  }, [initialData, form]);

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

    form.setValue("recipient_phone", formatted, { shouldValidate: true });
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: DeliveryAddressFormData) => {
    console.group(
      `📝 [retailer] 배송지 ${isEditing ? "수정" : "추가"} 제출`
    );

    try {
      let result;
      if (isEditing && initialData) {
        result = await updateDeliveryAddress(initialData.id, data);
      } else {
        result = await createDeliveryAddress(data);
      }

      if (result.success) {
        console.log(
          `✅ [retailer] 배송지 ${isEditing ? "수정" : "추가"} 성공`
        );
        toast.success(
          `배송지가 ${isEditing ? "수정" : "추가"}되었습니다.`
        );
        onSuccess();
      } else {
        console.error(
          `❌ [retailer] 배송지 ${isEditing ? "수정" : "추가"} 실패:`,
          result.error
        );
        toast.error(
          result.error ||
            `배송지 ${isEditing ? "수정" : "추가"}에 실패했습니다.`
        );
      }
    } catch (error) {
      console.error(
        `❌ [retailer] 배송지 ${isEditing ? "수정" : "추가"} 중 예외 발생:`,
        error
      );
      toast.error("예기치 않은 오류가 발생했습니다.");
    } finally {
      console.groupEnd();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 배송지 별칭 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>배송지 별칭 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 본점, 지점1"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormDescription>
                배송지를 구분하기 위한 별칭을 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 수령인 이름 */}
        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>수령인 이름 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 홍길동"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 수령인 전화번호 */}
        <FormField
          control={form.control}
          name="recipient_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>수령인 전화번호 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="010-1234-5678"
                  {...field}
                  onChange={(e) => {
                    handlePhoneChange(e.target.value);
                  }}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
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
              <FormLabel>주소 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 서울시 강남구 테헤란로 123"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 상세 주소 */}
        <FormField
          control={form.control}
          name="address_detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상세 주소</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 101호"
                  {...field}
                  value={field.value || ""}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 우편번호 */}
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>우편번호</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 06142"
                  {...field}
                  value={field.value || ""}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 기본 배송지 여부 */}
        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>기본 배송지로 설정</FormLabel>
                <FormDescription>
                  기본 배송지로 설정하면 주문 시 자동으로 선택됩니다.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "수정하기" : "추가하기"}
          </Button>
        </div>
      </form>
    </Form>
  );
}


