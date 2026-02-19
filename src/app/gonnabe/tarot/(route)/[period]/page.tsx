import { TarotPeriod } from '@/app/gonnabe/tarot/types/period';
import YearlyTarotFlow from '@/app/gonnabe/tarot/components/yearly/YearlyTarotFlow';
import TarotCardSelection from '@/app/gonnabe/tarot/components/TarotCardSelection';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';

interface TarotPeriodPageProps {
  params: Promise<{
    period: ValueOf<typeof TarotPeriod>;
  }>;
}

export default async function TarotPeriodPage({
  params,
}: TarotPeriodPageProps) {
  const { period } = await params;

  // 테마 유효성 검사
  const validPeriod = Object.values(TarotPeriod);
  if (!validPeriod.includes(period)) {
    notFound();
  }

  if (period === TarotPeriod.YEARLY) {
    return <YearlyTarotFlow />;
  }

  return <TarotCardSelection theme={period} />;
}
