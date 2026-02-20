'use client';

import ResultTarotCard from '@/app/gonnabe/tarot/components/ResultTarotCard';
import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import { TarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import Image from 'next/image';
import { useState } from 'react';

interface WeeklyTarotResultProps {
  cards: TarotCardsApiItem[];
  analysis: TarotAnalysisData;
  userId: string;
}

export default function WeeklyTarotResult({
  cards,
  analysis,
  userId,
}: WeeklyTarotResultProps) {
  const [view, setView] = useState<'card' | 'analysis'>('card');
  const [isBlurred, setIsBlurred] = useState(true);

  if (cards.length < 3) {
    return <div className="text-white">Not enough cards selected.</div>;
  }

  const card1 = cards[0];
  const card2 = cards[1];
  const card3 = cards[2];

  const getCardUrl = (c: TarotCardsApiItem) =>
    `https://durumo.s3.ap-northeast-2.amazonaws.com/tarot/${c.cardThumbnail || c.image}.png`;

  if (view === 'card') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="/assets/images/tarot/deck_detail_background.png"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center px-5 pt-10 pb-10">
          <h1 className="text-xl font-bold">주간 카드 결과</h1>
          <p className="mt-4 text-center text-sm text-white/60">
            이번 주 흐름을 읽어보세요.
          </p>

          <div className="mt-10 flex grow flex-col items-center justify-center gap-8">
            {/* Top Card */}
            <ResultTarotCard
              imageUrl={getCardUrl(card1)}
              name={card1.cardName}
              isReversed={card1.reversed}
              width={100}
              height={160}
              labelPosition="bottom"
            />

            {/* Bottom Two Cards */}
            <div className="flex gap-8">
              <ResultTarotCard
                imageUrl={getCardUrl(card2)}
                name={card2.cardName}
                isReversed={card2.reversed}
                width={100}
                height={160}
                labelPosition="bottom"
              />
              <ResultTarotCard
                imageUrl={getCardUrl(card3)}
                name={card3.cardName}
                isReversed={card3.reversed}
                width={100}
                height={160}
                labelPosition="bottom"
              />
            </div>
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
      <h1 className="mb-2 text-center text-2xl font-bold">주간 타로 리딩</h1>
      
      <TarotSummaryCard
        title="이번 주의 아르카나"
        subtitle="전체적인 테마"
        description={analysis.arcanaOfWeek || ''}
        tags={analysis.keywords}
        isBlurred={isBlurred}
        onSeeFullReading={() => setIsBlurred(false)}
        cards={
          <div className="flex gap-2">
             <ResultTarotCard
              imageUrl={getCardUrl(card1)}
              width={60}
              height={90}
            />
             <ResultTarotCard
              imageUrl={getCardUrl(card2)}
              width={60}
              height={90}
            />
             <ResultTarotCard
              imageUrl={getCardUrl(card3)}
              width={60}
              height={90}
            />
          </div>
        }
      />

      {!isBlurred && (
        <div className="mt-8 flex flex-col gap-6">
          <TarotMessageCard
            title="현재 상황 (Mirror)"
            subtitle="나의 모습"
            description={analysis.mirrorCard || ''}
            imageUrl={getCardUrl(card1)}
            name={card1.cardName}
            isReversed={card1.reversed}
          />
          <TarotMessageCard
            title="변화의 바람"
            subtitle="다가오는 사건"
            description={analysis.windsOfChange || ''}
            imageUrl={getCardUrl(card2)}
            name={card2.cardName}
            isReversed={card2.reversed}
          />
          <TarotMessageCard
            title="그림자와 도전"
            subtitle="주의할 점"
            description={analysis.shadowAndChallenge || ''}
            imageUrl={getCardUrl(card3)}
            name={card3.cardName}
            isReversed={card3.reversed}
          />
          <TarotMessageCard
            title="이야기의 흐름"
            subtitle="전개 방향"
            description={analysis.threadOfStory || ''}
          />
          <TarotMessageCard
            title="타로의 속삭임"
            subtitle="조언"
            description={analysis.tarotsWhisper || ''}
          />
        </div>
      )}
    </div>
  );
}
