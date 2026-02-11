import { themeImages } from '@/app/gonnabe/horoscope/constants';
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

  return (
    <div>
      <div className="relative aspect-square w-full">
        <Image src={themeImage} alt="Horoscope Theme" fill />
      </div>

      <h1>Horoscope Theme Page: {theme}</h1>
    </div>
  );
}
