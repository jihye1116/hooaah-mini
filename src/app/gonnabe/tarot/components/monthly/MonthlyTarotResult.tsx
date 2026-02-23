'use client';

import ResultTarotCard from '@/app/gonnabe/tarot/components/ResultTarotCard';
import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import { TarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MonthlyTarotResultProps {
  cards: (any)[];
  analysis: TarotAnalysisData;
  userId: string;
}

export default function MonthlyTarotResult({
  cards,
  analysis,
}: MonthlyTarotResultProps) {
  const [view, setView] = useState<'card' | 'analysis'>('card');
  const [isBlurred, setIsBlurred] = useState(true);
  const router = useRouter();
  const [cardsData, setCardsData] = useState(cards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Props의 cards가 있으면 사용    // eslint-disable-next-line react-hooks/set-state-in-effect    if (cards && cards.length > 0) {
      setCardsData(cards);
    } else {
      // localStorage에서 저장된 카드 정보 읽기 (fallback)
      const stored = localStorage.getItem('tarot_selected_cards_info');
      if (stored) {
        try {
          const cardInfo = JSON.parse(stored);
          console.log('[Monthly] Loaded cards from localStorage:', cardInfo);
          setCardsData(cardInfo);
        } catch (error) {
          console.error('Failed to parse stored cards:', error);
        }
      }
    }
    setIsLoading(false);
  }, [cards]);

  if (isLoading) {
    return <div className="p-10 text-white">로딩 중...</div>;
  }

  if (cardsData.length < 5) {
    return <div className="text-white">Not enough cards selected.</div>;
  }

  const handleCardClick = (id: string) => {
    router.push(`/gonnabe/tarot/card/${id}`);
  };

  const getCardUrl = (c: TarotCardsApiItem) =>
    `https://durumo.s3.ap-northeast-2.amazonaws.com/tarot/${c.cardThumbnail || c.image}.png`;

  if (view === 'card') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="/assets/images/tarot/blue_background.png"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center px-5 pt-10 pb-10">
          <h1 className="text-xl font-bold">월간 카드 결과</h1>
          <p className="mt-4 text-center text-sm text-white/60">
            이번 달 흐름을 읽어보세요.
          </p>

          <div className="mt-10 flex grow flex-col items-center justify-center gap-4">
            {/* Top: Past */}
            <ResultTarotCard
              imageUrl={getCardUrl(cardsData[0])}
              name={
                cardsData[0].informationKo?.cardName || cardsData[0].cardName || cardsData[0].name
              }
              isReversed={cardsData[0].reversed}
              width={70}
              height={100}
              onClick={() => handleCardClick(cardsData[0]._id)}
            />

            {/* Middle: Challenge, Present, Advice */}
            <div className="flex gap-4">
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[1])}
                name={
                  cardsData[1].informationKo?.cardName || cardsData[1].cardName || cardsData[1].name
                }
                isReversed={cardsData[1].reversed}
                width={70}
                height={100}
                onClick={() => handleCardClick(cardsData[1]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[2])}
                name={
                  cardsData[2].informationKo?.cardName || cardsData[2].cardName || cardsData[2].name
                }
                isReversed={cardsData[2].reversed}
                width={70}
                height={100}
                onClick={() => handleCardClick(cardsData[2]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[3])}
                name={
                  cardsData[3].informationKo?.cardName || cardsData[3].cardName || cardsData[3].name
                }
                isReversed={cardsData[3].reversed}
                width={70}
                height={100}
                onClick={() => handleCardClick(cardsData[3]._id)}
              />
            </div>

            {/* Bottom: Future */}
            <ResultTarotCard
              imageUrl={getCardUrl(cardsData[4])}
              name={
                cardsData[4].informationKo?.cardName || cardsData[4].cardName || cardsData[4].name
              }
              isReversed={cardsData[4].reversed}
              width={70}
              height={100}
              onClick={() => handleCardClick(cardsData[4]._id)}
            />
          </div>

          <button
            onClick={() => setView('analysis')}
            className="mt-10 rounded-full bg-white px-8 py-3 font-bold text-black shadow-lg"
          >
            결과 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black px-5 pt-10 pb-20 text-white">
      <h1 className="mb-2 text-center text-2xl font-bold">월간 타로 리딩</h1>

      <TarotSummaryCard
        title="이달의 흐름"
        subtitle="전체 테마"
        description={analysis.monthlyTheme || ''}
        tags={analysis.keywords}
        isBlurred={isBlurred}
        onSeeFullReading={() => setIsBlurred(false)}
        cards={
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[0])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[0]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[1])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[1]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[2])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[2]._id)}
              />
            </div>
            <div className="flex justify-center gap-2">
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[3])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[3]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[4])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[4]._id)}
              />
            </div>
          </div>
        }
      />

      {!isBlurred && (
        <div className="mt-8 flex flex-col gap-6">
          <TarotMessageCard
            title="강점과 기회"
            subtitle="활용할 수 있는 자원"
            description={analysis.opportunitiesResources || ''}
            imageUrl={getCardUrl(cardsData[1])}
            name={cardsData[1].informationKo?.cardName || cardsData[1].cardName || cardsData[1].name}
            isReversed={cardsData[1].reversed}
          />
          <TarotMessageCard
            title="위험과 장애물"
            subtitle="주의해야 할 점"
            description={analysis.challengesObstacles || ''}
            imageUrl={getCardUrl(cardsData[2])}
            name={cardsData[2].informationKo?.cardName || cardsData[2].cardName || cardsData[2].name}
            isReversed={cardsData[2].reversed}
          />
          <TarotMessageCard
            title="조언과 태도"
            subtitle="어떻게 대처할까"
            description={analysis.guidanceAttitude || ''}
            imageUrl={getCardUrl(cardsData[3])}
            name={cardsData[3].informationKo?.cardName || cardsData[3].cardName || cardsData[3].name}
            isReversed={cardsData[3].reversed}
          />
          <TarotMessageCard
            title="결과와 성장"
            subtitle="이달의 마무리"
            description={analysis.growthOutcome || ''}
            imageUrl={getCardUrl(cardsData[4])}
            name={cardsData[4].informationKo?.cardName || cardsData[4].cardName || cardsData[4].name}
            isReversed={cardsData[4].reversed}
          />
          <TarotMessageCard
            title="예언"
            subtitle="통찰의 한 방울"
            description={analysis.monthlySummary || ''}
          />
        </div>
      )}
    </div>
  );
}
