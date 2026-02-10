'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import OtherContents from '@/app/songil/components/OtherContents';
import BottomFloating from '@/app/songil/components/BottomFloating';

type LineData = {
  score: string;
  summary: string;
  description: string[];
};

type PalmistryResult = {
  hand: string;
  life: LineData;
  intelligence: LineData;
  emotion: LineData;
  destiny: LineData;
  total?: string;
  error: boolean;
  errorText: string;
};

const HAND_INFO: Record<
  string,
  { title: string; subtitle: string; description: string[] }
> = {
  dragon: {
    title: '용의 손 (Dragon Hand)',
    subtitle: '강인하고 추진력 있는 리더',
    description: [
      '손바닥이 넓고 손가락이 힘찬 형태입니다.',
      '목표 지향적이고 야심이 있습니다.',
      '리더십이 뛰어나 사람들을 이끄는 능력이 있습니다.',
    ],
  },
  water: {
    title: '물의 손 (Water Hand)',
    subtitle: '감수성이 풍부하고 직관적인 예술가',
    description: [
      '손바닥이 길고 손가락도 긴 형태입니다.',
      '감정이 섬세하고 상상력이 풍부합니다.',
      '직관력이 뛰어나 사람의 마음을 잘 읽습니다.',
    ],
  },
  fire: {
    title: '불의 손 (Fire Hand)',
    subtitle: '열정적이고 활동적인 모험가',
    description: [
      '손바닥이 짧고 손가락이 짧은 형태입니다.',
      '열정적이고 활동적인 성격입니다.',
      '모험을 즐기고 변화를 두려워하지 않습니다.',
    ],
  },
  earth: {
    title: '땅의 손 (Earth Hand)',
    subtitle: '현실적이고 안정적인 실천가',
    description: [
      '손바닥이 넓고 네모진 형태입니다.',
      '현실적이고 실용적인 사고를 합니다.',
      '안정성을 추구하며 신뢰할 수 있는 성격입니다.',
    ],
  },
  air: {
    title: '바람의 손 (Air Hand)',
    subtitle: '지적이고 소통 능력이 뛰어난 사교가',
    description: [
      '손바닥이 정사각형이고 손가락이 긴 형태입니다.',
      '지적 호기심이 많고 소통을 중요시합니다.',
      '분석적이고 논리적인 사고를 합니다.',
    ],
  },
};

// ----------------------------------------------------------------------
// 3. 재사용 컴포넌트 (Components)
// ----------------------------------------------------------------------

// 흰색 박스 컨테이너 (WhiteBoxBorder 대응)
const WhiteBox = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white border-2 border-[#F5F6F8] rounded-[20px] p-6 ${className}`}
  >
    {children}
  </div>
);

// 점수 프로그레스 바 (Result Image 옆 그래프)
const ScoreRow = ({ label, score }: { label: string; score: string }) => {
  const scoreNum = parseInt(score, 10) || 0;

  return (
    <div className="flex items-center gap-2 mb-3 last:mb-0">
      <div className="w-[60px] text-xs font-semibold text-[#696969] shrink-0">
        {label}
      </div>
      <div className="flex-1 h-[10px] bg-[#E3E3E6] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F97B68] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${scoreNum}%` }}
        />
      </div>
      <div className="w-[30px] text-right text-xs font-semibold text-[#696969]">
        {scoreNum}%
      </div>
    </div>
  );
};

// 상세 설명 섹션 (아이콘 + 제목 + 요약 + 리스트)
const LineDetailSection = ({
  iconPath, // 실제로는 이미지 경로
  title,
  data,
}: {
  iconPath: string;
  title: string;
  data: LineData;
}) => (
  <div className="mb-8 last:mb-0">
    {/* 구분선 */}
    <div className="w-full h-[2px] bg-[#F5F6F8] my-6 mx-auto w-[90%]" />

    <div className="flex flex-col items-center text-center mb-4">
      {/* 아이콘 Placeholder */}
      <div className="w-[115px] h-[115px] bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 text-xs">
        {iconPath} Image
      </div>

      <h3 className="text-lg font-bold text-[#111111] mb-1">{title}</h3>
      <p className="text-sm font-semibold text-[#696969]">{data.summary}</p>
    </div>

    <div className="space-y-2 px-2">
      {data.description.map((desc, idx) => (
        <p
          key={idx}
          className="text-sm font-semibold text-[#696969] leading-[1.6]"
        >
          • {desc}
        </p>
      ))}
    </div>
  </div>
);

// ----------------------------------------------------------------------
// 4. 메인 페이지 (Page)
// ----------------------------------------------------------------------

