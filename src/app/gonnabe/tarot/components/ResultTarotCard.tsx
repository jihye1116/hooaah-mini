import { cn } from '@sglara/cn';
import Image from 'next/image';

interface ResultTarotCardProps {
  imageUrl: string;
  name?: string;
  isReversed?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  labelPosition?: 'top' | 'bottom';
}

export default function ResultTarotCard({
  imageUrl,
  name,
  isReversed = false,
  width = 120,
  height = 180,
  className,
  labelPosition = 'bottom',
}: ResultTarotCardProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {labelPosition === 'top' && name && (
        <span className="text-sm font-medium text-white">{name}</span>
      )}
      <div
        className={cn('relative overflow-hidden rounded-lg shadow-lg')}
        style={{ width, height }}
      >
        <Image
          src={imageUrl}
          alt={name || 'Tarot Card'}
          fill
          className={cn('object-cover', isReversed && 'rotate-180')}
        />
      </div>
      {labelPosition === 'bottom' && name && (
        <span className="text-sm font-medium text-white">{name}</span>
      )}
    </div>
  );
}
