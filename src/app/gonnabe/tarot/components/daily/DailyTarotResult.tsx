'use client';

import ResultTarotCard from '@/app/gonnabe/tarot/components/ResultTarotCard';
import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import { TarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DeckDetailBackground from '@/assets/images/gonnabe/tarot/deck_detail_background.png';
import { loadTarotCards } from '@/app/gonnabe/tarot/api/cards';
interface DailyTarotResultProps {
  cards: any[];
  analysis: TarotAnalysisData;
  userId: string;
}

export default function DailyTarotResult({
  cards,
  analysis,
}: DailyTarotResultProps) {
  const [view, setView] = useState<'card' | 'analysis'>('card');
  const [isBlurred, setIsBlurred] = useState(true);
  const router = useRouter();
  const [cardsData, setCardsData] = useState(cards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Props의 cards가 있으면 사용

    if (cards && cards.length > 0) {
      setCardsData(cards);
    } else {
      // localStorage에서 저장된 카드 정보 읽기 (fallback)
      const stored = localStorage.getItem('tarot_selected_cards_info');
      if (stored) {
        try {
          const cardInfo = JSON.parse(stored);
          console.log('[Daily] Loaded cards from localStorage:', cardInfo);
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

  if (!cardsData || cardsData.length === 0) {
    return <div className="p-10 text-white">No card data available.</div>;
  }

  const card = cardsData[0];
  const cardName =
    card?.informationKo?.cardName ||
    card?.cardName ||
    card?.name ||
    'Unknown Card';
  const cardImage =
    card?.cardThumbnail || card?.image || 'dark_00_TheFool_upright';
  const cardImageUrl = `https://durumo.s3.ap-northeast-2.amazonaws.com/tarot/${cardImage}.png`;
  const isReversed = card?.reversed || false;

  const handleCardClick = (id: string) => {
    router.push(`/gonnabe/tarot/card/${id}`);
  };

  if (view === 'card') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        {/* Background */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src={DeckDetailBackground}
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center px-5 pt-10 pb-10">
          {/* Header */}
          <h1 className="text-xl font-bold">타로 카드 선택 완료</h1>

          <div className="mt-10 flex grow flex-col items-center justify-center">
            <p className="mb-8 text-center text-sm text-white/60">
              선택한 타로 카드가 준비되었습니다
              <br />
              카드를 눌러 카드 스토리텔링도 확인해보세요.
            </p>

            <ResultTarotCard
              imageUrl={cardImageUrl}
              name={cardName}
              isReversed={isReversed}
              width={200}
              height={320}
              labelPosition="top"
              onClick={() => handleCardClick(card._id)}
            />
          </div>

          <button
            onClick={() => setView('analysis')}
            className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform active:scale-95"
          >
            <span className="text-center text-xs font-bold">
              결과
              <br />
              보기
            </span>
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
        <h1 className="mb-2 text-center text-2xl font-bold">
          오늘의 타로 리딩
        </h1>
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
              onClick={() => handleCardClick(card._id)}
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
