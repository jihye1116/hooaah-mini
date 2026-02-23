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

const ProgressBar = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="mb-4 last:mb-0">
    <div className="flex items-center gap-2 mb-1">
      <span className="w-20 text-sm font-semibold text-[#696969]">{label}</span>
      <div className="flex-1 h-2.5 bg-[#E3E3E6] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#F97B68] rounded-full"
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
    const savedResult = localStorage.getItem('palmistry_result'); // Reuse key as per uploader logic
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
    return localStorage.getItem('palmistry_image') || '';
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
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#F97B68]">혈류 건강 진단</h2>
          <div className="mt-2 text-center px-8">
             <h1 className="text-2xl font-bold text-[#883A2E] break-keep">
              {result.initial}
            </h1>
          </div>
        </div>

        {/* Condition Section */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-5">혈관 건강 나이</h3>
          
          <div className="flex gap-4 items-start mb-6">
            <div className="flex-1">
              {/* Age Box */}
              <div className="bg-[#F5F6F8] rounded-xl py-3 px-4 text-center mb-4">
                <span className="text-xl font-bold text-[#111111]">{result.condition.age}</span>
                <span className="text-sm font-semibold text-[#696969] ml-1">세</span>
              </div>

              <ProgressBar label="손 혈류 상태" value={result.condition.hand} />
              <ProgressBar label="피로도" value={result.condition.tiredness} />
            </div>

            {/* Hand Image */}
            <div className="relative w-[100px] h-[140px] shrink-0 rounded-[20px] overflow-hidden bg-white border border-gray-100">
              {resultImageUrl ? (
                <Image
                  src={resultImageUrl}
                  alt="Result Hand"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {result.condition.point.map((p, idx) => (
              <p key={idx} className="text-sm font-semibold text-[#696969] leading-relaxed">
                • {p}
              </p>
            ))}
          </div>

          <p className="text-sm font-semibold text-[#696969] leading-relaxed mb-6">
            {result.condition.description}
          </p>

          <div className="border-t border-[#F5F6F8] my-6" />

          <h3 className="text-lg font-bold text-[#111111] mb-4">건강 분석</h3>
          <div className="space-y-3">
            {result.condition.health.map((h, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div className="w-[22px] h-[22px] rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#696969] font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <span className="text-sm font-semibold text-[#696969]">{h}</span>
              </div>
            ))}
          </div>
        </WhiteBox>

        {/* Massage Recommendation */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-4">추천 마사지</h3>
          <div className="space-y-3">
            {result.massage.map((m, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div className="w-[22px] h-[22px] rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#696969] font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <span className="text-sm font-semibold text-[#696969]">{m}</span>
              </div>
            ))}
          </div>
        </WhiteBox>

        {/* Food Recommendation */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-4">추천 음식</h3>
          <div className="space-y-6">
            {result.food.map((f, idx) => (
              <div key={idx}>
                <div className="inline-block bg-[#FCC1B9] rounded-[10px] px-3 py-1.5 mb-2">
                  <span className="text-sm font-bold text-[#883A2E]">{f.name}</span>
                </div>
                <p className="text-sm font-semibold text-[#696969] leading-relaxed">
                  {f.description}
                </p>
                {idx < result.food.length - 1 && (
                  <div className="border-t border-[#F5F6F8] mt-6" />
                )}
              </div>
            ))}
          </div>
        </WhiteBox>

        {/* Caution Section */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-6">주의해야 할 질환</h3>
          
          <div className="bg-[#F5F6F8] rounded-[10px] p-3 text-center mb-6">
            <span className="text-base font-bold text-[#111111]">
              {result.caution.category}
            </span>
          </div>

          <p className="text-sm font-semibold text-[#696969] leading-relaxed mb-6">
            {result.caution.reason}
          </p>

          <div className="border-t border-[#F5F6F8] my-6" />

          <h3 className="text-base font-bold text-[#111111] mb-3">예방 가이드</h3>
          <p className="text-sm font-semibold text-[#696969] leading-relaxed">
            {result.caution.prevention}
          </p>
        </WhiteBox>

        {/* Total Analysis */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-4">종합 분석</h3>
          <p className="text-sm font-semibold text-[#696969] leading-relaxed">
            {result.total}
          </p>
        </WhiteBox>

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}