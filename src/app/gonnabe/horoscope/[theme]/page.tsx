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
}

export default async function HoroscopeThemePage({
  params,
}: HoroscopeThemePageProps) {
  const resolvedParams = await params;
  const currentTheme = resolvedParams.theme;

  // 테마 유효성 검사
  const validThemes = Object.values(FortuneTheme);
  if (!validThemes.includes(currentTheme)) {
    notFound();
  }

  const themeImage = themeImages[currentTheme];
  const themeTitle = themeTitles[currentTheme];
  const themeSubject = themeSubjects[currentTheme];

  // 유료 테마인지 확인
  const isPremium = PREMIUM_THEMES.includes(
    currentTheme as (typeof PREMIUM_THEMES)[number],
  );

  // 콘텐츠 렌더링 함수
  const Contents = () => (
    <div>
      <div className="relative aspect-square w-full">
        <Image src={themeImage} alt="Horoscope Theme" fill />
      </div>

      <main className="mb-12 flex flex-col p-6">
        <h2 className="font-playfair-display mb-4 leading-8 font-semibold text-[#111111]/50">
          {themeSubject}
        </h2>

        <h1 className="font-playfair-display mb-12 text-[27px] font-bold text-[#333333]">
          {themeTitle}
        </h1>

        <article className="font-plus-jakarta-sans flex flex-col gap-4 rounded-2xl bg-[#F9F9F9] px-5 py-6">
          <span className="text-lg leading-relaxed font-bold">
            사수자리에게 사랑은 늘 솔직한 매력과 새로운 모험으로 가득합니다.
          </span>
          <p className="flex flex-col gap-2 leading-relaxed font-medium text-[#555555]">
            <span>
              내용1내용1내용1내용1내용1내용1내용1내용1내용1내용1내용1내용1내용1
            </span>
            <span>
              내용2내용2내용2내용2내용2내용2내용2내용2내용2내용2내용2내용2내용2
            </span>
            <span>
              내용3내용3내용3내용3내용3내용3내용3내용3내용3내용3내용3내용3내용3
            </span>
          </p>
        </article>
      </main>
    </div>
  );

  // 유료 테마인 경우 PremiumContentGate로 감싸기
  if (isPremium) {
    return (
      <PremiumContentGate
        themeId={currentTheme}
        themeTitle={themeTitle}
        backgroundImage={<Image src={themeImage} alt="Horoscope Theme" fill />}
      >
        <Contents />
      </PremiumContentGate>
    );
  }

  // 무료 테마는 바로 표시
  return <Contents />;
}
