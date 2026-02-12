import TarotCardSelection from '@/app/gonnabe/tarot/components/TarotCardSelection';
import { tarotThemeTitles } from '@/app/gonnabe/tarot/constants';
import {
  PREMIUM_TAROT_THEMES,
  TarotTheme,
} from '@/app/gonnabe/tarot/types/theme';
import PremiumContentGate from '@/components/PremiumContentGate';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { notFound } from 'next/navigation';

interface TarotThemePageProps {
  params: Promise<{
    theme: ValueOf<typeof TarotTheme>;
  }>;
}

export default async function TarotThemePage({ params }: TarotThemePageProps) {
  const { theme } = await params;

  // 테마 유효성 검사
  const validThemes = Object.values(TarotTheme);
  if (!validThemes.includes(theme)) {
    notFound();
  }

  const themeTitle = tarotThemeTitles[theme];

  // 유료 테마인지 확인
  const isPremium = PREMIUM_TAROT_THEMES.includes(
    theme as (typeof PREMIUM_TAROT_THEMES)[number],
  );

  // 유료 테마인 경우 PremiumContentGate로 감싸기
  if (isPremium) {
    return (
      <PremiumContentGate
        themeId={theme}
        themeTitle={themeTitle}
        backgroundImage={
          <div className="absolute inset-0 bg-linear-to-b from-purple-900 via-black to-black" />
        }
      >
        <TarotCardSelection theme={theme} />
      </PremiumContentGate>
    );
  }

  // 무료 테마는 바로 표시
  return <TarotCardSelection theme={theme} />;
}
