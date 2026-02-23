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
  onClick?: () => void;
}

export default function ResultTarotCard({
  imageUrl,
  name,
  isReversed = false,
  width = 120,
  height = 180,
  className,
  labelPosition = 'bottom',
  onClick,
}: ResultTarotCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 rounded-2xl bg-gray-400 px-3 pb-3',
        onClick && 'cursor-pointer hover:opacity-90',
        className,
      )}
    >
      {labelPosition === 'top' && name && (
        <span className="pt-2 text-sm font-medium text-white">{name}</span>
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
