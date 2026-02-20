'use client';

import ResultTarotCard from '@/app/gonnabe/tarot/components/ResultTarotCard';
import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import { TarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import Image from 'next/image';
import { useState } from 'react';

interface MonthlyTarotResultProps {
  cards: TarotCardsApiItem[];
  analysis: TarotAnalysisData;
  userId: string;
}

export default function MonthlyTarotResult({
  cards,
  analysis,
  userId,
}: MonthlyTarotResultProps) {
  const [view, setView] = useState<'card' | 'analysis'>('card');
  const [isBlurred, setIsBlurred] = useState(true);

  if (cards.length < 5) {
    return <div className="text-white">Not enough cards selected.</div>;
  }

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
              imageUrl={getCardUrl(cards[0])}
              name="과거"
              isReversed={cards[0].reversed}
              width={70}
              height={100}
            />

            {/* Middle: Challenge, Present, Advice */}
            <div className="flex gap-4">
              <ResultTarotCard
                imageUrl={getCardUrl(cards[1])}
                name="도전"
                isReversed={cards[1].reversed}
                width={70}
                height={100}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cards[2])}
                name="현재"
                isReversed={cards[2].reversed}
                width={70}
                height={100}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cards[3])}
                name="조언"
                isReversed={cards[3].reversed}
                width={70}
                height={100}
              />
            </div>

            {/* Bottom: Future */}
            <ResultTarotCard
              imageUrl={getCardUrl(cards[4])}
              name="미래"
              isReversed={cards[4].reversed}
              width={70}
              height={100}
            />
          </div>

          <button
            onClick={() => setView('analysis')}
            className="mt-10 rounded-full bg-white px-8 py-3 text-black shadow-lg font-bold"
          >
            결과 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white px-5 pt-10 pb-20">
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
               <ResultTarotCard imageUrl={getCardUrl(cards[0])} width={50} height={75} />
               <ResultTarotCard imageUrl={getCardUrl(cards[1])} width={50} height={75} />
               <ResultTarotCard imageUrl={getCardUrl(cards[2])} width={50} height={75} />
            </div>
             <div className="flex gap-2 justify-center">
               <ResultTarotCard imageUrl={getCardUrl(cards[3])} width={50} height={75} />
               <ResultTarotCard imageUrl={getCardUrl(cards[4])} width={50} height={75} />
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
            imageUrl={getCardUrl(cards[1])}
            name={cards[1].cardName}
            isReversed={cards[1].reversed}
          />
          <TarotMessageCard
            title="위험과 장애물"
            subtitle="주의해야 할 점"
            description={analysis.challengesObstacles || ''}
            imageUrl={getCardUrl(cards[2])}
            name={cards[2].cardName}
            isReversed={cards[2].reversed}
          />
          <TarotMessageCard
            title="조언과 태도"
            subtitle="어떻게 대처할까"
            description={analysis.guidanceAttitude || ''}
            imageUrl={getCardUrl(cards[3])}
            name={cards[3].cardName}
            isReversed={cards[3].reversed}
          />
          <TarotMessageCard
            title="결과와 성장"
            subtitle="이달의 마무리"
            description={analysis.growthOutcome || ''}
            imageUrl={getCardUrl(cards[4])}
            name={cards[4].cardName}
            isReversed={cards[4].reversed}
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
