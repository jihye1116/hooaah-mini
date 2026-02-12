'use client';

import TarotCardGrid from '@/app/gonnabe/tarot/components/TarotCardGrid';
import TarotShuffleControls from '@/app/gonnabe/tarot/components/TarotShuffleControls';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import type { TarotCard as TarotCardType } from '@/app/gonnabe/tarot/types/theme';
import { useRef, useState } from 'react';

interface TarotCardSelectionClientProps {
  theme: string;
  initialCards: TarotCardType[];
}

export default function TarotCardSelectionClient({
  theme,
  initialCards,
}: TarotCardSelectionClientProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [hasSelectedCardOnce, setHasSelectedCardOnce] = useState(false);
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

  const shuffleCards = (source: TarotCardType[]) => {
    const shuffled = [...source];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

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

  const handleCardSelect = (cardId: number) => {
    if (isShuffling) return;
    setSelectedCard(cardId);
    setHasSelectedCardOnce(true);
  };

  const handleShuffle = async () => {
    if (isShuffling) return;

    setIsShuffling(true);
    setSelectedCard(null);

    await nextFrame();

    setCardOffsets(getOffsetsToCenter());
    await wait(1000);

    setCards((prev) => shuffleCards(prev));
    await nextFrame();

    setCardOffsets({});
    await wait(700);

    setIsShuffling(false);
  };

  return (
    <div className="flex size-full flex-col items-center bg-black">
      <div className="z-10 h-9 px-5 pt-7.5">
        <h1 className="font-playfair-display text-center text-[15px] font-semibold tracking-[-0.15px] text-white">
          타로 선택하기
        </h1>
      </div>

      <div className="z-10 mt-[clamp(2rem,5vh,4rem)] px-5">
        <p className="font-plus-jakarta-sans text-center text-sm leading-normal text-white">
          마음을 편히 하여, 선택한 질문을 떠올린 뒤
          <br />
          눈길이 가는 카드 한 장을 선택하세요.
        </p>
      </div>

      <TarotCardGrid
        gridRef={gridRef}
        cardRefs={cardRefs}
        cards={cards}
        cardOffsets={cardOffsets}
        isShuffling={isShuffling}
        backImage={`${TAROT_S3_BASE_URL}/bubble_deck_main.png`}
        onSelect={handleCardSelect}
      />

      <div className="grow" />

      <TarotShuffleControls
        isShuffling={isShuffling}
        hideButton={hasSelectedCardOnce}
        onShuffle={handleShuffle}
      />
    </div>
  );
}
