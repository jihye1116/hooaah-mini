'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OtherContents from '@/app/songil/components/OtherContents';
import TableOfContents from './TableOfContents';

// Components
import FundamentalSection from './components/FundamentalSection';
import PersonalitySection from './components/PersonalitySection';
import ChronologySection from './components/ChronologySection';
import RiskSection from './components/RiskSection';
import ChanceSection from './components/ChanceSection';
import PresentSection from './components/PresentSection';
import WhiteBox, { PointList, SectionTitle } from './components/WhiteBox';
import StepIndicator from './components/StepIndicator';
import BottomNavigation from './components/BottomNavigation';
import { BundleResult } from './types';
import { HAND_IMAGES } from './assets';

// --- Constants & Mappings ---

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

const LINE_NAMES: Record<string, string> = {
  life: '생명선',
  emotion: '감정선',
  destiny: '운명선',
  intelligence: '지능선',
  marriage: '결혼선',
  sun: '태양선',
  wealth: '재물선',
};

// --- Main Page Component ---

export default function BundleResultPage() {
  // Navigation State
  // pageStep: 0 = TOC, 1 = Detail
  const [pageStep, setPageStep] = useState(0);
  // tabIndex: 0 = Hand Info, 1+ = Lines
  const [tabIndex, setTabIndex] = useState(0);
  // subPageIndex: 0 or 1 (for Lines)
  const [subPageIndex, setSubPageIndex] = useState(0);

  // Data State
  const [result, setResult] = useState<BundleResult | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string>('');

  useEffect(() => {
    // Client-side only logic
    const savedResult = localStorage.getItem('bundle_result');
    const savedImage = localStorage.getItem('bundle_image');

    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setTimeout(() => setResult(parsed), 0);
      } catch (e) {
        console.error('Failed to parse result', e);
      }
    }
    if (savedImage) {
      setTimeout(() => setResultImageUrl(savedImage), 0);
    }
  }, []);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3F1]">
        <div className="text-center text-[#696969]">
          <p>분석 결과를 불러오는 중...</p>
          <Link
            href="/songil/bundle"
            className="mt-4 inline-block rounded-xl bg-[#F97B68] px-6 py-3 font-bold text-white"
          >
            다시 촬영하기
          </Link>
        </div>
      </div>
    );
  }

  const handInfo = HAND_INFO[result.hand] || HAND_INFO['dragon'];
  const lineKeys = Object.keys(result.lines);
  const currentLineKey = tabIndex > 0 ? lineKeys[tabIndex - 1] : null;
  const currentLineData = currentLineKey ? result.lines[currentLineKey] : null;

  // Calculate Steps
  // Total Steps = 1 (Hand Info) + (Number of Lines * 2)
  const totalSteps = 1 + lineKeys.length * 2;
  
  // Current Step Calculation
  let currentStep = 1;
  if (tabIndex > 0) {
    currentStep = 1 + (tabIndex - 1) * 2 + subPageIndex + 1;
  }

  const pageTitle = tabIndex === 0 
    ? '손 모양 분석' 
    : `${LINE_NAMES[currentLineKey!] || currentLineKey} 정밀 분석`;

  // Hand Info Tab Content
  const renderHandInfo = () => (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col items-center rounded-[30px] border-[3px] border-[#FCC1B9] bg-white p-8">
        <div className="relative mb-6 aspect-square w-full max-w-[200px]">
          <Image
            src={HAND_IMAGES[result.hand] || HAND_IMAGES['dragon']}
            alt={result.hand}
            fill
            className="object-contain"
          />
        </div>
        <div className="mb-3 rounded-full bg-[#EA6653] px-6 py-2 text-lg font-bold text-white shadow-md">
          {handInfo.title}
        </div>
        <p className="text-center text-lg font-bold text-[#F97B68]">
          {handInfo.subtitle}
        </p>
      </div>

      <WhiteBox>
        <SectionTitle>{handInfo.title} 특징</SectionTitle>
        <PointList points={handInfo.description} />
      </WhiteBox>

      {result.bundleAnalysis && (
        <WhiteBox>
          <SectionTitle>종합 분석</SectionTitle>
          <p className="text-sm leading-relaxed font-medium whitespace-pre-line text-[#696969]">
            {result.bundleAnalysis}
          </p>
        </WhiteBox>
      )}
      <OtherContents />
    </div>
  );

  // Navigation Handlers
  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (tabIndex === 0) {
      // From Hand Info to First Line
      setTabIndex(1);
      setSubPageIndex(0);
    } else {
      // In Line Detail
      if (subPageIndex === 0) {
        // Go to next part of same line
        setSubPageIndex(1);
      } else {
        // End of current line
        if (tabIndex < lineKeys.length) {
          // Go to next line
          setTabIndex(tabIndex + 1);
          setSubPageIndex(0);
        } else {
          // End of all lines -> Go back to TOC or Finish
          setPageStep(0); // For now, go back to TOC
        }
      }
    }
  };

  const handlePrev = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabIndex === 0) {
      // From Hand Info back to TOC
      setPageStep(0);
    } else {
      // In Line Detail
      if (subPageIndex === 1) {
        // Go back to first part of same line
        setSubPageIndex(0);
      } else {
        // Start of current line -> Go back to previous line or Hand Info
        if (tabIndex === 1) {
          setTabIndex(0);
        } else {
          setTabIndex(tabIndex - 1);
          setSubPageIndex(1); // Go to last part of previous line
        }
      }
    }
  };

  // --- Main Render ---
  if (pageStep === 0) {
    // 목차(TOC) 페이지
    return (
      <TableOfContents
        lineKeys={lineKeys}
        lineNames={LINE_NAMES}
        onSelect={(idx) => {
          setTabIndex(idx);
          setSubPageIndex(0);
          setPageStep(1);
        }}
      />
    );
  }

  // 디테일 페이지
  return (
    <div className="min-h-screen bg-[#F5F3F1]">
      {/* Step Indicator Header */}
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        title={pageTitle} 
      />

      <main className="px-5 pt-[120px] pb-[160px]">
        {tabIndex === 0
          ? renderHandInfo()
          : currentLineData && (
              <>
                {/* Content Pages */}
                {subPageIndex === 0 ? (
                  <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
                    <FundamentalSection
                      data={currentLineData.primitive}
                      lineName={LINE_NAMES[currentLineKey!] || currentLineKey!}
                      lineKey={currentLineKey!}
                      resultImageUrl={resultImageUrl}
                    />
                    <PersonalitySection
                      data={currentLineData.personality}
                      lineName={LINE_NAMES[currentLineKey!] || currentLineKey!}
                    />
                    <ChronologySection
                      data={currentLineData.flow}
                      age={result.age || 25}
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
                    <RiskSection
                      data={currentLineData.risk}
                      age={result.age || 25}
                    />
                    <ChanceSection
                      data={currentLineData.chance}
                      age={result.age || 25}
                    />
                    <PresentSection
                      data={currentLineData.present}
                      age={result.age || 25}
                      total={currentLineData.total}
                    />
                  </div>
                )}
              </>
            )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        onPrev={handlePrev}
        onNext={handleNext}
        nextLabel={
          tabIndex === 0 
            ? '다음' 
            : subPageIndex === 0 
              ? '다음' 
              : tabIndex < lineKeys.length 
                ? '다음 손금' 
                : '분석 완료'
        }
      />
    </div>
  );
}
