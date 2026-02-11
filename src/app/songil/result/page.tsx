'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import OtherContents from '@/app/songil/components/OtherContents';
import BottomFloating from '@/app/songil/components/BottomFloating';

// 손 이미지 import
import dragonHand from '@/assets/images/songil/hands/dragon.png';
import phoenixHand from '@/assets/images/songil/hands/phoenix.png';
import snakeHand from '@/assets/images/songil/hands/snake.png';
import monkeyHand from '@/assets/images/songil/hands/monkey.png';
import buddhaHand from '@/assets/images/songil/hands/buddha.png';
import tigerHand from '@/assets/images/songil/hands/tiger.png';

// 손금 라인 이미지 import
import lifeLineImage from '@/assets/images/songil/palmistry/life.png';
import emotionLineImage from '@/assets/images/songil/palmistry/emotion.png';
import destinyLineImage from '@/assets/images/songil/palmistry/destiny.png';
import intelligenceLineImage from '@/assets/images/songil/palmistry/intelligence.png';

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
  buddha: {
    title: '불수',
    subtitle: '마음씨 좋고 타인에게 베푸는 손',
    description: [
      '손바닥이 두툼하고 부드러우며 탄력 있음',
      '손끝이 둥글고 온화한 기운이 흐름',
      '손가락 마디가 적당히 굵고 길며 안정적',
      '피부색이 맑고 혈색이 좋아 보임',
      '덕이 많고 남을 돕는 성향, 복과 인덕이 큼',
    ],
  },
  dragon: {
    title: '용수',
    subtitle: '강한 에너지를 가지고 있는 손',
    description: [
      '손바닥이 넓고 강한 힘줄이 돋보임',
      '손가락이 굵고 단단하며 강인한 인상',
      '손목부터 손끝까지 기운이 힘차게 뻗어 있음',
      '손금이 깊고 선명하며 굵음',
      '권력과 리더십이 강하고, 사회적으로 성공할 가능성이 높음',
    ],
  },
  tiger: {
    title: '호수',
    subtitle: '강한 추진력을 가진 손',
    description: [
      '손바닥이 크고 두꺼우며 강한 느낌을 줌',
      '손가락이 짧고 굵으며 단단함',
      '손등이 발달하여 근육질처럼 보임',
      '손금이 선명하고 힘차게 뻗어 있음',
      '결단력과 추진력이 강하며, 도전 정신이 뛰어남',
    ],
  },
  phoenix: {
    title: '봉수',
    subtitle: '운과 재능이 많은 손',
    description: [
      '손가락이 길고 섬세하며 우아한 느낌',
      '손바닥이 얇고 피부가 부드러움',
      '손금이 유연하게 흐르며 자연스러움',
      '손톱이 길고 예쁘며 균형 잡힘',
      '예술적 감각과 창의성이 뛰어나며, 문화·음악·예술에 재능 있음',
    ],
  },
  snake: {
    title: '사수',
    subtitle: '냉철한 내면을 가진 손',
    description: [
      '손가락이 길고 마디가 뚜렷하게 보임',
      '손바닥이 얇고 건조한 느낌을 줌',
      '손등의 혈관과 힘줄이 선명하게 나타남',
      '손금이 복잡하게 얽혀 있는 경우가 많음',
      '지략과 계산력이 뛰어나며, 냉철하고 분석적인 성향',
    ],
  },
  monkey: {
    title: '유수',
    subtitle: '예술적 감각이 뛰어난 손',
    description: [
      '손가락이 가늘고 길며 유연함',
      '손바닥이 크지 않고 손가락 비율이 상대적으로 김',
      '손금이 다양하고 개성이 강하게 나타남',
      '손가락 마디가 부드러워 움직임이 빠름',
      '재치와 임기응변이 뛰어나며, 적응력이 강한 성향',
    ],
  },
};

// 손 이미지 매핑
const HAND_IMAGES: Record<string, any> = {
  dragon: dragonHand,
  phoenix: phoenixHand,
  snake: snakeHand,
  monkey: monkeyHand,
  buddha: buddhaHand,
  tiger: tigerHand,
};

// 손금 라인 이미지 매핑
const LINE_IMAGES: Record<string, any> = {
  life: lifeLineImage,
  emotion: emotionLineImage,
  destiny: destinyLineImage,
  intelligence: intelligenceLineImage,
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
}) => {
  const lineKey = iconPath.toLowerCase();
  const lineImage = LINE_IMAGES[lineKey];

  return (
    <div className="mb-8 last:mb-0">
      {/* 구분선 */}
      <div className="w-full h-[2px] bg-[#F5F6F8] my-6 mx-auto w-[90%]" />

      <div className="flex flex-col items-center text-center mb-4">
        {/* 손금 라인 이미지 */}
        <div className="w-[115px] h-[115px] flex items-center justify-center mb-4 overflow-hidden">
          {lineImage ? (
            <Image src={lineImage} alt={iconPath} width={115} height={115} className="object-cover" />
          ) : (
            <span className="text-gray-400 text-xs">{iconPath} Image</span>
          )}
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
};

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

  const handInfo = HAND_INFO[result.hand] || HAND_INFO['dragon'];

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
            <div className="w-full aspect-square rounded-[50px] mb-6 relative">
              <Image
                src={HAND_IMAGES[result["hand"] ?? "dragon"]}
                alt={result.hand}
                fill
                className="object-contain"
              />
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
