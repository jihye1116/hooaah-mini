'use client';

import { cn } from '@sglara/cn';
import Image from 'next/image';
import { useState } from 'react';

interface TarotCardProps {
  id: string;
  backImage: string;
  frontImage: string;
  reversed: boolean;
  onSelect?: (id: string) => void;
  disabled?: boolean;
}

export default function TarotCard({
  id,
  backImage,
  frontImage,
  reversed,
  onSelect,
  disabled = false,
}: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating || disabled) return; // 애니메이션 중이거나 섞는 중에는 클릭 무시

    setIsAnimating(true);
    setIsFlipped(!isFlipped);

    if (!isFlipped && onSelect) {
      onSelect(id);
    }

    // 애니메이션 시간(600ms) 후 클릭 가능하도록 설정
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div
      className={cn(
        'aspect-2/3 w-full transition-all duration-700 ease-in-out select-none',
        isAnimating || disabled ? 'cursor-default' : 'cursor-pointer',
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-600 transform-3d',
          isFlipped ? 'rotate-y-180' : 'rotate-y-0',
        )}
      >
        {/* 뒷면 (기본 보이는 면) */}
        <div className="pointer-events-none absolute inset-0 rotate-y-0 rounded-[clamp(5px,2vw,10px)] backface-hidden">
          <Image
            src={backImage}
            alt="Tarot Card Back"
            sizes="auto"
            fill
            className="rounded-[clamp(5px,2vw,10px)] object-cover"
          />
        </div>

        {/* 앞면 (뒤집었을 때 보이는 면) */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rotate-y-180 rounded-[clamp(5px,1vw,10px)] backface-hidden',
            reversed && 'rotate-180',
          )}
        >
          <Image
            src={frontImage}
            alt="Tarot Card Front"
            sizes="auto"
            fill
            className="rounded-[clamp(5px,1vw,10px)] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
