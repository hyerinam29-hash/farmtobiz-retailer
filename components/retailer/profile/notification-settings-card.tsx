/**
 * @file components/retailer/profile/notification-settings-card.tsx
 * @description 알림 설정 카드 (토글 UI)
 *
 * 주문 알림, 프로모션 알림, 뉴스레터, SMS 알림의 활성/비활성 토글을 제공합니다.
 * 현재는 클라이언트 상태만 변경하며, 서버 저장 로직은 포함하지 않습니다.
 */

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NotificationKey = "order" | "promo" | "newsletter" | "sms";

const items: Array<{
  key: NotificationKey;
  title: string;
  desc: string;
}> = [
  { key: "order", title: "주문 알림", desc: "주문 상태 변경 시 알림" },
  { key: "promo", title: "프로모션 알림", desc: "할인 및 이벤트 정보" },
  { key: "newsletter", title: "뉴스레터", desc: "주간 농산물 소식" },
  { key: "sms", title: "SMS 알림", desc: "문자 메시지 수신" },
];

export default function NotificationSettingsCard() {
  const [notifState, setNotifState] = useState<Record<NotificationKey, boolean>>({
    order: true,
    promo: true,
    newsletter: false,
    sms: true,
  });

  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          알림 설정
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          주문, 프로모션, 뉴스레터, SMS 알림 수신 상태를 관리하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-colors dark:bg-gray-800"
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">{item.desc}</p>
            </div>
            <button
              type="button"
              aria-pressed={notifState[item.key]}
              aria-label={`${item.title} 토글`}
              onClick={() =>
                setNotifState((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                notifState[item.key]
                  ? "bg-green-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  notifState[item.key] ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


