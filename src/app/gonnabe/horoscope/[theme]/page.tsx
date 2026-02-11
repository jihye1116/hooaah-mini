import {
  themeImages,
  themeSubjects,
  themeTitles,
} from '@/app/gonnabe/horoscope/constants';
import { FortuneTheme } from '@/app/gonnabe/horoscope/types/fortune';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function HoroscopeThemePage({
  params,
}: {
  params: Promise<{
    theme: Exclude<
      (typeof FortuneTheme)[keyof typeof FortuneTheme],
      typeof FortuneTheme.TODAY
    >;
  }>;
}) {
  const { theme } = await params;

  const validThemes = Object.values(FortuneTheme);

  if (!validThemes.includes(theme)) {
    notFound();
  }

  const themeImage = themeImages[theme];
  const themeTitle = themeTitles[theme];
  const themeSubject = themeSubjects[theme];

  return (
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
}
