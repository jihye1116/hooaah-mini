'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import BottomFloating from '@/app/songil/components/BottomFloating';
import OtherContents from '@/app/songil/components/OtherContents';

type HealthCondition = {
  age: string | number;
  hand: number;
  tiredness: number;
  point: string[];
  description: string;
  health: string[];
};

type FoodRecommendation = {
  name: string;
  description: string;
};

type Caution = {
  category: string;
  reason: string;
  prevention: string;
};

type HealthcareResultData = {
  initial: string;
  condition: HealthCondition;
  massage: string[];
  food: FoodRecommendation[];
  caution: Caution;
  total: string;
  error?: boolean;
  errorText?: string;
};

const WhiteBox = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[20px] border-2 border-[#F5F6F8] bg-white p-6 ${className}`}
  >
    {children}
  </div>
);

const ProgressBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-4 last:mb-0">
    <div className="mb-1 flex items-center gap-2">
      <span className="w-20 text-sm font-semibold text-[#696969]">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E3E3E6]">
        <div
          className="h-full rounded-full bg-[#F97B68]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-[#696969]">{value}%</span>
    </div>
  </div>
);

export default function HealthcareResult() {
  const [result] = useState<HealthcareResultData | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedResult = localStorage.getItem('healthcare_result');
    if (!savedResult) return null;
    try {
      return JSON.parse(savedResult) as HealthcareResultData;
    } catch (e) {
      console.error('Failed to parse healthcare result', e);
      return null;
    }
  });

  const [resultImageUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('healthcare_image') || '';
  });

  if (!result || result.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3F1]">
        <div className="px-5 text-center">
          <p className="mb-4 text-[#696969]">
            {result?.errorText || '분석 결과를 불러올 수 없습니다.'}
          </p>
          <Link
            href="/songil?contents=handHealthCare"
            className="inline-block rounded-xl bg-[#F97B68] px-6 py-3 font-bold text-white"
          >
            다시 시도하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F5F3F1] pb-[120px]">
      <header className="sticky top-0 z-10 px-4 pt-4 pb-2">
        <Link href="/songil" className="-ml-2 inline-block p-2">
          <ChevronLeft className="h-6 w-6 text-[#696969]" />
        </Link>
      </header>

      <main className="px-5">
        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-[#F97B68]">나의 건강 체크</h2>
          <div className="mt-2 px-8 text-center">
            <h1 className="text-2xl font-bold break-keep text-[#883A2E]">
              {result.initial}
            </h1>
          </div>
        </div>

        {/* Condition Section */}
        <WhiteBox className="mb-4">
          <h3 className="mb-5 text-lg font-bold text-[#111111]">
            나의 혈류 나이는?
          </h3>

          <div className="mb-6 flex items-start gap-4">
            <div className="flex-1">
              {/* Age Box */}
              <div>
                <div className="mb-4 w-fit rounded-xl bg-[#F5F6F8] px-4 py-3">
                  <span className="text-xl font-bold text-[#111111]">
                    {result.condition.age}
                  </span>
                  <span className="ml-1 text-sm font-semibold text-[#696969]">
                    세
                  </span>
                </div>
              </div>

              <ProgressBar label="손 혈류 상태" value={result.condition.hand} />
              <ProgressBar label="피로도" value={result.condition.tiredness} />
            </div>

            {/* Hand Image */}
            <div className="relative h-[140px] w-[100px] shrink-0 overflow-hidden rounded-[20px] border border-gray-100 bg-white">
              {resultImageUrl ? (
                <Image
                  src={resultImageUrl}
                  alt="Result Hand"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                  No Image
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 space-y-2">
            {result.condition.point.map((p, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed font-semibold text-[#696969]"
              >
                • {p}
              </p>
            ))}
          </div>

          <p className="mb-6 text-sm leading-relaxed font-semibold text-[#696969]">
            {result.condition.description}
          </p>

          <div className="my-6 border-t border-[#F5F6F8]" />

          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            건강 상태 분석
          </h3>
          <div className="space-y-3">
            {result.condition.health.map((h, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#F5F6F8] text-sm font-bold text-[#696969]">
                  {idx + 1}
                </div>
                <span className="text-sm font-semibold text-[#696969]">
                  {h}
                </span>
              </div>
            ))}
          </div>
        </WhiteBox>

        {/* Massage Recommendation */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            나를 위한 혈류 마사지 방법
          </h3>
          <div className="space-y-3">
            {result.massage.map((m, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#F5F6F8] text-sm font-bold text-[#696969]">
                  {idx + 1}
                </div>
                <span className="text-sm font-semibold text-[#696969]">
                  {m}
                </span>
              </div>
            ))}
          </div>
        </WhiteBox>

        {/* Food Recommendation */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            지금 혈류를 좋게 만드는 음식
          </h3>
          <div className="space-y-6">
            {result.food.map((f, idx) => (
              <div key={idx}>
                <div className="mb-2 inline-block rounded-[10px] bg-[#FCC1B9] px-3 py-1.5">
                  <span className="text-sm font-bold text-[#883A2E]">
                    {f.name}
                  </span>
                </div>
                <p className="text-sm leading-relaxed font-semibold text-[#696969]">
                  {f.description}
                </p>
                {idx < result.food.length - 1 && (
                  <div className="mt-6 border-t border-[#F5F6F8]" />
                )}
              </div>
            ))}
          </div>
        </WhiteBox>

        {/* Caution Section */}
        <WhiteBox className="mb-4">
          <h3 className="mb-6 text-lg font-bold text-[#111111]">
            현재 조심해야하는 질병은
          </h3>

          <div className="mx-auto mb-6 w-fit rounded-[10px] bg-[#F5F6F8] p-3 text-center">
            <span className="text-base font-bold text-[#111111]">
              {result.caution.category}
            </span>
          </div>

          <p className="mb-6 text-sm leading-relaxed font-semibold text-[#696969]">
            {result.caution.reason}
          </p>

          <div className="my-6 border-t border-[#F5F6F8]" />

          <h3 className="mb-3 text-base font-bold text-[#111111]">예방 방법</h3>
          <p className="text-sm leading-relaxed font-semibold text-[#696969]">
            {result.caution.prevention}
          </p>
        </WhiteBox>

        {/* Total Analysis */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            종합 분석 결과
          </h3>
          <p className="text-sm leading-relaxed font-semibold text-[#696969]">
            {result.total}
          </p>
        </WhiteBox>

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}
