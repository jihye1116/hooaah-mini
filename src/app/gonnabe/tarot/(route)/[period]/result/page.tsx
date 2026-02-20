import { generateTarotAnalysisOnServer } from '@/app/gonnabe/tarot/api/analysis.server';
import DailyTarotResult from '@/app/gonnabe/tarot/components/daily/DailyTarotResult';
import MonthlyTarotResult from '@/app/gonnabe/tarot/components/monthly/MonthlyTarotResult';
import WeeklyTarotResult from '@/app/gonnabe/tarot/components/weekly/WeeklyTarotResult';
import { TarotAnalysisResult } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import { TarotPeriod } from '@/app/gonnabe/tarot/types/period';
import { notFound } from 'next/navigation';

interface TarotPeriodResultPageProps {
  params: Promise<{
    period: string;
  }>;
  searchParams: Promise<{
    cardId?: string;
    selected?: string;
    reversed?: string;
  }>;
}

function parseTarotAnalysisResult(input: any): TarotAnalysisResult {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid analysis result');
  }

  const analysis = input.analysis || {};
  const selectedCards = (input.selectedCards || []).map((card: any) => ({
    _id: card.id || card._id,
    cardName: card.cardName || '',
    cardThumbnail: card.cardThumbnail || '',
    image: card.image || '',
    reversed: card.reversed || false,
    // Add other fields as needed
    cardDeck: card.cardDeck || 'bubble',
    informationEn: card.informationEn,
    informationKo: card.informationKo,
    informationJp: card.informationJp,
  })) as TarotCardsApiItem[];

  return {
    analysis: {
      messageToday: analysis.messageToday,
      todayFlow: analysis.todayFlow,
      emotionalState: analysis.emotionalState,
      mindfulReminder: analysis.mindfulReminder,
      quietMessage: analysis.quietMessage,
      arcanaOfWeek: analysis.arcanaOfWeek,
      mirrorCard: analysis.mirrorCard,
      windsOfChange: analysis.windsOfChange,
      shadowAndChallenge: analysis.shadowAndChallenge,
      threadOfStory: analysis.threadOfStory,
      tarotsWhisper: analysis.tarotsWhisper,
      monthlyTheme: analysis.monthlyTheme,
      opportunitiesResources: analysis.opportunitiesResources,
      challengesObstacles: analysis.challengesObstacles,
      guidanceAttitude: analysis.guidanceAttitude,
      growthOutcome: analysis.growthOutcome,
      monthlySummary: analysis.monthlySummary,
      keywords: analysis.keywords || [],
      cardKeywords: analysis.cardKeywords || [],
    },
    selectedCards,
  };
}

export default async function TarotPeriodResultPage({
  params,
  searchParams,
}: TarotPeriodResultPageProps) {
  const { period } = await params;
  const {
    cardId: cardIdFromQuery,
    selected: selectedFromQuery,
    reversed: reversedFromQuery,
  } = await searchParams;

  const validPeriods = [
    TarotPeriod.DAILY,
    TarotPeriod.WEEKLY,
    TarotPeriod.MONTHLY,
  ];
  if (!validPeriods.includes(period as any)) {
    notFound();
  }

  const selectedCardIds = (selectedFromQuery ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // For Daily, we might have passed cardId directly or via selected
  // For Weekly/Monthly, we definitely have multiple IDs in selected
  const cardId =
    selectedCardIds.length > 0
      ? selectedCardIds
      : cardIdFromQuery
        ? [cardIdFromQuery]
        : [];

  if (cardId.length === 0) {
    return <div className="p-10 text-white">No cards selected.</div>;
  }

  const cardReversedInfo = (reversedFromQuery ?? '')
    .split(',')
    .reduce<Record<string, boolean>>((acc, pair) => {
      const [id, rev] = pair.split(':');
      if (id) acc[id] = rev === 'true';
      return acc;
    }, {});

  let result: TarotAnalysisResult | null = null;
  let errorMsg = '';

  try {
    const response = await generateTarotAnalysisOnServer({
      cardId: period === TarotPeriod.DAILY ? cardId[0] : cardId,
      analysisType: period,
      cardReversedInfo,
    });
    result = parseTarotAnalysisResult(response);
  } catch (e: any) {
    console.error('Failed to generate analysis:', e);
    errorMsg = e.message || 'Failed to generate analysis';
  }

  if (errorMsg || !result) {
    return (
      <div className="min-h-screen bg-black p-10 text-white">
        <h1 className="mb-4 text-xl font-bold">Error</h1>
        <p>{errorMsg}</p>
      </div>
    );
  }

  const userId = 'user_id_placeholder'; // Should be retrieved from session/auth

  switch (period) {
    case TarotPeriod.DAILY:
      return (
        <DailyTarotResult
          cards={result.selectedCards}
          analysis={result.analysis}
          userId={userId}
        />
      );
    case TarotPeriod.WEEKLY:
      return (
        <WeeklyTarotResult
          cards={result.selectedCards}
          analysis={result.analysis}
          userId={userId}
        />
      );
    case TarotPeriod.MONTHLY:
      return (
        <MonthlyTarotResult
          cards={result.selectedCards}
          analysis={result.analysis}
          userId={userId}
        />
      );
    default:
      return notFound();
  }
}
