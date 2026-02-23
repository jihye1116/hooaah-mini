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

const ProgressBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-4 last:mb-0">
    <div className="mb-1 flex items-center gap-2">
      <span className="w-16 shrink-0 text-sm font-semibold text-[#696969]">
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E3E3E6]">
        <div
          className="h-full rounded-full bg-[#F97B68]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-[#696969]">
        {value}%
      </span>
    </div>
  </div>
);

const ConditionDetail = ({
  label,
  data,
}: {
  label: string;
  data: ConditionScore;
}) => (
  <div className="mb-6 last:mb-0">
    <h4 className="mb-2 text-base font-bold text-[#111111]">{label}</h4>
    <p className="text-sm leading-relaxed font-semibold text-[#696969]">
      {data.description}
    </p>
  </div>
);

export default function SkincareResult() {
  const [result] = useState<SkincareResultData | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedResult = localStorage.getItem('skincare_result');
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
    return localStorage.getItem('skincare_image') || '';
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
          <h2 className="text-center font-bold text-[#F97B68]">
            나의 피부 분석
          </h2>
          <div className="mt-2 px-8 text-center">
            <h1 className="text-2xl font-bold break-keep text-[#883A2E]">
              {result.initial}
            </h1>
          </div>
        </div>

        {/* Condition Scores */}
        <WhiteBox className="mb-4">
          <h3 className="mb-5 text-lg font-bold text-[#111111]">
            피부 상태 분석
          </h3>

          <div className="mb-6 flex items-start gap-4">
            <div className="flex-1">
              <ProgressBar label="주름 심화" value={result.wrinkle.score} />
              <ProgressBar
                label="색소 침착"
                value={result.pigmentation.score}
              />
              <ProgressBar label="피부 건조" value={result.dryness.score} />
              <ProgressBar label="손톱 건강" value={result.nail.score} />
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

          <div className="my-6 border-t border-[#F5F6F8]" />

          {/* Condition Details */}
          <ConditionDetail label="주름 심화" data={result.wrinkle} />
          <ConditionDetail label="색소 침착" data={result.pigmentation} />
          <ConditionDetail label="피부 건조" data={result.dryness} />
          <ConditionDetail label="손톱 건강" data={result.nail} />
        </WhiteBox>

        {/* Skincare Solution */}
        <WhiteBox className="mb-4">
          <h3 className="mb-6 text-lg font-bold text-[#111111]">
            지금 제일 필요한 스킨케어는?
          </h3>

          <div className="mx-auto mb-6 w-fit rounded-[10px] bg-[#F5F6F8] p-3 text-center">
            <span className="text-base font-bold text-[#111111]">
              {result.solution.recommendation}
            </span>
          </div>

          <p className="mb-6 text-sm leading-relaxed font-semibold text-[#696969]">
            {result.solution.description}
          </p>

          <div className="my-6 border-t border-[#F5F6F8]" />

          <h3 className="mb-4 text-base font-bold text-[#111111]">
            추천하는 국내 스킨케어 제품
          </h3>
          <div className="space-y-2">
            {result.solution.products.map((p, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed font-semibold text-[#696969]"
              >
                • {p}
              </p>
            ))}
          </div>
        </WhiteBox>

        {/* Total Analysis */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            종합 분석 결과
          </h3>
          <p className="text-sm leading-relaxed font-semibold text-[#696969]">
            {result.summary}
          </p>
        </WhiteBox>

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}
