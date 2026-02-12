import { loadFortune } from '@/app/gonnabe/horoscope/api/fortune';
import type { ThemeKey } from '@/app/gonnabe/horoscope/types/fortune';

const normalizeBirthday = (input: string) => {
  const trimmed = input.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const korean = trimmed.match(
    /^(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일$/,
  );
  if (korean) {
    const [, y, m, d] = korean;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const dotted = trimmed.match(/^(\d{4})[./](\d{1,2})[./](\d{1,2})$/);
  if (dotted) {
    const [, y, m, d] = dotted;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  return trimmed;
};

interface HoroscopeFortuneResultProps {
  theme: ThemeKey;
  name: string;
  birthDate: string;
}

export default async function HoroscopeFortuneResult({
  theme,
  name,
  birthDate,
}: HoroscopeFortuneResultProps) {
  const normalizedBirthday = normalizeBirthday(birthDate);

  const fortuneOutcome = await loadFortune(normalizedBirthday, theme)
    .then((result) => ({ ok: true as const, result }))
    .catch((error: unknown) => ({ ok: false as const, error }));

  if (!fortuneOutcome.ok) {
    const errorMessage =
      fortuneOutcome.error instanceof Error
        ? fortuneOutcome.error.message
        : '운세를 불러오지 못했습니다.';

    return (
      <span className="text-lg leading-relaxed font-bold text-red-600">
        {errorMessage}
      </span>
    );
  }

  const { fortuneData } = fortuneOutcome.result;
  const fortuneDataText = [
    fortuneData.data.introduction,
    fortuneData.data.main.current_situation,
    fortuneData.data.main.analysis,
    fortuneData.data.conclusion,
  ].join('\n\n');

  return (
    <p className="leading-relaxed font-medium wrap-break-word whitespace-pre-wrap text-[#555555]">
      {fortuneDataText}
    </p>
  );
}
