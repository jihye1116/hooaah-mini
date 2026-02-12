import HoroscopeContent from '@/app/gonnabe/horoscope/[theme]/components/HoroscopeContent';
import {
  themeImages,
  themeSubjects,
  themeTitles,
} from '@/app/gonnabe/horoscope/constants';
import {
  FortuneTheme,
  PREMIUM_THEMES,
} from '@/app/gonnabe/horoscope/types/fortune';
import PremiumContentGate from '@/components/PremiumContentGate';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface HoroscopeThemePageProps {
  params: Promise<{
    theme: Exclude<ValueOf<typeof FortuneTheme>, typeof FortuneTheme.TODAY>;
  }>;
  searchParams?: Promise<{
    name?: string;
    birthDate?: string;
  }>;
}

export default async function HoroscopeThemePage({
  params,
  searchParams,
}: HoroscopeThemePageProps) {
  const { theme } = await params;
  const { name, birthDate } = (await searchParams) ?? {};

  // 테마 유효성 검사
  const validThemes = Object.values(FortuneTheme);
  if (!validThemes.includes(theme)) {
    notFound();
  }

  const themeImage = themeImages[theme];
  const themeTitle = themeTitles[theme];
  const themeSubject = themeSubjects[theme];

  // 유료 테마인지 확인
  const isPremium = PREMIUM_THEMES.includes(
    theme as (typeof PREMIUM_THEMES)[number],
  );

  // 유료 테마인 경우 PremiumContentGate로 감싸기
  if (isPremium) {
    return (
      <PremiumContentGate
        themeId={theme}
        themeTitle={themeTitle}
        backgroundImage={
          <Image src={themeImage} alt="Horoscope Theme" fill sizes="auto" />
        }
      >
        <HoroscopeContent
          theme={theme}
          themeImage={themeImage}
          themeTitle={themeTitle}
          themeSubject={themeSubject}
          name={name}
          birthDate={birthDate}
        />
      </PremiumContentGate>
    );
  }

  // 무료 테마는 바로 표시
  return (
    <HoroscopeContent
      theme={theme}
      themeImage={themeImage}
      themeTitle={themeTitle}
      themeSubject={themeSubject}
      name={name}
      birthDate={birthDate}
    />
  );
}
