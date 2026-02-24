import {
  FortunePeriod,
  type MonthlyFortuneResult,
  type WeeklyFortuneResult,
} from '@/app/gonnabe/horoscope/types/fortune';
import type { ValueOf } from 'next/dist/shared/lib/constants';

interface FortuneContentProps {
  period: ValueOf<typeof FortunePeriod>;
  content: WeeklyFortuneResult | MonthlyFortuneResult | null;
}

const FortuneContent = ({ period, content }: FortuneContentProps) => {
  if (!content) return null;

  const data =
    period === FortunePeriod.WEEKLY
      ? (content as WeeklyFortuneResult).thisWeek
      : (content as MonthlyFortuneResult).thisMonth;

  return (
    <>
      <h2 className="font-plus-jakarta-sans text-lg leading-relaxed font-semibold whitespace-pre-wrap">
        {data.intro_summary}
      </h2>
      <p className="font-plus-jakarta-sans text-sm leading-relaxed whitespace-pre-wrap text-[#555555]">
        {data.turning_momentum}
      </p>
      <p className="font-plus-jakarta-sans text-sm leading-relaxed whitespace-pre-wrap text-[#555555]">
        {data.potential_shift}
      </p>
      <p className="font-plus-jakarta-sans text-sm leading-relaxed whitespace-pre-wrap text-[#555555]">
        {data.action_prompt}
      </p>
      <p className="font-plus-jakarta-sans text-sm leading-relaxed whitespace-pre-wrap text-[#555555]">
        {data.closing_summary}
      </p>
    </>
  );
};

export default FortuneContent;
