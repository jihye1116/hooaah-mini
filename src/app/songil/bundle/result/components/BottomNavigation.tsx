import React from 'react';

interface BottomNavigationProps {
  onPrev?: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  isNextDisabled?: boolean;
}

export default function BottomNavigation({
  onPrev,
  onNext,
  prevLabel = '이전',
  nextLabel = '다음',
  isNextDisabled = false,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#F5F3F1] via-[#F5F3F1] to-transparent px-5 pt-6 pb-[calc(20px+env(safe-area-inset-bottom))]">
      <div className="flex gap-3 max-w-[480px] mx-auto">
        {onPrev && (
          <button
            onClick={onPrev}
            className="flex-1 rounded-xl border border-[#E3E2E6] bg-white py-4 text-base font-bold text-[#696969] shadow-sm transition-transform active:scale-[0.98] leading-tight"
          >
            {prevLabel}
          </button>
        )}
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="flex-1 rounded-xl bg-[#111111] py-4 text-base font-bold text-white shadow-lg transition-transform active:scale-[0.98] disabled:bg-[#E3E2E6] disabled:text-[#A6A6A6] leading-tight"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
