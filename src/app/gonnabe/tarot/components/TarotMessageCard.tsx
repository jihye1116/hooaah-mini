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
  className?: string;
}

export default function TarotMessageCard({
  title,
  subtitle,
  description,
  imageUrl,
  name,
  tags,
  isReversed,
  className,
}: TarotMessageCardProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-[20px] bg-white/10 p-5 backdrop-blur-md',
        className,
      )}
    >
      <h3 className="mb-2 text-center text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="mb-6 text-center text-sm font-medium text-white/70">
        {subtitle}
      </p>

      {imageUrl && (
        <div className="mb-6 flex flex-col items-center">
          <div className="relative h-40 w-28 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={imageUrl}
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

      <p className="text-center text-sm leading-relaxed text-white">
        {description}
      </p>
    </div>
  );
}
