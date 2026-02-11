import { cn } from '@sglara/cn';
import { ArrowLeft } from 'lucide-react';

interface AppBarProps {
  text: string;
  transparent?: boolean;
}

export const AppBar = ({ text, transparent }: AppBarProps) => {
  return (
    <div className="flex h-12 items-center gap-2.5 px-5 py-1.5">
      <button className="flex h-6 w-6 items-center justify-center">
        <ArrowLeft
          className={cn(
            'h-4 w-4 text-[#E3E3E6]',
            transparent && 'text-[#A4ABBB]',
          )}
        />
      </button>
      <p
        className={cn(
          'text-[14px] font-semibold tracking-[-0.336px] text-[#E3E3E6]',
          transparent && 'text-[#E3E3E6]',
        )}
      >
        {text}
      </p>
    </div>
  );
};
