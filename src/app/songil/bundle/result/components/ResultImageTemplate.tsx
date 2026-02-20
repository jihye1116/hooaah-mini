import React from 'react';
import TableOfContents from '../TableOfContents';
import PageHeader from './PageHeader';
import StepHeader from './StepHeader';
import FundamentalSection from './FundamentalSection';
import PersonalitySection from './PersonalitySection';
import ChronologySection from './ChronologySection';
import RiskSection from './RiskSection';
import ChanceSection from './ChanceSection';
import PresentSection from './PresentSection';
import { BundleResult } from '../types';
import { getLineDescription } from '../utils/lineDescriptions';
import { palmistryPremiumKorean, wealthLinePremiumKorean } from '../premium';

interface ResultImageTemplateProps {
  result: BundleResult;
  resultImageUrl: string;
  bundle: string;
}

const LINE_NAMES: Record<string, string> = {
  life: '생명선',
  emotion: '감정선',
  destiny: '운명선',
  intelligence: '지능선',
  marriage: '결혼선',
  sun: '태양선',
  wealth: '재물선',
};

export default function ResultImageTemplate({
  result,
  resultImageUrl,
  bundle,
}: ResultImageTemplateProps) {
  const lineKeys = Object.keys(result.lines);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '-9999px',
        width: '375px', // Fixed width for consistent capture
        pointerEvents: 'none',
      }}
    >
      {/* 1. Table of Contents */}
      <div id="capture-toc" className="bg-[#F5F8FF]">
        <TableOfContents
          lineKeys={lineKeys}
          lineNames={LINE_NAMES}
          bundle={bundle}
          onSelect={() => {}} // No-op
        />
      </div>

      {/* 2. Line Steps */}
      {lineKeys.map((key, index) => {
        const lineName = LINE_NAMES[key] || key;
        const lineData = result.lines[key];
        const premiumData =
          palmistryPremiumKorean[key] || wealthLinePremiumKorean;
        const stepNumber = index + 1;

        return (
          <React.Fragment key={key}>
            {/* Image 1: Title + Step 1 */}
            <div
              id={`capture-${key}-image1`}
              className="min-h-screen bg-[#F5F8FF] px-5 pb-10"
            >
              <PageHeader
                stepNumber={stepNumber}
                title={lineName}
                description={getLineDescription(key)}
                onBack={() => {}}
                hideBackButton
              />
              <StepHeader step="STEP 01" title={premiumData.title[0]} />
              <FundamentalSection
                data={lineData.primitive}
                lineName={lineName}
                lineKey={key}
                resultImageUrl={resultImageUrl}
                premiumData={premiumData}
              />
            </div>

            {/* Image 2: Step 2 */}
            <div
              id={`capture-${key}-image2`}
              className="min-h-screen bg-[#F5F8FF] px-5 pb-10"
            >
              <StepHeader step="STEP 02" title={premiumData.title[1]} />
              <PersonalitySection
                data={lineData.personality}
                lineName={lineName}
                premiumData={premiumData}
              />
            </div>

            {/* Image 3: Step 3 */}
            <div
              id={`capture-${key}-image3`}
              className="min-h-screen bg-[#F5F8FF] px-5 pb-10"
            >
              <StepHeader step="STEP 03" title={premiumData.title[2]} />
              <ChronologySection
                data={lineData.flow}
                age={result.age || 25}
                premiumData={premiumData}
              />
            </div>

            {/* Image 4: Step 4 + Step 5 */}
            <div
              id={`capture-${key}-image4`}
              className="min-h-screen bg-[#F5F8FF] px-5 pb-10"
            >
              <StepHeader step="STEP 04" title={premiumData.title[3]} />
              <RiskSection
                data={lineData.risk}
                age={result.age || 25}
                premiumData={premiumData}
              />
              <div className="h-10" />
              <StepHeader step="STEP 05" title={premiumData.title[4]} />
              <ChanceSection
                data={lineData.chance}
                age={result.age || 25}
                premiumData={premiumData}
              />
            </div>

            {/* Image 5: Step 6 (includes Core Message) */}
            <div
              id={`capture-${key}-image5`}
              className="min-h-screen bg-[#F5F8FF] px-5 pb-10"
            >
              <StepHeader step="STEP 06" title={premiumData.title[5]} />
              <PresentSection
                data={lineData.present}
                age={result.age || 25}
                total={lineData.total}
                premiumData={premiumData}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
