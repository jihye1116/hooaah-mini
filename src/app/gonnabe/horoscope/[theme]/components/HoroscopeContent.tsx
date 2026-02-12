import HoroscopeFortuneResult from '@/app/gonnabe/horoscope/[theme]/components/HoroscopeFortuneResult';
import HoroscopeUserInfoForm from '@/app/gonnabe/horoscope/[theme]/components/HoroscopeUserInfoForm';
import type { ThemeKey } from '@/app/gonnabe/horoscope/types/fortune';
import Image, { StaticImageData } from 'next/image';
import { Suspense } from 'react';

interface HoroscopeContentProps {
  theme: ThemeKey;
  themeImage: StaticImageData;
  themeTitle: string;
  themeSubject: string;
  name?: string;
  birthDate?: string;
}

export default function HoroscopeContent({
  theme,
  themeImage,
  themeTitle,
  themeSubject,
  name,
  birthDate,
}: HoroscopeContentProps) {
  if (!name || !birthDate) {
    return <HoroscopeUserInfoForm theme={theme} />;
  }

  // 정보 입력 후 운세 내용 표시
  return (
    <div>
      <div className="relative aspect-square w-full">
        <Image src={themeImage} alt="Horoscope Theme" fill sizes="auto" />
      </div>

      <main className="mb-12 flex flex-col p-6">
        <h2 className="font-playfair-display mb-4 leading-8 font-semibold text-[#111111]/50">
          {themeSubject}
        </h2>

        <h1 className="font-playfair-display mb-4 text-[27px] font-bold text-[#333333]">
          {themeTitle}
        </h1>

        <article className="font-plus-jakarta-sans flex flex-col gap-4 rounded-2xl bg-[#F9F9F9] px-5 py-6">
          <Suspense
            fallback={
              <span className="text-lg leading-relaxed font-bold">
                운세를 생성하는 중...
              </span>
            }
          >
            <HoroscopeFortuneResult
              theme={theme}
              name={name}
              birthDate={birthDate}
            />
          </Suspense>
        </article>
      </main>
    </div>
  );
}
