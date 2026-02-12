'use client';

import { cn } from '@sglara/cn';

interface TarotShuffleControlsProps {
  isShuffling: boolean;
  hideButton: boolean;
  onShuffle: () => void;
}

export default function TarotShuffleControls({
  isShuffling,
  hideButton,
  onShuffle,
}: TarotShuffleControlsProps) {
  return (
    <div className="relative z-50 mt-8 mb-12 h-[clamp(5rem,12vh,6.25rem)] w-[clamp(5rem,12vh,6.25rem)]">
      <button
        type="button"
        onClick={onShuffle}
        disabled={isShuffling || hideButton}
        className={cn(
          'font-playfair-display absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-white text-base font-bold text-black shadow-[0px_0px_30px_0px_white] transition-all duration-500',
          isShuffling || hideButton
            ? 'pointer-events-none invisible scale-90 opacity-0'
            : 'visible scale-100 opacity-100 hover:scale-105 active:scale-95',
        )}
      >
        카드 섞기
      </button>

      <div
        className={cn(
          'font-plus-jakarta-sans absolute inset-0 flex items-center justify-center text-center text-sm font-medium text-white transition-all duration-500',
          isShuffling
            ? 'visible scale-100 opacity-100'
            : 'invisible scale-90 opacity-0',
        )}
      >
        카드를 섞는 중....
      </div>
    </div>
  );
}
