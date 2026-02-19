'use client';

import TarotCardGrid from '@/app/gonnabe/tarot/components/TarotCardGrid';
import TarotShuffleControls from '@/app/gonnabe/tarot/components/TarotShuffleControls';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import type { TarotCard as TarotCardType } from '@/app/gonnabe/tarot/types/theme';
import { cn } from '@sglara/cn';
import { useEffect, useRef, useState } from 'react';

interface YearlyTarotCardSelectionProps {
  initialCards: TarotCardType[];
  maxSelectableCards: number;
  onComplete: (selectedIds: string[]) => void;
  isLoading?: boolean;
}

export default function YearlyTarotCardSelection({
  initialCards,
  maxSelectableCards,
  onComplete,
  isLoading = false,
}: YearlyTarotCardSelectionProps) {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardOffsets, setCardOffsets] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const [cards, setCards] = useState<TarotCardType[]>(initialCards);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  useEffect(() => {
    // Reset state when initialCards changes (new chapter)
    hasRequestedAnalysisRef.current = false;
    setTimeout(() => {
      setCards(initialCards);
      setSelectedCardIds([]);
      setCardOffsets({});
      setIsShuffling(false);
    }, 0);
  }, [initialCards]);

  const shuffleCards = (source: TarotCardType[]) => {
    const shuffled = [...source];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  const isSelectionComplete = selectedCardIds.length >= maxSelectableCards;

  const getOffsetsToCenter = () => {
    const gridElement = gridRef.current;
    if (!gridElement) return {};

    const gridRect = gridElement.getBoundingClientRect();
    const centerX = gridRect.left + gridRect.width / 2;
    const centerY = gridRect.top + gridRect.height / 2;

    return cards.reduce<Record<number, { x: number; y: number }>>(
      (acc, _, index) => {
        const element = cardRefs.current[index];
        if (!element) return acc;

        const rect = element.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        acc[index] = {
          x: centerX - cardCenterX,
          y: centerY - cardCenterY,
        };

        return acc;
      },
      {},
    );
  };

  const handleCardSelect = (cardId: string) => {
    if (isShuffling || isSelectionComplete) return;

    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) return prev;
      if (prev.length >= maxSelectableCards) return prev;
      return [...prev, cardId];
    });

    // 선택된 카드는 "뒤집힘(역방향)"으로 간주
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, reversed: true } : card,
      ),
    );
  };

  const handleShuffle = async () => {
    if (isShuffling || selectedCardIds.length > 0) return;

    setIsShuffling(true);
    setSelectedCardIds([]);

    await nextFrame();

    setCardOffsets(getOffsetsToCenter());
    await wait(1000);

    setCards((prev) => shuffleCards(prev));
    await nextFrame();

    setCardOffsets({});
    await wait(700);

    setIsShuffling(false);
  };

  const hasRequestedAnalysisRef = useRef(false);

  useEffect(() => {
    if (!isSelectionComplete) return;
    if (hasRequestedAnalysisRef.current) return;

    // Call onComplete only once when selection is complete
    const run = async () => {
      hasRequestedAnalysisRef.current = true;
      await wait(1000); // Small delay for UX
      onComplete(selectedCardIds);
    };
    void run();
  }, [isSelectionComplete, selectedCardIds, onComplete]);

  return (
    <div className="relative flex size-full flex-col items-center pt-16 pb-28">
      <div className="z-10 mt-[clamp(1rem,3vh,2rem)] px-5">
        <p className="text-center text-sm leading-normal text-white">
          {maxSelectableCards === 1
            ? '마음을 편히 하여, 선택한 질문을 떠올린 뒤 \n눈길이 가는 카드 한 장을 선택하세요.'
            : '마음을 편히 하여, 선택한 질문을 떠올린 뒤 \n눈길이 가는 카드 두 장을 선택하세요.'}
        </p>
      </div>

      <TarotCardGrid
        gridRef={gridRef}
        cardRefs={cardRefs}
        cards={cards}
        cardOffsets={cardOffsets}
        isShuffling={isShuffling}
        disable={isSelectionComplete}
        backImage={`${TAROT_S3_BASE_URL}/bubble_deck_main.png`}
        onSelect={handleCardSelect}
      />

      <div className="grow" />

      <TarotShuffleControls
        isShuffling={isShuffling}
        hideButton={selectedCardIds.length > 0}
        onShuffle={handleShuffle}
      />

      <div
        className={cn(
          'fixed inset-0 z-20 flex size-full items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-300',
          isLoading ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <p className="text-lg font-semibold text-white">타로 분석중...</p>
      </div>
    </div>
  );
}
