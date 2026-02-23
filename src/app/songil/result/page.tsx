'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import PalmistryResult from './components/PalmistryResult';
import HealthcareResult from './components/HealthcareResult';
import NailReadingResult from './components/NailReadingResult';
import RingReadingResult from './components/RingReadingResult';
import SkincareResult from './components/SkincareResult';

function ResultContent() {
  const searchParams = useSearchParams();
  const contents = searchParams.get('contents');

  switch (contents) {
    case 'handHealthCare':
      return <HealthcareResult />;
    case 'nailReading':
      return <NailReadingResult />;
    case 'ringReading':
      return <RingReadingResult />;
    case 'handSkinCare':
      return <SkincareResult />;
    case 'palmistry':
    default:
      return <PalmistryResult />;
  }
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F5F3F1]">
          <div className="font-medium text-[#696969]">결과 불러오는 중...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
