'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import BottomFloating from '@/app/songil/components/BottomFloating';
import OtherContents from '@/app/songil/components/OtherContents';

type FingerSize = {
  ks: string;
  length: string;
  width: string;
};

type FingerData = {
  jewel: string;
  size: FingerSize;
  rings: string[];
  description: string;
};

type RingReadingResultData = {
  overall: {
    summary: string;
    size: string;
    point: string[];
    description: string;
  };
  color: {
    personal: string;
    point: string[];
  };
  thumb: FingerData;
  index: FingerData;
  middle: FingerData;
  ring: FingerData;
  pinky: FingerData;
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

const FingerSection = ({
  fingerName,
  data,
  imageName,
}: {
  fingerName: string;
  data: FingerData;
  imageName: string;
}) => (
  <div className="mb-8 last:mb-0">
    <div className="inline-block bg-[#FEF3F1] rounded-[10px] px-3 py-1.5 mb-2">
      <span className="text-sm font-bold text-[#883A2E]">{fingerName}</span>
    </div>
    <h4 className="text-base font-bold text-[#111111] mb-4">{data.jewel}</h4>

    <div className="flex justify-center items-center gap-6 mb-4">
      {/* Finger Image Placeholder */}
      <div className="w-[90px] h-[90px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
         {imageName}
      </div>

      <div className="bg-[#F5F6F8] rounded-xl py-3 px-6 text-center">
         <div className="text-base font-bold text-[#696969] mb-2">
            {data.size.ks}호
         </div>
         <div className="text-sm font-semibold text-[#696969]">
            길이 <span className="text-[#FF8431]">{data.size.length}cm</span>
         </div>
         <div className="text-sm font-semibold text-[#696969]">
            너비 <span className="text-[#547B55]">{data.size.width}cm</span>
         </div>
      </div>
    </div>

    <div className="space-y-1 mb-4">
       {data.rings.map((r, idx) => (
         <p key={idx} className="text-sm font-semibold text-[#696969]">
           • {r}
         </p>
       ))}
    </div>

    <p className="text-sm font-semibold text-[#696969] leading-relaxed">
       {data.description}
    </p>

    <div className="border-t border-[#F5F6F8] my-6" />
  </div>
);

export default function RingReadingResult() {
  const [result] = useState<RingReadingResultData | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedResult = localStorage.getItem('palmistry_result');
    if (!savedResult) return null;
    try {
      return JSON.parse(savedResult) as RingReadingResultData;
    } catch (e) {
      console.error('Failed to parse ring result', e);
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
            href="/songil?contents=ringReading"
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
        <div className="flex justify-between items-start gap-4 mb-6">
           <div className="flex-1">
              <div className="inline-block bg-[#FCC1B9] rounded-[10px] px-3 py-1.5 mb-2">
                <span className="text-sm font-bold text-[#883A2E]">
                  {result.color.personal || '퍼스널 컬러'}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#461008] mb-2 leading-tight">
                {result.overall.summary}
              </h1>
              <p className="text-sm font-semibold text-[#696969]">
                 총 손 길이 | {result.overall.size}cm
              </p>
           </div>
           
           <div className="w-[90px] h-[110px] bg-[#FAE5D7] rounded-[15px] overflow-hidden shrink-0">
             {resultImageUrl ? (
               <Image
                 src={resultImageUrl}
                 alt="Result Hand"
                 width={90}
                 height={110}
                 className="object-cover w-full h-full"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
             )}
           </div>
        </div>

        {/* Finger Character */}
        <WhiteBox className="mb-4">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#111111]">손가락 특징</h3>
              <span className="text-xs font-semibold text-[#B5B5B5]">중지 기준</span>
           </div>

           <div className="flex justify-center gap-6 items-center mb-6">
              {/* Overall Finger Image Placeholder */}
              <div className="w-[90px] h-[90px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                 Overall
              </div>

              <div className="bg-[#F5F6F8] rounded-xl py-3 px-6 text-center">
                 <div className="text-sm font-semibold text-[#696969]">
                    길이 <span className="text-[#FF8431]">{result.middle.size.length}cm</span>
                 </div>
                 <div className="text-sm font-semibold text-[#696969]">
                    너비 <span className="text-[#547B55]">{result.middle.size.width}cm</span>
                 </div>
              </div>
           </div>

           <div className="space-y-2 mb-4">
              {result.overall.point.map((p, idx) => (
                <p key={idx} className="text-sm font-semibold text-[#696969] leading-relaxed">
                  • {p}
                </p>
              ))}
           </div>
           
           <p className="text-sm font-semibold text-[#696969] leading-relaxed">
              {result.overall.description}
           </p>
        </WhiteBox>

        {/* Personal Color Detail */}
        <WhiteBox className="mb-4">
           <h3 className="text-lg font-bold text-[#111111] mb-6">손 퍼스널 컬러</h3>
           <div className="bg-[#F5F6F8] rounded-[10px] p-3 text-center mb-6 mx-auto w-fit min-w-[120px]">
              <span className="text-base font-bold text-[#111111]">
                 {result.color.personal}
              </span>
           </div>
           
           <div className="space-y-2">
              {result.color.point.map((p, idx) => (
                <p key={idx} className="text-sm font-semibold text-[#696969] leading-relaxed">
                  • {p}
                </p>
              ))}
           </div>
        </WhiteBox>

        {/* Finger Recommendations */}
        <WhiteBox className="mb-4">
           <h3 className="text-lg font-bold text-[#111111] mb-6">손가락별 추천 반지</h3>
           
           <FingerSection fingerName="엄지" data={result.thumb} imageName="Thumb" />
           <FingerSection fingerName="검지" data={result.index} imageName="Index" />
           <FingerSection fingerName="중지" data={result.middle} imageName="Middle" />
           <FingerSection fingerName="약지" data={result.ring} imageName="Ring" />
           <FingerSection fingerName="소지" data={result.pinky} imageName="Pinky" />

           <div className="bg-[#F5F6F8] rounded-xl p-3 text-center text-xs font-semibold text-[#696969]">
              ⚠️ 반지 호수는 측정 방법에 따라 오차가 있을 수 있습니다.
           </div>
        </WhiteBox>

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}