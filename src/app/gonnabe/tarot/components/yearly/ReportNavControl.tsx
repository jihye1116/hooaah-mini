'use client';

import { cn } from '@sglara/cn';
import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

interface ReportNavControlProps {
  index: number;
  total: number;
  onPrev: () => Promise<void> | void;
  onNext: () => Promise<void> | void;
  onClose: () => void;
  backgroundColor?: string;
  className?: string;
}

export default function ReportNavControl({
  index,
  total,
  onPrev,
  onNext,
  onClose,
  className,
}: ReportNavControlProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: () => Promise<void> | void) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await action();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between bg-white/50 px-6 pt-[18px] pb-[calc(env(safe-area-inset-bottom)+20px)] text-black shadow-[0_-16px_32px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      {/* Prev / Close Button */}
      <button
        onClick={() => !isProcessing && handleAction(onPrev)}
        className="flex-1 text-center font-[family-name:var(--font-playfair-display)] text-lg leading-relaxed font-bold"
        disabled={isProcessing}
      >
        {index > 1 ? '이전' : '닫기'}
      </button>

      {/* Page Indicator */}
      <div className="mx-3 flex items-center justify-center rounded-full border border-black/20 px-3.5 py-1.5">
        <span className="font-[family-name:var(--font-plus-jakarta-sans)] text-sm leading-relaxed text-black">
          <span className="font-semibold">{index}</span>
          <span className="text-black/50">
            {'  /  '}
            {total}
          </span>
        </span>
      </div>

      {/* Next / Close Button */}
      <button
        onClick={() => {
          if (isProcessing) return;
          if (index === total) {
            onClose();
          } else {
            handleAction(onNext);
          }
        }}
        className="flex flex-1 items-center justify-center gap-2.5 text-center font-[family-name:var(--font-playfair-display)] text-lg leading-relaxed font-bold"
        disabled={isProcessing}
      >
        <span>{index === total ? '닫기' : '다음'}</span>
        {index !== total && <ArrowRight size={18} className="text-black" />}
      </button>
    </div>
  );
}
