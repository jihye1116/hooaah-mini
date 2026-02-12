import TarotCardSelection from '@/app/gonnabe/tarot/components/TarotCardSelection';
import { TarotPeriod } from '@/app/gonnabe/tarot/types/period';
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

  return <TarotCardSelection theme={period} />;
}
