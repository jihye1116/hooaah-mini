'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Share2, Download, RotateCcw } from 'lucide-react';
import contentPair from '@/assets/images/imokgubi/content_pair.png';
import pairGood from '@/assets/images/imokgubi/pair_good.png';
import pairAverage from '@/assets/images/imokgubi/pair_average.png';
import pairMild from '@/assets/images/imokgubi/pair_mild.png';
import pairDifferent from '@/assets/images/imokgubi/pair_different.png';
import BottomButton from '@/components/BottomButton';

// --- Type Definitions (JSON 구조에 맞춤) ---
export interface PairResultData {
  harmony: {
    score: number;
    title: string;
    subtitle: string;
  };
  analysis: {
    overall: string;
    myAnalysis: string[];
    yourAnalysis: string[];
    harmony: string;
    style: string;
  };
  elements: {
    eye: number;
    nose: number;
    mouth: number;
    description: string;
  };
  personality: {
    overall: string;
    myPersonality: string;
    yourPersonality: string;
    description: string;
  };
  total: {
    score: number;
    description: string;
    advice: string;
  };
  error: boolean;
  errorText: string;
}

interface PairResultProps {
  result: PairResultData;
  resultImage: string;
  onBack: () => void;
}

export default function PairResultScreen({
  result,
  resultImage,
  onBack,
}: PairResultProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const yourImage = searchParams.get('resultImage2');

  if (!yourImage) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F6F8]">
        결과를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-[#F5F6F8]/90 px-5 py-4 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft className="h-5 w-5 text-[#54575D]" />
        </button>
      </div>

      <div className="px-5">
        {/* Subtitle */}
        <p className="mb-1 text-center text-sm font-semibold text-[#7A8CFF]">
          얼굴 궁합 분석 결과
        </p>

        {/* Score Card Section */}
        <ScoreCard harmony={result.harmony} />

        {/* 1. Overall Analysis & Face Comparison */}
        <WhiteBox className="mt-8">
          <h3 className="text-lg font-bold text-[#111111]">
            두 사람의 전체적인 조화
          </h3>
          <p className="mt-2 text-sm font-semibold text-[#6270CC]">
            {result.analysis.overall}
          </p>

          {/* User Images */}
          <div className="mt-6 flex justify-center gap-3">
            <div className="h-36 w-28 overflow-hidden rounded-xl bg-[#F3F4FF]">
              <Image
                src={resultImage}
                alt="Me"
                width={112}
                height={144}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-36 w-28 overflow-hidden rounded-xl bg-[#F3F4FF]">
              <Image
                src={yourImage}
                alt="You"
                width={112}
                height={144}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Detailed Analysis Lists */}
          <div className="mt-6 space-y-6">
            <div>
              <p className="mb-2 text-base font-bold text-[#54575D]">
                🔍 나의 얼굴 분석
              </p>
              <ul className="space-y-1">
                {result.analysis.myAnalysis.map((text, idx) => (
                  <li key={idx} className="text-sm font-light text-[#54575D]">
                    · {text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-base font-bold text-[#54575D]">
                🔍 상대방 얼굴 분석
              </p>
              <ul className="space-y-1">
                {result.analysis.yourAnalysis.map((text, idx) => (
                  <li key={idx} className="text-sm font-light text-[#54575D]">
                    · {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Analysis Fields */}
          {/* <div className="mt-6 space-y-3">
            <div className="rounded-lg bg-[#F3F4FF] p-4">
              <p className="text-sm font-bold text-[#6270CC]">궁합 특징</p>
              <p className="mt-1 text-sm text-[#54575D]">
                {result.analysis.harmony}
              </p>
            </div>
            <div className="rounded-lg bg-[#F3F4FF] p-4">
              <p className="text-sm font-bold text-[#6270CC]">관계 스타일</p>
              <p className="mt-1 text-sm text-[#54575D]">
                {result.analysis.style}
              </p>
            </div>
          </div> */}
        </WhiteBox>

        {/* 2. Partial Analysis (Progress Bars) */}
        <WhiteBox className="mt-8">
          <h3 className="mb-6 text-lg font-bold text-[#111111]">
            이목구비 궁합 매칭
          </h3>

          <ProgressBar label="눈매 조화" percent={result.elements.eye} />
          <ProgressBar label="코의 균형" percent={result.elements.nose} />
          <ProgressBar label="입매 상성" percent={result.elements.mouth} />

          <p className="mt-6 text-center text-sm text-[#54575D]">
            {result.elements.description}
          </p>
        </WhiteBox>

        {/* 3. Personality Synergy */}
        <WhiteBox className="mt-8">
          <h3 className="text-lg font-bold text-[#111111]">성격 시너지</h3>
          <p className="mt-1 text-sm font-semibold text-[#6270CC]">
            {result.personality.overall}
          </p>
          <div className="mt-6 space-y-4">
            <PersonalityRow
              label="나"
              text={result.personality.myPersonality}
            />
            <PersonalityRow
              label="상대"
              text={result.personality.yourPersonality}
            />
          </div>
          <p className="mt-4 text-sm text-[#54575D]">
            {result.personality.description}
          </p>
        </WhiteBox>

        {/* 4. Total Score & Advice */}
        <WhiteBox className="mt-8 mb-8">
          <h3 className="text-lg font-bold text-[#111111]">최종 매칭률</h3>
          <p className="mt-2 text-xl font-bold text-[#6270CC]">
            {result.total.score}%
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-[#54575D]">{result.total.description}</p>
            <p className="text-sm text-[#54575D]">{result.total.advice}</p>
          </div>
        </WhiteBox>
      </div>

      {/* Bottom Floating Bar */}
      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[480px] border-t border-gray-100 bg-white pt-4">
        {/* pb-safe는 iOS 하단 영역 대응 (Tailwind 플러그인 필요할 수 있음, 없으면 pb-8 등 사용) */}
        <BottomButton onClick={() => router.back()} />
      </div>
    </div>
  );
}

// --- Sub Components ---

// 1. White Box Container
function WhiteBox({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white p-6 ${className}`}>{children}</div>
  );
}

// 2. Score Card (Uses data from API response)
function ScoreCard({
  harmony,
}: {
  harmony: { score: number; title: string; subtitle: string };
}) {
  // 점수에 따라 이미지 선택
  let pairImage;

  if (harmony.score >= 90) {
    pairImage = contentPair;
  } else if (harmony.score >= 75) {
    pairImage = pairGood;
  } else if (harmony.score >= 50) {
    pairImage = pairAverage;
  } else if (harmony.score >= 30) {
    pairImage = pairMild;
  } else {
    pairImage = pairDifferent;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-center text-2xl font-extrabold text-[#313866]">
        {harmony.title}
      </h2>
      <div className="mt-6 inline-flex flex-col items-center rounded-[20px] border border-[#E4E8FF] bg-gradient-to-br from-white to-[#F3F4FF] px-8 py-8">
        {/* Pair Image */}
        <div className="mb-4 h-[150px] w-[150px]">
          <Image
            src={pairImage}
            alt="궁합 이미지"
            width={150}
            height={150}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[#313866]">
            {harmony.score}
          </span>
          <span className="text-2xl font-bold text-[#54575D]">%</span>
        </div>
        <p className="mt-2 text-center text-base font-semibold text-[#6270CC]">
          {harmony.subtitle}
        </p>
      </div>
    </div>
  );
}

// 3. Progress Bar Component
function ProgressBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="mb-4 flex items-center last:mb-0">
      <span className="w-16 text-[13px] font-bold text-[#54575D]">{label}</span>
      <div className="mx-4 flex-1">
        <div className="h-2 w-full rounded-full bg-[#54575D]/20">
          <div
            className="h-2 rounded-full bg-[#7A8CFF] transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-right text-[13px] text-[#54575D]">
        {percent}%
      </span>
    </div>
  );
}

// 4. Personality Row
function PersonalityRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#95A3FF]" />
      <p className="text-sm text-[#54575D]">
        <span className="font-bold">{label}</span> : {text}
      </p>
    </div>
  );
}
