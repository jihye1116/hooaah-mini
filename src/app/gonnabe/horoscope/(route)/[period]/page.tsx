import { FortunePeriod } from '@/app/gonnabe/horoscope/types/fortune';
import PremiumContentGate from '@/components/PremiumContentGate';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';
import HoroscopePeriodClient from './components/HoroscopePeriodClient';

interface HoroscopePeriodPageProps {
  params: Promise<{
    period: ValueOf<typeof FortunePeriod>;
  }>;
}

export default async function HoroscopePeriodPage({
  params,
}: HoroscopePeriodPageProps) {
  const { period } = await params;

  const validPeriods = Object.values(FortunePeriod);
  if (!validPeriods.includes(period)) {
    notFound();
  }

  return (
    <PremiumContentGate
      contentId={`horoscope:${period}`}
      title={period === FortunePeriod.WEEKLY ? '주간 운세' : '월간 운세'}
    >
      <HoroscopePeriodClient period={period} />
    </PremiumContentGate>
  );
}