export default function PalmistryResultPage() {
  // localStorage에서 초기 데이터 로드 (lazy initialization)
  const [result] = useState<PalmistryResult | null>(() => {
    if (typeof window === 'undefined') return null;

    const savedResult = localStorage.getItem('palmistry_result');
    if (!savedResult) return null;

    try {
      const parsedResult = JSON.parse(savedResult) as PalmistryResult;

      // 에러 체크
      if (parsedResult.error) {
        console.error('Palmistry result has error:', parsedResult.errorText);
      }

      return parsedResult;
    } catch (error) {
      console.error('Failed to parse palmistry result:', error);
      return null;
    }
  });

  const [resultImageUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('palmistry_image') || '';
  });

  // 결과가 없는 경우
  if (!result) {
    return (
      <div className="min-h-screen bg-[#F5F3F1] flex items-center justify-center">
        <div className="text-center px-5">
          <div className="text-lg font-semibold text-[#696969] mb-4">
            분석 결과를 찾을 수 없습니다.
          </div>
          <Link
            href="/songil"
            className="inline-block px-6 py-3 bg-[#F97B68] text-white rounded-xl font-bold"
          >
            다시 촬영하기
          </Link>
        </div>
      </div>
    );
  }

  const handInfo = HAND_INFO[result.hand] || HAND_INFO['water'];

  return (
    <div className="min-h-screen bg-[#F5F3F1] pb-[120px] relative">
      {/* 헤더 (뒤로가기) */}
      <header className="pt-4 px-4 pb-2 sticky top-0  z-10">
        <Link href="/songil" className="inline-block p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-[#696969]" />
        </Link>
      </header>

      <main className="px-5">
        {/* 타이틀 영역 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#F97B68]">손금 결과</h2>
          <h1 className="text-2xl font-bold text-[#883A2E]">
            당신의 손금 분석
          </h1>
        </div>

        {/* 손 타입 카드 (Main Card) */}
        <div className="mx-4 mb-8 relative">
          <div className="bg-white border-[3px] border-[#FCC1B9] rounded-[50px] p-8 flex flex-col items-center">
            {/* 손 타입 이미지 Placeholder */}
            <div className="w-full aspect-square bg-gray-100 rounded-[50px] overflow-hidden mb-6 relative">
              {/* <Image
                src={`https://via.placeholder.com/400x400?text=${result.hand}`}
                alt={result.hand}
                fill
                className="object-cover"
              /> */}
            </div>

            <div className="bg-[#EA6653] text-white px-6 py-2 rounded-2xl font-bold text-lg mb-3 ">
              {handInfo.title}
            </div>

            <p className="text-[#F97B68] font-semibold text-base text-center">
              {handInfo.subtitle}
            </p>
          </div>
        </div>

        {/* 손 타입 설명 박스 */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-4">
            {handInfo.title} 특징
          </h3>
          <div className="space-y-2">
            {handInfo.description.map((desc, idx) => (
              <p
                key={idx}
                className="text-sm font-semibold text-[#696969] leading-[1.8]"
              >
                • {desc}
              </p>
            ))}
          </div>
        </WhiteBox>

        {/* 라인 분석 점수 박스 */}
        <WhiteBox className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] mb-6">
            주요 손금 분석
          </h3>

          <div className="flex gap-5">
            {/* 왼쪽: 유저 손 이미지 */}
            <div className="w-[100px] h-[140px] rounded-[20px] overflow-hidden bg-gray-100 shrink-0 relative">
              {resultImageUrl ? (
                <Image
                  src={resultImageUrl}
                  alt="User Hand"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* 오른쪽: 프로그레스 바 리스트 */}
            <div className="flex-1 flex flex-col justify-center">
              <ScoreRow label="생명선" score={result.life.score} />
              <ScoreRow label="지능선" score={result.intelligence.score} />
              <ScoreRow label="감정선" score={result.emotion.score} />
              <ScoreRow label="운명선" score={result.destiny.score} />
            </div>
          </div>

          <div className="mt-6 p-3 bg-[#F5F6F8] rounded-[10px] text-center">
            <span className="text-xs font-semibold text-[#696969]">
              💡 손금 데이터는 AI 분석을 기반으로 합니다.
            </span>
          </div>

          {/* 각 손금 상세 설명 */}
          <div className="mt-2">
            <LineDetailSection
              iconPath="Life"
              title="생명선"
              data={result.life}
            />
            <LineDetailSection
              iconPath="Emotion"
              title="감정선"
              data={result.emotion}
            />
            <LineDetailSection
              iconPath="Intelligence"
              title="지능선"
              data={result.intelligence}
            />
            <LineDetailSection
              iconPath="Destiny"
              title="운명선"
              data={result.destiny}
            />
          </div>
        </WhiteBox>

        {/* 종합 분석 결과 */}
        {result.total && (
          <WhiteBox className="mb-4">
            <h3 className="text-lg font-bold text-[#111111] mb-4">종합 분석</h3>
            <p className="text-sm font-semibold text-[#696969] leading-[1.8] whitespace-pre-line">
              {result.total}
            </p>
          </WhiteBox>
        )}

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}
