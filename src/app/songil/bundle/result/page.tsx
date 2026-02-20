'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import TableOfContents from './TableOfContents';
import { getLineDescription } from './utils/lineDescriptions';
import { palmistryPremiumKorean, wealthLinePremiumKorean } from './premium';
import { getPretendardFontCSS } from './utils/fontUtils';

// Components
import FundamentalSection from './components/FundamentalSection';
import PersonalitySection from './components/PersonalitySection';
import ChronologySection from './components/ChronologySection';
import RiskSection from './components/RiskSection';
import ChanceSection from './components/ChanceSection';
import PresentSection from './components/PresentSection';
import StepHeader from './components/StepHeader';
import PageHeader from './components/PageHeader';
import BottomNavigation from './components/BottomNavigation';
import ResultImageTemplate from './components/ResultImageTemplate';
import { BundleResult } from './types';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';

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
  const [bundle, setBundle] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Client-side only logic
    const savedResult = localStorage.getItem('bundle_result');
    const savedImage = localStorage.getItem('bundle_image');
    const savedBundle = localStorage.getItem('bundle_type');

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
    if (savedBundle) {
      setTimeout(() => setBundle(savedBundle), 0);
    }
  }, []);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // 🚀 핵심 3: 폰트를 미리 로드하여 base64 CSS로 변환. 이렇게 하면 매번 재요청하지 않음.
      const fontCSS = await getPretendardFontCSS();

      const options = {
        backgroundColor: '#F5F8FF',
        pixelRatio: 1,
        quality: 0.8,
        cacheBust: false, // 🚀 핵심 1: 매 캡쳐마다 폰트/이미지 재다운로드하는 현상 방지
        fontEmbedCSS: fontCSS, // 수동으로 폰트 삽입
        skipFonts: true, // 🚨 자동 폰트 로딩 스킵 (속도 최적화)
      };

      // 1. 캡쳐할 대상(Element)과 파일명을 배열에 싹 다 모아둡니다.
      const captureTargets = [];

      const tocElement = document.getElementById('capture-toc');
      if (tocElement) {
        captureTargets.push({
          element: tocElement,
          fileName: 'hooaah-result-00-toc.jpg',
        });
      }

      if (result && result.lines) {
        const lineKeys = Object.keys(result.lines);
        for (let i = 0; i < lineKeys.length; i++) {
          const key = lineKeys[i];
          for (let step = 1; step <= 5; step++) {
            const elementId = `capture-${key}-image${step}`;
            const element = document.getElementById(elementId);
            if (element) {
              captureTargets.push({
                element,
                fileName: `hooaah-result-${String(i + 1).padStart(2, '0')}-${key}-image${step}.jpg`,
              });
            }
          }
        }
      }

      // 2. 모아둔 대상을 병렬로 처리하여 캡쳐합니다. (배치 크기: 3)
      const batchSize = 3;
      for (let i = 0; i < captureTargets.length; i += batchSize) {
        const batch = captureTargets.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (target) => {
            const dataUrl = await toJpeg(target.element, options);
            saveAs(dataUrl, target.fileName);
          }),
        );

        // 🚀 핵심 2: 브라우저가 완전히 멈추는 것만 막기 위해 아주 짧은 숨통(50ms)만 틔워줍니다.
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } catch (e) {
      console.error('Save failed', e);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Step Generation Logic ---
  const steps = useMemo<Step[]>(() => {
    if (!result) return [];

    const generatedSteps: Step[] = [];

    // 2. Line Analysis Steps
    const lineKeys = Object.keys(result.lines);

    lineKeys.forEach((key, index) => {
      const lineName = LINE_NAMES[key] || key;
      const lineData = result.lines[key];
      const stepNumber = index + 1;
      const premiumData =
        palmistryPremiumKorean[key] || wealthLinePremiumKorean;

      // Page 1: Steps 1-3 (Basic Info, Personality, Chronology)
      generatedSteps.push({
        id: `${key}-page1`,
        stepTitle: 'PART 1',
        headerTitle: lineName,
        mainTitle: `${lineName} 분석 (1/2)`,
        buttonLabel: `${lineName} 1`,
        render: () => (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
            <div>
              <PageHeader
                stepNumber={stepNumber}
                title={lineName}
                description={getLineDescription(key)}
                onBack={() => setMode('toc')}
              />
              {/* Step 1 */}
              <StepHeader step="STEP 01" title={premiumData.title[0]} />
            </div>
            <FundamentalSection
              data={lineData.primitive}
              lineName={lineName}
              lineKey={key}
              resultImageUrl={resultImageUrl}
              premiumData={premiumData}
            />

            {/* Step 2 */}
            <StepHeader step="STEP 02" title={premiumData.title[1]} />
            <PersonalitySection
              data={lineData.personality}
              lineName={lineName}
              premiumData={premiumData}
            />

            {/* Step 3 */}
            <StepHeader step="STEP 03" title={premiumData.title[2]} />
            <ChronologySection
              data={lineData.flow}
              age={result.age || 25}
              premiumData={premiumData}
            />
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
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <PageHeader
              stepNumber={stepNumber}
              title={lineName}
              description={getLineDescription(key)}
              onBack={() => setMode('toc')}
            />
            {/* Step 4 */}
            <StepHeader step="STEP 04" title={premiumData.title[3]} />
            <RiskSection
              data={lineData.risk}
              age={result.age || 25}
              premiumData={premiumData}
            />

            {/* Step 5 */}
            <StepHeader step="STEP 05" title={premiumData.title[4]} />
            <ChanceSection
              data={lineData.chance}
              age={result.age || 25}
              premiumData={premiumData}
            />

            {/* Step 6 */}
            <StepHeader step="STEP 06" title={premiumData.title[5]} />
            <PresentSection
              data={lineData.present}
              age={result.age || 25}
              total={lineData.total}
              premiumData={premiumData}
            />
          </div>
        ),
      });
    });

    return generatedSteps;
  }, [result, resultImageUrl, setMode]);

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

  const handleGoToToc = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMode('toc');
  };

  const handleTOCSelect = (lineKey: string) => {
    // Find the first step corresponding to this line
    const stepIndex = steps.findIndex((s) => s.id.startsWith(`${lineKey}-`));
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      setMode('detail');
    }
  };

  const currentStep = steps[currentStepIndex];
  // const nextStep = steps[currentStepIndex + 1]; // Unused
  // const prevStep = steps[currentStepIndex - 1]; // Unused

  // Determine if current step is page1 or page2
  const isPage1 = currentStep?.id.endsWith('-page1');
  const isPage2 = currentStep?.id.endsWith('-page2');

  // Get line name from current step ID
  const currentLineKey = currentStep?.id.split('-')[0];
  const currentLineName = LINE_NAMES[currentLineKey] || currentLineKey;
  const currentPremiumData = palmistryPremiumKorean[currentLineKey];
  const lineKeys = result ? Object.keys(result.lines) : [];
  const currentLineIndex = lineKeys.indexOf(currentLineKey);
  const nextLineKey =
    currentLineIndex >= 0 ? lineKeys[currentLineIndex + 1] : undefined;
  const nextLineName = nextLineKey
    ? LINE_NAMES[nextLineKey] || nextLineKey
    : '';
  const nextLineStepIndex = nextLineKey
    ? steps.findIndex((s) => s.id === `${nextLineKey}-page1`)
    : -1;

  // Determine Button Labels
  let nextLabel = '';
  let prevLabel = '';

  if (isPage1) {
    // Page 1: Only show right button with "Step 4: 위험 요소 점검"
    const nextStepTitle = currentPremiumData?.title[3] || '위험 요소 점검';
    nextLabel = `Step 4: ${nextStepTitle}`;
  } else if (isPage2) {
    // Page 2: Left button and right button
    prevLabel = nextLineName ? `${nextLineName} 보기` : '처음으로';
    nextLabel = '처음으로';
  }

  // --- Main Render ---

  return (
    <>
      {/* Hidden Template for Image Generation */}
      {result && (
        <ResultImageTemplate
          result={result}
          resultImageUrl={resultImageUrl}
          bundle={bundle}
        />
      )}

      {mode === 'toc' ? (
        <TableOfContents
          lineKeys={Object.keys(result.lines)}
          lineNames={LINE_NAMES}
          bundle={bundle}
          onSelect={(idx) => {
            const key = Object.keys(result.lines)[idx - 1];
            handleTOCSelect(key);
          }}
          onSave={handleSave}
        />
      ) : (
        <div className="min-h-screen bg-[#F5F8FF]">
          <main className="px-5 pb-40">
            {currentStep.render(null)}
            {/* Save Button for Detail View - Only show on last theme's page 2 */}
            {isPage2 && currentLineIndex === lineKeys.length - 1 && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="mt-8 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#1E1450]/20 bg-white/30 px-[22px] py-[10px] text-[12px] font-semibold tracking-[0.03em] text-[#1E1450]/60 transition-all duration-200 hover:border-[#1E1450]/35 hover:bg-white/50 hover:text-[#1E1450]/90 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {isSaving ? (
                  <span>저장 중...</span>
                ) : (
                  <>
                    <Download className="h-[13px] w-[13px]" />
                    전체 결과 이미지로 저장하기
                  </>
                )}
              </button>
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNavigation
            onPrev={
              isPage1
                ? undefined
                : nextLineName
                  ? () => {
                      if (nextLineStepIndex !== -1) {
                        setCurrentStepIndex(nextLineStepIndex);
                      }
                    }
                  : undefined
            }
            onNext={isPage2 ? handleGoToToc : isPage1 ? handleNext : () => {}}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            isPage1={isPage1}
          />
        </div>
      )}
    </>
  );
}
