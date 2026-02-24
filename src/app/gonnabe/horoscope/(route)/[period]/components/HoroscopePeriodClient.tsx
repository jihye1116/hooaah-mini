'use client';

import FortuneContent from '@/app/gonnabe/horoscope/(route)/[period]/components/FortuneContent';
import PercentageGauge from '@/app/gonnabe/horoscope/(route)/[period]/components/PercentageGauge';
import { loadPeriodEnergy } from '@/app/gonnabe/horoscope/api/fortune';
import {
  FortunePeriod,
  MonthlyFortuneResult,
  WeeklyFortuneResult,
} from '@/app/gonnabe/horoscope/types/fortune';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { useEffect, useState } from 'react';

interface Props {
  period: ValueOf<typeof FortunePeriod>;
}

export default function HoroscopePeriodClient({ period }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    WeeklyFortuneResult | MonthlyFortuneResult | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await loadPeriodEnergy(period);
        if (!mounted) return;

        if (period === FortunePeriod.WEEKLY) {
          setData(result as WeeklyFortuneResult);
        } else {
          setData(result as MonthlyFortuneResult);
        }
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [period]);

  const gaugeValue = loading ? 0 : (data?.totalMonthlyEnergy ?? 0);

  const month = new Date().getMonth() + 1;
  const label = period === FortunePeriod.WEEKLY ? '이번 주' : `${month}월`;
  const subtitle =
    period === FortunePeriod.WEEKLY
      ? '한 주의 분위기를 설정하세요:\n준비되고, 집중되고, 조화를 이룬 느낌.'
      : '명확함으로 한 달을 시작하세요:\n무엇을 기대하고, 어디에 집중하고, 언제 행동할지.';

  return (
    <div className="min-h-screen">
      <div className="flex h-110 w-full flex-col items-center justify-between bg-[#EFF5F9] py-12">
        <div className="flex flex-col gap-4 px-5">
          <h1 className="font-playfair-display text-center text-2xl font-semibold">
            {label} 총 에너지
          </h1>
          <p className="font-playfair-display text-center font-medium break-keep whitespace-pre-wrap text-[#666666]">
            {subtitle}
          </p>
        </div>

        <div className="w-full max-w-80 min-w-60">
          <PercentageGauge value={gaugeValue} />
        </div>
      </div>

      <div className="m-6 flex flex-col gap-2 rounded-2xl bg-[#F9F9F9] p-6">
        {error ? (
          <p className="font-plus-jakarta-sans text-sm text-red-500">
            에러: {error}
          </p>
        ) : loading ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-400 border-t-transparent" />
              <div className="font-plus-jakarta-sans text-lg font-semibold">
                불러오는 중...
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ) : (
          <FortuneContent period={period} content={data} />
        )}
      </div>
    </div>
  );
}
