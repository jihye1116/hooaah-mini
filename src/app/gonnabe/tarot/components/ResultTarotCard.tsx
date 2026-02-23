import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import { cn } from '@sglara/cn';
import Image from 'next/image';

interface ResultTarotCardProps {
  image: string;
  name: string;
  isReversed: boolean;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export default function ResultTarotCard({
  image,
  name,
  isReversed = false,
  width,
  height,
  onClick,
}: ResultTarotCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 rounded-xl bg-gray-400 p-2',
        onClick && 'cursor-pointer hover:opacity-90',
      )}
    >
      <div
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
        className={cn('relative overflow-hidden rounded-[10px]')}
      >
        <Image
          src={`${TAROT_S3_BASE_URL}/${image}.png`}
          alt={name || 'Tarot Card'}
          fill
          sizes="auto"
          loading="eager"
          className={cn('object-cover', isReversed && 'rotate-180')}
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <span
          style={{ width: width ? `${width}px` : undefined }}
          className="font-playfair-display text-center text-xs leading-tight font-bold text-white"
        >
          {name}
        </span>
      </div>
    </div>
  );
}
