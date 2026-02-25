import HoroscopeUserInfoForm from '@/app/gonnabe/horoscope/(route)/theme/[theme]/components/HoroscopeUserInfoForm';
import { FortunePeriod } from '@/app/gonnabe/horoscope/types/fortune';
import PremiumContentGate from '@/components/PremiumContentGate';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';
import HoroscopePeriodClient from './components/HoroscopePeriodClient';

interface HoroscopePeriodPageProps {
  params: Promise<{
    period: ValueOf<typeof FortunePeriod>;
  }>;
  searchParams: Promise<{
    name: string;
    birthDate: string;
  }>;
}

export default async function HoroscopePeriodPage({
  params,
  searchParams,
}: HoroscopePeriodPageProps) {
  const { period } = await params;
  const { name, birthDate } = await searchParams;

  const validPeriods = Object.values(FortunePeriod);
  if (!validPeriods.includes(period)) {
    notFound();
  }

  if (!name || !birthDate) {
    return <HoroscopeUserInfoForm theme={period} />;
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
