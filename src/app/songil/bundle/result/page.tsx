'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
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

type BundleResult = {
  hand: string;
  life: LineData;
  emotion: LineData;
  destiny: LineData;
  bundleAnalysis?: string;
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
const HAND_IMAGES: Record<string, StaticImageData> = {
  dragon: dragonHand,
  phoenix: phoenixHand,
  snake: snakeHand,
  monkey: monkeyHand,
  buddha: buddhaHand,
  tiger: tigerHand,
};

// 손금 라인 이미지 매핑
const LINE_IMAGES: Record<string, StaticImageData> = {
  life: lifeLineImage,
  emotion: emotionLineImage,
  destiny: destinyLineImage,
  intelligence: intelligenceLineImage,
};

// 재사용 컴포넌트
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

const ScoreRow = ({ label, score }: { label: string; score: string }) => {
  const scoreNum = parseInt(score, 10) || 0;

  return (
    <div className="mb-3 flex items-center gap-2 last:mb-0">
      <div className="w-[60px] shrink-0 text-xs font-semibold text-[#696969]">
        {label}
      </div>
      <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#E3E3E6]">
        <div
          className="h-full rounded-full bg-[#F97B68] transition-all duration-1000 ease-out"
          style={{ width: `${scoreNum}%` }}
        />
      </div>
      <div className="w-[30px] text-right text-xs font-semibold text-[#696969]">
        {scoreNum}%
      </div>
    </div>
  );
};

const LineDetailSection = ({
  iconPath,
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
      <div className="mx-auto my-6 h-[2px] w-full bg-[#F5F6F8]" />

      <div className="mb-4 flex flex-col items-center text-center">
        <div className="mb-4 flex h-[115px] w-[115px] items-center justify-center overflow-hidden">
          {lineImage ? (
            <Image
              src={lineImage}
              alt={iconPath}
              width={115}
              height={115}
              className="object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">{iconPath} Image</span>
          )}
        </div>

        <h3 className="mb-1 text-lg font-bold text-[#111111]">{title}</h3>
        <p className="text-sm font-semibold text-[#696969]">{data.summary}</p>
      </div>

      <div className="space-y-2 px-2">
        {data.description.map((desc, idx) => (
          <p
            key={idx}
            className="text-sm leading-[1.6] font-semibold text-[#696969]"
          >
            • {desc}
          </p>
        ))}
      </div>
    </div>
  );
};

export default function BundleResultPage() {
  const [result] = useState<BundleResult | null>(() => {
    if (typeof window === 'undefined') return null;

    const savedResult = localStorage.getItem('bundle_result');
    if (!savedResult) return null;

    try {
      const parsedResult = JSON.parse(savedResult) as BundleResult;

      if (parsedResult.error) {
        console.error('Bundle result has error:', parsedResult.errorText);
      }

      return parsedResult;
    } catch (error) {
      console.error('Failed to parse bundle result:', error);
      return null;
    }
  });

  const [resultImageUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('bundle_image') || '';
  });

  // 결과가 없는 경우
  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3F1]">
        <div className="px-5 text-center">
          <div className="mb-4 text-lg font-semibold text-[#696969]">
            분석 결과를 찾을 수 없습니다.
          </div>
          <Link
            href="/songil/bundle"
            className="inline-block rounded-xl bg-[#F97B68] px-6 py-3 font-bold text-white"
          >
            다시 촬영하기
          </Link>
        </div>
      </div>
    );
  }

  const handInfo = HAND_INFO[result.hand] || HAND_INFO['dragon'];

  return (
    <div className="relative min-h-screen bg-[#F5F3F1] pb-[120px]">
      {/* 헤더 (뒤로가기) */}
      <header className="sticky top-0 z-10 px-4 pt-4 pb-2">
        <Link href="/songil/bundle" className="-ml-2 inline-block p-2">
          <ChevronLeft className="h-6 w-6 text-[#696969]" />
        </Link>
      </header>

      <main className="px-5">
        {/* 타이틀 영역 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#F97B68]">손금 번들 결과</h2>
          <h1 className="text-2xl font-bold text-[#883A2E]">
            당신의 운명, 감정, 생명
          </h1>
        </div>

        {/* 손 타입 카드 */}
        <div className="relative mx-4 mb-8">
          <div className="flex flex-col items-center rounded-[50px] border-[3px] border-[#FCC1B9] bg-white p-8">
            <div className="relative mb-6 aspect-square w-full rounded-[50px]">
              <Image
                src={HAND_IMAGES[result['hand'] ?? 'dragon']}
                alt={result.hand}
                fill
                className="object-contain"
              />
            </div>

            <div className="mb-3 rounded-2xl bg-[#EA6653] px-6 py-2 text-lg font-bold text-white">
              {handInfo.title}
            </div>

            <p className="text-center text-base font-semibold text-[#F97B68]">
              {handInfo.subtitle}
            </p>
          </div>
        </div>

        {/* 손 타입 설명 박스 */}
        <WhiteBox className="mb-4">
          <h3 className="mb-4 text-lg font-bold text-[#111111]">
            {handInfo.title} 특징
          </h3>
          <div className="space-y-2">
            {handInfo.description.map((desc, idx) => (
              <p
                key={idx}
                className="text-sm leading-[1.8] font-semibold text-[#696969]"
              >
                • {desc}
              </p>
            ))}
          </div>
        </WhiteBox>

        {/* 번들 분석 점수 박스 */}
        <WhiteBox className="mb-4">
          <h3 className="mb-6 text-lg font-bold text-[#111111]">
            번들 분석 - 3가지 선
          </h3>

          <div className="flex gap-5">
            {/* 왼쪽: 유저 손 이미지 */}
            <div className="relative h-[140px] w-[100px] shrink-0 overflow-hidden rounded-[20px] bg-gray-100">
              {resultImageUrl ? (
                <Image
                  src={resultImageUrl}
                  alt="User Hand"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* 오른쪽: 프로그레스 바 리스트 */}
            <div className="flex flex-1 flex-col justify-center">
              <ScoreRow label="생명선" score={result.life.score} />
              <ScoreRow label="감정선" score={result.emotion.score} />
              <ScoreRow label="운명선" score={result.destiny.score} />
            </div>
          </div>

          <div className="mt-6 rounded-[10px] bg-[#F5F6F8] p-3 text-center">
            <span className="text-xs font-semibold text-[#696969]">
              💡 번들 분석은 생명선, 감정선, 운명선의 3가지 선을 종합적으로
              분석합니다.
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
              iconPath="Destiny"
              title="운명선"
              data={result.destiny}
            />
          </div>
        </WhiteBox>

        {/* 번들 종합 분석 */}
        {result.bundleAnalysis && (
          <WhiteBox className="mb-4">
            <h3 className="mb-4 text-lg font-bold text-[#111111]">
              3가지 선의 조화로운 해석
            </h3>
            <p className="text-sm leading-[1.8] font-semibold whitespace-pre-line text-[#696969]">
              {result.bundleAnalysis}
            </p>
          </WhiteBox>
        )}

        <OtherContents />
      </main>

      <BottomFloating />
    </div>
  );
}
