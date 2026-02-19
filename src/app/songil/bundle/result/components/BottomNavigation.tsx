import React from 'react';

interface BottomNavigationProps {
  onPrev?: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isPage1?: boolean;
}

export default function BottomNavigation({
  onPrev,
  onNext,
  prevLabel = '이전',
  nextLabel = '다음',
  isNextDisabled = false,
  isPage1 = false,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 z-50 w-full max-w-[480px] bg-white px-5 pt-6 pb-[calc(20px+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[480px] gap-3">
        {isPage1 ? (
          // Page 1: Only right button with gradient
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className="flex flex-1 items-center justify-center gap-[19px] rounded-[13px] px-[37px] py-[19px] text-[16px] leading-[1.4] font-semibold tracking-[-0.024em] text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(54deg, rgba(54, 128, 255, 1) 39%, rgba(186, 134, 244, 1) 73%, rgba(249, 149, 157, 1) 100%)',
            }}
          >
            {nextLabel}
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <>
            {onPrev && (
              <button
                onClick={onPrev}
                className="flex-2 rounded-[14px] px-6 py-0 text-[18px] leading-[1.4] font-bold tracking-[-0.044444em] text-white transition-transform active:scale-[0.98] disabled:bg-[#E3E2E6] disabled:text-[#A6A6A6]"
                style={{
                  height: '64px',
                  backgroundImage:
                    'linear-gradient(54deg, rgba(54, 128, 255, 1) 39%, rgba(186, 134, 244, 1) 73%, rgba(249, 149, 157, 1) 100%)',
                }}
              >
                {prevLabel}
              </button>
            )}
            <button
              className="flex-1 rounded-[14px] bg-[#F5F6F8] px-6 py-0 text-[18px] leading-[1.4] font-bold tracking-[-0.044444em] text-[#696969] transition-transform active:scale-[0.98]"
              style={{ height: '64px' }}
              onClick={onNext}
              disabled={isNextDisabled}
            >
              {nextLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
