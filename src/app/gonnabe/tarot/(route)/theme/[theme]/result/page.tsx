import { generateThemeTarotAnalysisOnServer } from '@/app/gonnabe/tarot/api/analysis.server';
import TarotResultClient from '@/app/gonnabe/tarot/components/TarotResultClient';
import type { ThemeTarotAnalysisResult } from '@/app/gonnabe/tarot/types/analysis';
import { TarotTheme } from '@/app/gonnabe/tarot/types/theme';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';

// --- Interfaces ---
interface TarotThemeResultPageProps {
  params: Promise<{ theme: ValueOf<typeof TarotTheme> }>;
  searchParams: Promise<{
    cardId: string;
    reversed: string;
  }>;
}

export default async function TarotThemeResultPage({
  params,
  searchParams,
}: TarotThemeResultPageProps) {
  const { theme } = await params;

  const validThemes = Object.values(TarotTheme);
  if (!validThemes.includes(theme)) {
    notFound();
  }

  const { cardId, reversed } = await searchParams;
  const reversedInfo = reversed
    .split(',')
    .reduce<Record<string, boolean>>((acc, pair) => {
      const [id, rev] = pair.split(':');
      if (id) acc[id] = rev === 'true';
      return acc;
    }, {});

  const response =
    await generateThemeTarotAnalysisOnServer<ThemeTarotAnalysisResult>({
      theme,
      cardId,
      cardReversedInfo: reversedInfo,
    });

  return <TarotResultClient theme={theme} result={response} />;
}
