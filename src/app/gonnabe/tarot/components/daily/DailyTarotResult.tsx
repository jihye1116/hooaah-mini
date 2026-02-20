'use client';

import ResultTarotCard from '@/app/gonnabe/tarot/components/ResultTarotCard';
import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import { TarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import { cn } from '@sglara/cn';
import Image from 'next/image';
import { useState } from 'react';

interface DailyTarotResultProps {
  cards: TarotCardsApiItem[];
  analysis: TarotAnalysisData;
  userId: string;
}

export default function DailyTarotResult({
  cards,
  analysis,
  userId,
}: DailyTarotResultProps) {
  const [view, setView] = useState<'card' | 'analysis'>('card');
  const [isBlurred, setIsBlurred] = useState(true);

  if (!cards || cards.length === 0) {
    return <div className="text-white p-10">No card data available.</div>;
  }

  const card = cards[0];
  const cardName = card?.cardName || 'Unknown Card';
  const cardImage = card?.cardThumbnail || card?.image || 'dark_00_TheFool_upright';
  const cardImageUrl = `https://durumo.s3.ap-northeast-2.amazonaws.com/tarot/${cardImage}.png`;
  const isReversed = card?.reversed || false;

  if (view === 'card') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        {/* Background */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="/assets/images/tarot/deck_detail_background.png"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center px-5 pt-10 pb-10">
          {/* Header */}
          <h1 className="text-xl font-bold">오늘의 카드 결과</h1>
          
          <div className="mt-10 flex grow flex-col items-center justify-center">
             <p className="mb-8 text-center text-sm text-white/60">
              오늘 당신에게 도착한 카드를 확인해보세요.
            </p>
            
            <ResultTarotCard
              imageUrl={cardImageUrl}
              name={cardName}
              isReversed={isReversed}
              width={200}
              height={320}
              labelPosition="top"
            />
          </div>

          <button
            onClick={() => setView('analysis')}
            className="mt-10 h-16 w-16 rounded-full bg-white text-black shadow-lg transition-transform active:scale-95 flex items-center justify-center"
          >
             <span className="text-xs font-bold text-center">결과<br/>보기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Image
          src="/assets/images/tarot/tarot_detail_background.webp"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 px-5 pt-10 pb-20">
        <h1 className="mb-2 text-center text-2xl font-bold">오늘의 타로 리딩</h1>
        <p className="mb-8 text-center text-sm text-white/70">
          {new Date().toLocaleDateString()}
        </p>

        <TarotSummaryCard
          title="오늘의 메시지"
          subtitle="카드가 전하는 핵심 조언"
          description={analysis.messageToday || '메시지가 없습니다.'}
          tags={analysis.keywords}
          isBlurred={isBlurred}
          onSeeFullReading={() => setIsBlurred(false)}
          cards={
            <ResultTarotCard
              imageUrl={cardImageUrl}
              name={cardName}
              isReversed={isReversed}
              width={100}
              height={160}
            />
          }
        />

        {!isBlurred && (
          <div className="mt-8 flex flex-col gap-6">
            <TarotMessageCard
              title="오늘의 흐름"
              subtitle="하루의 전반적인 분위기"
              description={analysis.todayFlow || ''}
            />
            <TarotMessageCard
              title="감정 상태"
              subtitle="나의 내면 들여다보기"
              description={analysis.emotionalState || ''}
            />
            <TarotMessageCard
              title="마음 챙김"
              subtitle="오늘 기억해야 할 점"
              description={analysis.mindfulReminder || ''}
            />
            <TarotMessageCard
              title="조용한 메시지"
              subtitle="내면의 목소리"
              description={analysis.quietMessage || ''}
            />
          </div>
        )}
      </div>
    </div>
  );
}
