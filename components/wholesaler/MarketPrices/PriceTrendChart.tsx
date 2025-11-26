/**
 * @file components/wholesaler/MarketPrices/PriceTrendChart.tsx
 * @description 가격 추이 차트 컴포넌트
 *
 * 일주일 시세 추이를 차트로 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 일주일 시세 추이 차트 (Line Chart)
 * 2. 날짜별 평균 가격 표시
 * 3. 반응형 디자인
 *
 * @dependencies
 * - recharts (차트 라이브러리)
 * - lib/api/market-prices (PriceTrendItem)
 */

"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PriceTrendItem } from "@/lib/api/market-prices";

interface PriceTrendChartProps {
  data: PriceTrendItem[];
  isLoading?: boolean;
}

export default function PriceTrendChart({
  data,
  isLoading = false,
}: PriceTrendChartProps) {
  // 차트 데이터 포맷팅
  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: item.date,
      가격: item.price,
    }));
  }, [data]);

  // 가격 포맷팅 함수
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  };

  // 날짜 포맷팅 함수 (YYYY-MM-DD -> MM/DD)
  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${month}/${day}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">차트 로딩 중...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <div className="text-muted-foreground">차트 데이터가 없습니다.</div>
        <div className="text-sm text-muted-foreground">
          시세 추이를 조회하려면 대분류를 선택하세요.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">일주일 시세 추이</h3>
        <p className="text-sm text-muted-foreground">
          최근 7일간의 평균 가격 추이를 확인하세요.
        </p>
      </div>

      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              tickFormatter={(value) => formatPrice(value)}
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip
              formatter={(value: number) => formatPrice(value)}
              labelFormatter={(label) => `날짜: ${label}`}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="가격"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

