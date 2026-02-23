import { generateTarotAnalysisOnServer } from '@/app/gonnabe/tarot/api/analysis.server';
import DailyTarotResult from '@/app/gonnabe/tarot/components/daily/DailyTarotResult';
import MonthlyTarotResult from '@/app/gonnabe/tarot/components/monthly/MonthlyTarotResult';
import WeeklyTarotResult from '@/app/gonnabe/tarot/components/weekly/WeeklyTarotResult';
import type { TarotAnalysisResult } from '@/app/gonnabe/tarot/types/analysis';
import { TarotPeriod } from '@/app/gonnabe/tarot/types/period';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';

interface TarotPeriodResultPageProps {
  params: Promise<{
    period: Exclude<ValueOf<typeof TarotPeriod>, 'yearly'>;
  }>;
  searchParams: Promise<{
    cardId: string;
    reversed: string;
  }>;
}

export default async function TarotPeriodResultPage({
  params,
  searchParams,
}: TarotPeriodResultPageProps) {
  const { period } = await params;
  const { cardId: cardIdFromQuery, reversed: reversedFromQuery } =
    await searchParams;

  const validPeriods = [
    TarotPeriod.DAILY,
    TarotPeriod.WEEKLY,
    TarotPeriod.MONTHLY,
  ];

  if (!validPeriods.includes(period)) {
    notFound();
  }

  const cardIds = cardIdFromQuery.split(',');
  const reversed = reversedFromQuery
    .split(',')
    .reduce<Record<string, boolean>>((acc, pair) => {
      const [id, rev] = pair.split(':');
      if (id) acc[id] = rev === 'true';
      return acc;
    }, {});

  const response = await generateTarotAnalysisOnServer<
    TarotAnalysisResult<typeof period>
  >({
    cardId: period === TarotPeriod.DAILY ? cardIdFromQuery : cardIds,
    analysisType: period,
    cardReversedInfo: reversed,
  });

  switch (period) {
    case TarotPeriod.DAILY:
      return (
        <DailyTarotResult
          card={response.selectedCards[0]}
          analysis={
            response.analysis as TarotAnalysisResult<'daily'>['analysis']
          }
        />
      );
    case TarotPeriod.WEEKLY:
      return (
        <WeeklyTarotResult
          cards={response.selectedCards}
          analysis={
            response.analysis as TarotAnalysisResult<'weekly'>['analysis']
          }
        />
      );
    case TarotPeriod.MONTHLY:
      return (
        <MonthlyTarotResult
          cards={response.selectedCards}
          analysis={
            response.analysis as TarotAnalysisResult<'monthly'>['analysis']
          }
        />
      );
  }
}
