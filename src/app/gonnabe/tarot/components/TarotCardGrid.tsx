'use client';

import TarotCard from '@/app/gonnabe/tarot/components/TarotCard';
import type { TarotCard as TarotCardType } from '@/app/gonnabe/tarot/types/theme';
import { cn } from '@sglara/cn';
import type { MutableRefObject, RefObject } from 'react';

interface TarotCardGridProps {
  gridRef: RefObject<HTMLDivElement | null>;
  cardRefs: MutableRefObject<Record<number, HTMLDivElement | null>>;
  cards: TarotCardType[];
  cardOffsets: Record<number, { x: number; y: number }>;
  isShuffling: boolean;
  backImage: string;
  onSelect: (cardId: number) => void;
}

export default function TarotCardGrid({
  gridRef,
  cardRefs,
  cards,
  cardOffsets,
  isShuffling,
  backImage,
  onSelect,
}: TarotCardGridProps) {
  return (
    <div
      ref={gridRef}
      className="relative z-10 mt-[clamp(1rem,3vh,2.5rem)] grid w-full grid-cols-5 gap-[clamp(0.25rem,2vw,0.75rem)] px-7.5"
    >
      {cards.map((card, index) => (
        <div
          key={index}
          ref={(element) => {
            cardRefs.current[index] = element;
          }}
          className={cn(
            'transition-transform duration-700 ease-in-out',
            isShuffling ? 'z-20' : 'z-0',
          )}
          style={{
            transform: cardOffsets[index]
              ? `translate3d(${cardOffsets[index].x}px, ${cardOffsets[index].y}px, 0) scale(0.96)`
              : 'translate3d(0, 0, 0) scale(1)',
          }}
        >
          <TarotCard
            id={card.id}
            backImage={backImage}
            frontImage={card.frontImage}
            reversed={card.reversed}
            onSelect={onSelect}
            disabled={isShuffling}
          />
        </div>
      ))}
    </div>
  );
}
