import { cn } from '@sglara/cn';
import { ReactNode } from 'react';

interface TarotSummaryCardProps {
  title: string;
  subtitle: string;
  tags?: string[];
  description: string;
  cards: ReactNode;
  isBlurred: boolean;
  onSeeFullReading?: () => void;
  className?: string;
}

export default function TarotSummaryCard({
  title,
  subtitle,
  tags = [],
  description,
  cards,
  isBlurred,
  onSeeFullReading,
  className,
}: TarotSummaryCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-[20px] bg-white/10 p-5 backdrop-blur-md',
        className,
      )}
    >
      <h2 className="text-center text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-center text-sm font-medium text-white/70">
        {subtitle}
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex justify-center">{cards}</div>

      <div className="mt-6 text-center text-sm leading-relaxed text-white">
        {isBlurred ? (
          <div className="relative">
            <p className="blur-sm select-none">
              {description.slice(0, 50)}...
              <br />
              (Preview of the hidden content)
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={onSeeFullReading}
                className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black shadow-lg hover:bg-gray-100"
              >
                전체 해석 보기
              </button>
            </div>
          </div>
        ) : (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
}
