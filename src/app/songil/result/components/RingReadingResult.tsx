'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import BottomFloating from '@/app/songil/components/BottomFloating';
import OtherContents from '@/app/songil/components/OtherContents';
import { PERSONAL_COLORS } from '@/app/songil/result/constants/personalColors';

import ThumbImage from '@/assets/images/songil/ring/thumb.png';
import IndexImage from '@/assets/images/songil/ring/index.png';
import MiddleImage from '@/assets/images/songil/ring/middle.png';
import RingImage from '@/assets/images/songil/ring/ring.png';
import PinkyImage from '@/assets/images/songil/ring/pinky.png';
import OverallImage from '@/assets/images/songil/ring/overall.png';

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
  image,
}: {
  fingerName: string;
  data: FingerData;
  image: StaticImageData;
}) => (
  <div className="mb-8 last:mb-0">
    <div className="mb-2 inline-block rounded-[10px] bg-[#FEF3F1] px-3 py-1.5">
      <span className="text-sm font-bold text-[#883A2E]">{fingerName}</span>
    </div>
    <h4 className="mb-4 text-base font-bold text-[#111111]">{data.jewel}</h4>

    <div className="mb-4 flex items-center justify-center gap-6">
      {/* Finger Image */}
      <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={fingerName}
          width={90}
          height={90}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="rounded-xl bg-[#F5F6F8] px-8 py-3 text-center">
        <div className="mb-2 text-base font-bold text-[#696969]">
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

    <div className="mb-4 space-y-1">
      {data.rings.map((r, idx) => (
        <p key={idx} className="text-sm font-semibold text-[#696969]">
          • {r}
        </p>
      ))}
    </div>

    <p className="text-sm leading-relaxed font-semibold text-[#696969]">
      {data.description}
    </p>

    <div className="my-6 border-t border-[#F5F6F8]" />
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

  const pColor = PERSONAL_COLORS[result.color.personal] || {
    title: result.color.personal,
    colors: [],
  };

  return (
    <div className="relative min-h-screen bg-[#F5F3F1] pb-[120px]">
      <header className="sticky top-0 z-10 px-4 pt-4 pb-2">
        <Link href="/songil" className="-ml-2 inline-block p-2">
          <ChevronLeft className="h-6 w-6 text-[#696969]" />
        </Link>
      </header>

      <main className="px-5">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 inline-block rounded-[10px] bg-[#FCC1B9] px-3 py-1.5">
              <span className="text-sm font-bold text-[#883A2E]">
                {pColor.title}
              </span>
            </div>
            <h1 className="mb-2 text-xl leading-tight font-bold text-[#461008]">
              {result.overall.summary}
            </h1>
            <p className="text-sm font-semibold text-[#696969]">
              전체길이 | {result.overall.size}cm
            </p>
          </div>

          <div className="h-[110px] w-[90px] shrink-0 overflow-hidden rounded-[15px] bg-[#FAE5D7]">
            {resultImageUrl ? (
              <Image
                src={resultImageUrl}
                alt="Result Hand"
                width={90}
                height={110}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Finger Character */}
        <WhiteBox className="mb-4">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111]">
              나의 손가락 특징
            </h3>
            <span className="text-xs font-semibold text-[#B5B5B5]">
              가운데 손가락 기준
            </span>
          </div>

          <div className="mb-6 flex items-center justify-center gap-6">
            {/* Overall Finger Image */}
            <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <Image
                src={OverallImage}
                alt="Overall Finger"
                width={90}
                height={90}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="rounded-xl bg-[#F5F6F8] px-8 py-3 text-center">
              <div className="text-sm font-semibold text-[#696969]">
                길이{' '}
                <span className="text-[#FF8431]">
                  {result.middle.size.length}cm
                </span>
              </div>
              <div className="text-sm font-semibold text-[#696969]">
                너비{' '}
                <span className="text-[#547B55]">
                  {result.middle.size.width}cm
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            {result.overall.point.map((p, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed font-semibold text-[#696969]"
              >
                • {p}
              </p>
            ))}
          </div>

          <p className="text-sm leading-relaxed font-semibold text-[#696969]">
            {result.overall.description}
          </p>
        </WhiteBox>

        {/* Personal Color Detail */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">퍼스널 컬러</h3>
          <div className="mb-4 flex items-center justify-center">
            <div className="flex -space-x-6">
              {pColor.colors.map((c, i) => (
                <div
                  key={i}
                  className="h-16 w-16 rounded-full border-white"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="mx-auto mb-6 w-fit min-w-[120px] rounded-[10px] bg-[#F5F6F8] p-3 text-center">
            <span className="text-base font-bold text-[#111111]">
              {pColor.title}
            </span>
          </div>

          <div className="space-y-2">
            {result.color.point.map((p, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed font-semibold text-[#696969]"
              >
                • {p}
              </p>
            ))}
          </div>
        </WhiteBox>

        {/* Finger Recommendations */}
        <WhiteBox className="mb-4">
          <h3 className="mb-6 text-lg font-bold text-[#111111]">
            손가락별 추천 반지
          </h3>

          <FingerSection
            fingerName="엄지"
            data={result.thumb}
            image={ThumbImage}
          />
          <FingerSection
            fingerName="검지"
            data={result.index}
            image={IndexImage}
          />
          <FingerSection
            fingerName="중지"
            data={result.middle}
            image={MiddleImage}
          />
          <FingerSection
            fingerName="약지"
            data={result.ring}
            image={RingImage}
          />
          <FingerSection
            fingerName="소지"
            data={result.pinky}
            image={PinkyImage}
          />

          <div className="rounded-xl bg-[#F5F6F8] p-3 text-center text-xs font-semibold text-[#696969]">
            위 치수는 오차가 발생할 수 있습니다.
          </div>
        </WhiteBox>

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}
