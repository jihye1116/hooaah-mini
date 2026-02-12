import { FortunePeriod } from '@/app/gonnabe/horoscope/types/fortune';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';

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

  return <div>Horoscope Period Page</div>;
}
