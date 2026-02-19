'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import StepHeader from './components/StepHeader';
import BottomNavigation from './components/BottomNavigation';
import TopHeader from './components/TopHeader';
import { BundleResult } from './types';

// --- Constants & Mappings ---

const LINE_NAMES: Record<string, string> = {
  life: '생명선',
  emotion: '감정선',
  destiny: '운명선',
  intelligence: '지능선',
  marriage: '결혼선',
  sun: '태양선',
  wealth: '재물선',
};

// --- Step Configuration System ---

interface Step {
  id: string;
  stepTitle: string; // e.g., "Step 01"
  headerTitle: string; // Title for TopHeader
  mainTitle: string; // e.g., "손 모양 분석", "생명선: 위험 요소 점검"
  buttonLabel: string; // Label for the button pointing TO this step
  render: (data: null) => React.ReactNode;
}

// --- Main Page Component ---

export default function BundleResultPage() {
  // Navigation State
  // mode: 'toc' = Table of Contents, 'detail' = Step View
  const [mode, setMode] = useState<'toc' | 'detail'>('toc');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  // --- Step Generation Logic ---
  const steps = useMemo<Step[]>(() => {
    if (!result) return [];

    const generatedSteps: Step[] = [];

    // 2. Line Analysis Steps
    const lineKeys = Object.keys(result.lines);

    lineKeys.forEach((key) => {
      const lineName = LINE_NAMES[key] || key;
      const lineData = result.lines[key];

      // Page 1: Steps 1-3 (Basic Info, Personality, Chronology)
      generatedSteps.push({
        id: `${key}-page1`,
        stepTitle: 'PART 1',
        headerTitle: lineName,
        mainTitle: `${lineName} 분석 (1/2)`,
        buttonLabel: `${lineName} 1`,
        render: () => (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
            {/* Step 1 */}
            <StepHeader step="STEP 01" title="기본 정보 분석" />
            <FundamentalSection
              data={lineData.primitive}
              lineName={lineName}
              lineKey={key}
              resultImageUrl={resultImageUrl}
            />

            {/* Step 2 */}
            <StepHeader step="STEP 02" title="성향 분석" />
            <PersonalitySection
              data={lineData.personality}
              lineName={lineName}
            />

            {/* Step 3 */}
            <StepHeader step="STEP 03" title="시기별 운명 흐름" />
            <ChronologySection data={lineData.flow} age={result.age || 25} />
          </div>
        ),
      });

      // Page 2: Steps 4-6 (Risk, Chance, Present)
      generatedSteps.push({
        id: `${key}-page2`,
        stepTitle: 'PART 2',
        headerTitle: lineName,
        mainTitle: `${lineName} 분석 (2/2)`,
        buttonLabel: `${lineName} 2`,
        render: () => (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
            {/* Step 4 */}
            <StepHeader step="STEP 04" title="위험 요소 점검" />
            <RiskSection data={lineData.risk} age={result.age || 25} />

            {/* Step 5 */}
            <StepHeader step="STEP 05" title="성장 기회 타이밍" />
            <ChanceSection data={lineData.chance} age={result.age || 25} />

            {/* Step 6 */}
            <StepHeader step="STEP 06" title="현재 시점 해석" />
            <PresentSection
              data={lineData.present}
              age={result.age || 25}
              total={lineData.total}
            />
          </div>
        ),
      });
    });

    return generatedSteps;
  }, [result, resultImageUrl]);

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

  // Navigation Logic
  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setMode('toc'); // Or some finish screen
    }
  };

  const handlePrev = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      setMode('toc');
    }
  };

  const handleTOCSelect = (lineKey: string) => {
    // Find the first step corresponding to this line
    const stepIndex = steps.findIndex((s) => s.id.startsWith(`${lineKey}-`));
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      setMode('detail');
    }
  };

  // --- Main Render ---

  if (mode === 'toc') {
    return (
      <TableOfContents
        lineKeys={Object.keys(result.lines)}
        lineNames={LINE_NAMES}
        onSelect={(idx) => {
          // idx is 1-based index from TOC
          // The TOC component maps lineKeys and passes idx+1.
          // So if I select 1st item (idx=1), the key is lineKeys[0].
          const key = Object.keys(result.lines)[idx - 1];
          handleTOCSelect(key);
        }}
      />
    );
  }

  const currentStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];
  const prevStep = steps[currentStepIndex - 1];

  // Determine Button Labels
  const nextLabel = nextStep ? nextStep.buttonLabel : '분석 완료';
  const prevLabel = prevStep ? prevStep.buttonLabel : '목차로';

  return (
    <div className="min-h-screen bg-[#F5F3F1]">
      <main className="px-5 pt-6 pb-[160px]">
        <TopHeader title={currentStep.headerTitle} onBack={handlePrev} />
        {currentStep.render(null)}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        onPrev={handlePrev}
        onNext={handleNext}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
      />
    </div>
  );
}
