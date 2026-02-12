import PercentageGauge from '@/app/gonnabe/horoscope/(route)/[period]/components/PercentageGauge';
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

  // TODO: 실제 에너지 값 연동 전까지 임시 값
  const energyValue = 50;

  return (
    <div>
      <div className="flex aspect-square w-full flex-col items-center bg-[#EFF5F9] p-5">
        <h1 className="text-2xl font-bold">{period} 총 에너지</h1>
        <p>
          한 주의 분위기를 설정하세요:
          <br />
          준비되고, 집중되고, 조화를 이룬 느낌.
        </p>

        <div className="mt-6 w-full max-w-80">
          <PercentageGauge value={energyValue} />
        </div>
      </div>
    </div>
  );
}
