'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import OtherContents from '../components/OtherContents';
import BottomFloating from '../components/BottomFloating';

type LineData = {
  score: number;
  summary: string;
  description: string[];
};

type PalmistryResult = {
  hand: string;
  life: LineData;
  intelligence: LineData;
  emotion: LineData;
  destiny: LineData;
};

// ----------------------------------------------------------------------
// 2. 더미 데이터 (Dummy Data)
// ----------------------------------------------------------------------

const DUMMY_RESULT: PalmistryResult = {
  hand: 'water', // water, fire, earth, air
  life: {
    score: 85,
    summary: '강한 생명력과 활력이 넘치는 타입입니다.',
    description: [
      '체력이 좋고 회복력이 빠릅니다.',
      '주변 사람들에게 긍정적인 에너지를 줍니다.',
      '새로운 환경에 적응하는 능력이 탁월합니다.',
    ],
  },
  intelligence: {
    score: 72,
    summary: '논리적이고 이성적인 판단을 중요시합니다.',
    description: [
      '문제를 해결할 때 감정보다 이성을 앞세웁니다.',
      '학구열이 높고 새로운 지식을 습득하는 것을 즐깁니다.',
    ],
  },
  emotion: {
    score: 90,
    summary: '풍부한 감수성과 공감 능력을 가졌습니다.',
    description: [
      '타인의 감정을 잘 이해하고 배려합니다.',
      '예술적인 감각이 뛰어나며 낭만적입니다.',
    ],
  },
  destiny: {
    score: 65,
    summary: '스스로 운명을 개척해 나가는 스타일입니다.',
    description: [
      '초년보다는 중년 이후에 안정을 찾습니다.',
      '목표를 향해 꾸준히 노력하는 끈기가 있습니다.',
    ],
  },
};

const HAND_INFO: Record<
  string,
  { title: string; subtitle: string; description: string[] }
> = {
  water: {
    title: '물의 손 (Water Hand)',
    subtitle: '감수성이 풍부하고 직관적인 예술가',
    description: [
      '손바닥이 길고 손가락도 긴 형태입니다.',
      '감정이 섬세하고 상상력이 풍부합니다.',
      '직관력이 뛰어나 사람의 마음을 잘 읽습니다.',
    ],
  },
  // 다른 손 타입 데이터 추가 가능
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
    className={`bg-white border-2 border-[#F5F6F8] rounded-[20px] p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

// 점수 프로그레스 바 (Result Image 옆 그래프)
const ScoreRow = ({ label, score }: { label: string; score: number }) => (
  <div className="flex items-center gap-2 mb-3 last:mb-0">
    <div className="w-[60px] text-xs font-semibold text-[#696969] shrink-0">
      {label}
    </div>
    <div className="flex-1 h-[10px] bg-[#E3E3E6] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#F97B68] rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${score}%` }}
      />
    </div>
    <div className="w-[30px] text-right text-xs font-semibold text-[#696969]">
      {score}%
    </div>
  </div>
);

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
  const [result] = useState<PalmistryResult>(DUMMY_RESULT);
  const handInfo = HAND_INFO[result.hand] || HAND_INFO['water'];

  // Flutter의 resultImage (업로드한 손 사진) 더미 URL
  const resultImageUrl = 'https://via.placeholder.com/150x200?text=User+Hand';

  return (
    <div className="min-h-screen bg-white pb-[120px] relative">
      {/* 헤더 (뒤로가기) */}
      <header className="pt-4 px-4 pb-2 sticky top-0 bg-white z-10">
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
          <div className="bg-white border-[3px] border-[#FCC1B9] rounded-[50px] p-8 shadow-[0_5px_0_0_#FCC1B9] flex flex-col items-center">
            {/* 손 타입 이미지 Placeholder */}
            <div className="w-full aspect-square bg-gray-100 rounded-[50px] overflow-hidden mb-6 relative">
              <Image
                src={`https://via.placeholder.com/400x400?text=${result.hand}`}
                alt={result.hand}
                fill
                className="object-cover"
              />
            </div>

            <div className="bg-[#EA6653] text-white px-6 py-2 rounded-2xl font-bold text-lg mb-3 shadow-sm">
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
              <Image
                src={resultImageUrl}
                alt="User Hand"
                fill
                className="object-cover"
              />
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

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}
