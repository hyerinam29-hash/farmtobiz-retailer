/**
 * @file components/retailer/profile/ProfileTabs.tsx
 * @description 프로필 관리 탭 컴포넌트
 *
 * 내 정보 수정과 배송지 관리를 탭으로 구분하여 제공합니다.
 *
 * @dependencies
 * - components/ui/tabs
 * - components/retailer/profile/ProfileEditForm.tsx
 * - components/retailer/profile/DeliveryAddressList.tsx
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditForm from "./ProfileEditForm";
import DeliveryAddressList from "./DeliveryAddressList";

export default function ProfileTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">내 정보 수정</TabsTrigger>
        <TabsTrigger value="delivery">배송지 관리</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="mt-20">
        <ProfileEditForm />
      </TabsContent>
      
      <TabsContent value="delivery" className="mt-20">
        <DeliveryAddressList />
      </TabsContent>
    </Tabs>
  );
}

