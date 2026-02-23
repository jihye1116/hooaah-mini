'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import BottomFloating from '@/app/songil/components/BottomFloating';
import OtherContents from '@/app/songil/components/OtherContents';

type ConditionScore = {
  score: number;
  description: string;
};

type SkincareSolution = {
  recommendation: string;
  description: string;
  products: string[];
};

type SkincareResultData = {
  initial: string;
  wrinkle: ConditionScore;
  pigmentation: ConditionScore;
  dryness: ConditionScore;
  nail: ConditionScore;
  solution: SkincareSolution;
  summary: string;
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
      <span className="w-16 text-sm font-semibold text-[#696969] shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-[#E3E3E6] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#F97B68] rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-[#696969] w-8 text-right">{value}%</span>
    </div>
  </div>
);

const ConditionDetail = ({ label, data }: { label: string; data: ConditionScore }) => (
  <div className="mb-6 last:mb-0">
     <h4 className="text-base font-bold text-[#111111] mb-2">{label}</h4>
     <p className="text-sm font-semibold text-[#696969] leading-relaxed">
       {data.description}
     </p>
  </div>
);

export default function SkincareResult() {
  const [result] = useState<SkincareResultData | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedResult = localStorage.getItem('palmistry_result');
    if (!savedResult) return null;
    try {
      return JSON.parse(savedResult) as SkincareResultData;
    } catch (e) {
      console.error('Failed to parse skincare result', e);
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
            href="/songil?contents=handSkinCare"
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
          <h2 className="text-lg font-bold text-[#F97B68]">손 스킨케어 진단</h2>
          <div className="mt-2 text-center px-8">
             <h1 className="text-2xl font-bold text-[#883A2E] break-keep">
              {result.initial}
            </h1>
          </div>
        </div>

        {/* Condition Scores */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-5">피부 상태 분석</h3>
          
          <div className="flex gap-4 items-start mb-6">
            <div className="flex-1">
              <ProgressBar label="주름" value={result.wrinkle.score} />
              <ProgressBar label="색소침착" value={result.pigmentation.score} />
              <ProgressBar label="건조함" value={result.dryness.score} />
              <ProgressBar label="손톱건강" value={result.nail.score} />
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
          
          <div className="border-t border-[#F5F6F8] my-6" />

          {/* Condition Details */}
          <ConditionDetail label="주름 상태" data={result.wrinkle} />
          <ConditionDetail label="색소 침착" data={result.pigmentation} />
          <ConditionDetail label="건조함" data={result.dryness} />
          <ConditionDetail label="손톱 건강" data={result.nail} />

        </WhiteBox>

        {/* Skincare Solution */}
        <WhiteBox className="mb-4">
           <h3 className="text-lg font-bold text-[#111111] mb-6">맞춤 관리 솔루션</h3>
           
           <div className="bg-[#F5F6F8] rounded-[10px] p-3 text-center mb-6">
             <span className="text-base font-bold text-[#111111]">
               {result.solution.recommendation}
             </span>
           </div>
           
           <p className="text-sm font-semibold text-[#696969] leading-relaxed mb-6">
              {result.solution.description}
           </p>

           <div className="border-t border-[#F5F6F8] my-6" />

           <h3 className="text-base font-bold text-[#111111] mb-4">추천 제품 성분</h3>
           <div className="space-y-2">
              {result.solution.products.map((p, idx) => (
                <p key={idx} className="text-sm font-semibold text-[#696969] leading-relaxed">
                  • {p}
                </p>
              ))}
           </div>
        </WhiteBox>

        {/* Total Analysis */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-4">종합 분석</h3>
          <p className="text-sm font-semibold text-[#696969] leading-relaxed">
            {result.summary}
          </p>
        </WhiteBox>

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}