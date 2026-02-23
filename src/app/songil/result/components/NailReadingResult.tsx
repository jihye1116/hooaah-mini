'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { ChevronLeft } from 'lucide-react';
import BottomFloating from '@/app/songil/components/BottomFloating';
import OtherContents from '@/app/songil/components/OtherContents';

// Nail Images
import cubicImg from '@/assets/images/songil/nail/cubic.png';
import frenchImg from '@/assets/images/songil/nail/french.png';
import glitterImg from '@/assets/images/songil/nail/glitter.png';
import gradientImg from '@/assets/images/songil/nail/gradient.png';
import marbleImg from '@/assets/images/songil/nail/marble.png';
import matteImg from '@/assets/images/songil/nail/matte.png';
import solidImg from '@/assets/images/songil/nail/solid.png';

type ColorRecommendation = {
  color: string;
  description: string;
};

type StyleRecommendation = {
  look: string;
  description: string;
};

type NailReadingResultData = {
  type: string;
  description: string;
  color: {
    personal: string;
    good: ColorRecommendation[];
    bad: ColorRecommendation[];
    point: string[];
  };
  length: {
    type: string;
    point: string[];
  };
  style: StyleRecommendation[];
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

// Map for personal colors
const PERSONAL_COLORS: Record<string, { title: string; colors: string[] }> = {
  spring: {
    title: '봄웜',
    colors: ['#FCE883', '#FFA07A', '#8DB600'],
  },
  summer: {
    title: '여름쿨',
    colors: ['#E0BBE4', '#A2CFFE', '#4B5D67'],
  },
  autumn: {
    title: '가을웜',
    colors: ['#E1944D', '#8B291A', '#FF7518'],
  },
  winter: {
    title: '겨울쿨',
    colors: ['#708090', '#1B8DFF', '#36454F'],
  },
};

const NAIL_TYPE_IMAGES: Record<string, StaticImageData> = {
  // English keys
  cubic: cubicImg,
  french: frenchImg,
  glitter: glitterImg,
  gradient: gradientImg,
  marble: marbleImg,
  matte: matteImg,
  solid: solidImg,
  // Korean keys
  큐빅: cubicImg,
  프렌치: frenchImg,
  글리터: glitterImg,
  그라데이션: gradientImg,
  마블: marbleImg,
  매트: matteImg,
  풀컬러: solidImg,
  솔리드: solidImg,
};

const NAIL_TYPE_MAP: Record<string, string> = {
  gradient: '그라데이션',
  cubic: '큐빅',
  french: '프렌치',
  marble: '마블',
  glitter: '글리터',
  matte: '매트',
  solid: '솔리드',
};

const NAIL_LENGTH_MAP: Record<string, string> = {
  short: '숏네일',
  medium: '미디엄 네일',
  long: '롱네일',
};

export default function NailReadingResult() {
  const [result] = useState<NailReadingResultData | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedResult = localStorage.getItem('palmistry_result');
    if (!savedResult) return null;
    try {
      return JSON.parse(savedResult) as NailReadingResultData;
    } catch (e) {
      console.error('Failed to parse nail result', e);
      return null;
    }
  });

  if (!result || result.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3F1]">
        <div className="px-5 text-center">
          <p className="mb-4 text-[#696969]">
            {result?.errorText || '분석 결과를 불러올 수 없습니다.'}
          </p>
          <Link
            href="/songil?contents=nailReading"
            className="inline-block rounded-xl bg-[#F97B68] px-6 py-3 font-bold text-white"
          >
            다시 시도하기
          </Link>
        </div>
      </div>
    );
  }

  // Fallback if personal color is not found in map
  const pColor = PERSONAL_COLORS[result.color.personal] || {
    // const pColor = PERSONAL_COLORS["summer"] || {
    title: result.color.personal,
    colors: ['#ccc', '#ddd', '#eee'],
  };

  const nailImage =
    NAIL_TYPE_IMAGES[result.type] ||
    NAIL_TYPE_IMAGES[result.type.toLowerCase()];

  const displayType = NAIL_TYPE_MAP[result.type.toLowerCase()] || result.type;
  const displayLength =
    NAIL_LENGTH_MAP[result.length.type.toLowerCase()] || result.length.type;

  return (
    <div className="relative min-h-screen bg-[#F5F3F1] pb-[120px]">
      <header className="sticky top-0 z-10 px-4 pt-4 pb-2">
        <Link href="/songil" className="-ml-2 inline-block p-2">
          <ChevronLeft className="h-6 w-6 text-[#696969]" />
        </Link>
      </header>

      <main className="px-5">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-lg font-bold text-[#F97B68]">
            나의 네일은?
          </h2>
          <h1 className="px-8 text-2xl font-bold break-keep text-[#883A2E]">
            {displayType} 네일
          </h1>
        </div>

        {/* Nail Type Image Placeholder */}
        <div className="mb-6 flex justify-center">
          {nailImage ? (
            <Image
              src={nailImage}
              alt={`${displayType} 네일`}
              width={220}
              height={250}
              className="h-[250px] w-auto rounded-xl object-contain"
              priority
            />
          ) : (
            <div className="flex h-[250px] w-[220px] items-center justify-center rounded-xl bg-gray-200 text-gray-400">
              {displayType} Image
            </div>
          )}
        </div>

        <WhiteBox className="mb-8 text-center">
          <p className="text-sm leading-relaxed font-semibold text-[#696969]">
            {result.description}
          </p>
        </WhiteBox>

        {/* Personal Color */}
        <WhiteBox className="mb-4">
          <h3 className="mb-6 text-lg font-bold text-[#111111]">퍼스널 컬러</h3>

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

          <div className="my-6 border-t border-[#F5F6F8]" />

          <h3 className="mb-4 text-base font-bold text-[#111111]">
            네일에 어울리는 색상은?
          </h3>
          <div className="space-y-4">
            {result.color.good.map((c, idx) => (
              <div key={idx}>
                <div className="mb-2 inline-block rounded-[10px] bg-[#FCC1B9] px-3 py-1.5">
                  <span className="text-sm font-bold text-[#883A2E]">
                    {c.color}
                  </span>
                </div>
                <p className="text-sm leading-relaxed font-semibold text-[#696969]">
                  {c.description}
                </p>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-[#F5F6F8]" />

          <h3 className="mb-4 text-base font-bold text-[#111111]">
            피해야 하는 색상은?
          </h3>
          <div className="mb-2 flex flex-wrap gap-2">
            {result.color.bad.map((c, idx) => (
              <div
                key={idx}
                className="inline-block rounded-[10px] bg-[#F5F6F8] px-3 py-1.5"
              >
                <span className="text-sm font-bold text-[#696969]">
                  {c.color}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed font-semibold text-[#696969]">
            {result.color.bad.map((c) => c.description).join(' ')}
          </p>
        </WhiteBox>

        {/* Length Match */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            어울리는 네일의 길이는?
          </h3>
          <div className="mb-4 inline-block rounded-[10px] bg-[#FCC1B9] px-3 py-1.5">
            <span className="text-sm font-bold text-[#883A2E]">
              {displayLength}
            </span>
          </div>
          <div className="space-y-2">
            {result.length.point.map((p, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed font-semibold text-[#696969]"
              >
                • {p}
              </p>
            ))}
          </div>
        </WhiteBox>

        {/* Recommended Style */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            추천 네일과 어울리는 스타일
          </h3>
          <div className="space-y-6">
            {result.style.map((s, idx) => (
              <div key={idx}>
                <h4 className="mb-2 text-base font-bold text-[#111111]">
                  {s.look}
                </h4>
                <p className="text-sm leading-relaxed font-semibold text-[#696969]">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </WhiteBox>

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}
