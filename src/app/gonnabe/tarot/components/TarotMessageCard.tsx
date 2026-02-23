import ThemeIcon from '@/assets/icons/gonnabe/tarot/theme_icon.svg';
import { cn } from '@sglara/cn';
import Image from 'next/image';

interface TarotMessageCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  name?: string;
  tags?: string[];
  isReversed?: boolean;
}

export default function TarotMessageCard({
  title,
  subtitle,
  description,
  imageUrl,
  name,
  tags,
  isReversed,
}: TarotMessageCardProps) {
  return (
    <div className="flex w-full flex-col items-center rounded-3xl bg-white/15 p-6 backdrop-blur-md">
      <Image src={ThemeIcon} alt="Theme Icon" width={60} className="mb-5" />

      <h3 className="font-playfair-display mb-3 text-center text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="font-plus-jakarta-sans mb-6 text-center text-xs font-light text-white/70">
        {subtitle}
      </p>

      {imageUrl && (
        <div className="mb-6 flex flex-col items-center">
          <div className="relative h-40 w-28 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={ThemeIcon}
              alt={name || 'Tarot Card'}
              fill
              className={cn('object-cover', isReversed && 'rotate-180')}
            />
          </div>
          {name && (
            <span className="mt-2 text-sm font-medium text-white">{name}</span>
          )}
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="font-plus-jakarta-sans text-xs leading-relaxed text-white/80">
        {description}
      </p>
    </div>
  );
}
