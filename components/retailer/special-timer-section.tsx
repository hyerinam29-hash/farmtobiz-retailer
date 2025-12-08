/**
 * @file components/retailer/special-timer-section.tsx
 * @description 연말 특가 타임세일 타이머 섹션
 *
 * 기능 변경 없이 시안에 맞춘 카운트다운 UI만 제공합니다.
 */

"use client";

import { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";

interface RemainingTime {
  hours: number;
  minutes: number;
  seconds: number;
}

const INITIAL_TIME: RemainingTime = { hours: 9, minutes: 59, seconds: 59 };

export default function SpecialTimerSection() {
  const [time, setTime] = useState<RemainingTime>(INITIAL_TIME);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white animate-pulse">
          <Zap size={28} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-red-600 leading-none mb-1">
            오늘만 이 가격!
          </h2>
          <p className="text-red-400 font-bold text-sm">한정수량 소진 시 조기 마감</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Clock size={24} className="text-gray-600" />
        <span className="text-gray-600 font-bold mr-2">남은 시간</span>
        <div className="flex gap-2 text-3xl font-black text-gray-900 font-mono">
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-red-600">
            {formatTime(time.hours)}
          </div>
          <span className="self-center">:</span>
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-red-600">
            {formatTime(time.minutes)}
          </div>
          <span className="self-center">:</span>
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-red-600">
            {formatTime(time.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
}

