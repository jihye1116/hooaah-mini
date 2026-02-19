import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  title,
}: StepIndicatorProps) {
  const progress = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#F5F3F1]/95 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
      <div className="px-5 pt-2 pb-3">
        {/* Progress Bar */}
        <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-[#E3E2E6]">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3680FF 0%, #BA86F4 50%, #F9959D 100%)',
            }}
          />
        </div>

        {/* Step Title */}
        <h2 className="text-center text-lg font-bold text-[#111111]">
          {title}
        </h2>
      </div>
    </div>
  );
}
