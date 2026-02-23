import ResultTarotCard from '@/app/gonnabe/tarot/components/ResultTarotCard';
import type { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import BackgroundStar from '@/assets/icons/gonnabe/tarot/background_star.svg';
import ThemeIcon from '@/assets/icons/gonnabe/tarot/theme_icon.svg';
import Image from 'next/image';

interface TarotSummaryCardProps {
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  cards: TarotCardsApiItem[];
}

export default function TarotSummaryCard({
  title,
  subtitle,
  tags,
  description,
  cards,
}: TarotSummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/15 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-full w-full">
          <Image
            src={BackgroundStar}
            alt="Background Star"
            fill
            sizes="auto"
            loading="eager"
            className="object-cover object-center"
          />
        </div>
      </div>

      <div className="z-10 flex w-full flex-col items-center px-6 py-10">
        <Image src={ThemeIcon} alt="Theme Icon" width={60} className="mb-5" />

        <h3 className="font-playfair-display mb-3 text-center text-xl font-semibold text-white">
          {title}
        </h3>

        <p className="font-plus-jakarta-sans mb-8 text-center text-xs font-light text-white/70">
          {subtitle}
        </p>

        <div className="flex grow flex-wrap justify-center gap-4">
          {cards.map((card) => (
            <ResultTarotCard
              key={card._id}
              image={card.cardThumbnail ?? card.image}
              name={card.cardName}
              isReversed={card.reversed}
              width={130}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="font-plus-jakarta-sans rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="font-plus-jakarta-sans mt-6 text-xs leading-relaxed text-white/80">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
