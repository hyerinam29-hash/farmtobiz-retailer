/**
 * @file components/retailer/profile/DeliveryAddressList.tsx
 * @description 배송지 관리 컴포넌트
 *
 * 배송지 목록을 표시하고, 추가/수정/삭제 기능을 제공합니다.
 *
 * @dependencies
 * - actions/retailer/delivery-addresses.ts
 * - components/retailer/profile/DeliveryAddressForm.tsx
 */

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, MapPin, Trash2, Edit2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  getDeliveryAddresses,
  deleteDeliveryAddress,
} from "@/actions/retailer/delivery-addresses";
import type { DeliveryAddress } from "@/types/database";
import DeliveryAddressForm from "./DeliveryAddressForm";

export default function DeliveryAddressList() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(
    null
  );

  // 배송지 목록 로드
  const loadAddresses = async () => {
    setIsLoading(true);
    console.group("📋 [retailer] 배송지 목록 로드");

    try {
      const result = await getDeliveryAddresses();
      if (result.success && result.data) {
        setAddresses(result.data);
        console.log("✅ [retailer] 배송지 목록 로드 완료:", result.data.length);
      } else {
        console.error("❌ [retailer] 배송지 목록 로드 실패:", result.error);
        toast.error(result.error || "배송지 목록을 불러오는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("❌ [retailer] 배송지 목록 로드 중 예외 발생:", error);
      toast.error("예기치 않은 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // 배송지 삭제
  const handleDelete = async (addressId: string) => {
    if (!confirm("정말 이 배송지를 삭제하시겠습니까?")) {
      return;
    }

    console.group("🗑️ [retailer] 배송지 삭제");

    try {
      const result = await deleteDeliveryAddress(addressId);
      if (result.success) {
        console.log("✅ [retailer] 배송지 삭제 완료");
        toast.success("배송지가 삭제되었습니다.");
        loadAddresses();
      } else {
        console.error("❌ [retailer] 배송지 삭제 실패:", result.error);
        toast.error(result.error || "배송지 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ [retailer] 배송지 삭제 중 예외 발생:", error);
      toast.error("예기치 않은 오류가 발생했습니다.");
    } finally {
      console.groupEnd();
    }
  };

  // 배송지 추가/수정 폼 열기
  const handleOpenForm = (address?: DeliveryAddress) => {
    setEditingAddress(address || null);
    setIsDialogOpen(true);
  };

  // 배송지 추가/수정 완료 후 처리
  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    loadAddresses();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>배송지 관리</CardTitle>
              <CardDescription>
                주문 시 사용할 배송지를 관리할 수 있습니다.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="mr-2 h-4 w-4" />
              배송지 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              배송지 목록을 불러오는 중...
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>등록된 배송지가 없습니다.</p>
              <p className="text-sm mt-2">배송지 추가 버튼을 눌러 배송지를 등록해주세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{address.name}</h3>
                          {address.is_default && (
                            <Badge variant="default" className="bg-green-500">
                              <Star className="mr-1 h-3 w-3" />
                              기본 배송지
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">수령인:</span>{" "}
                            {address.recipient_name}
                          </p>
                          <p>
                            <span className="font-medium">연락처:</span>{" "}
                            {address.recipient_phone}
                          </p>
                          <p>
                            <span className="font-medium">주소:</span>{" "}
                            {address.address}
                            {address.address_detail && ` ${address.address_detail}`}
                          </p>
                          {address.postal_code && (
                            <p>
                              <span className="font-medium">우편번호:</span>{" "}
                              {address.postal_code}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(address)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 배송지 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "배송지 수정" : "배송지 추가"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "배송지 정보를 수정할 수 있습니다."
                : "새로운 배송지를 등록할 수 있습니다."}
            </DialogDescription>
          </DialogHeader>
          <DeliveryAddressForm
            initialData={editingAddress || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingAddress(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}


