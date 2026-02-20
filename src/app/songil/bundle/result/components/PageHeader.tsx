import React from 'react';
import { Home } from 'lucide-react';

interface PageHeaderProps {
  stepNumber: number;
  title: string;
  description?: string;
  onBack: () => void;
  hideBackButton?: boolean;
}

export default function PageHeader({
  stepNumber,
  title,
  description,
  onBack,
  hideBackButton,
}: PageHeaderProps) {
  return (
    <div className="-mx-5 flex flex-col gap-4 bg-white pt-6">
      {/* Back Button */}
      {!hideBackButton && (
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2.5 text-xl font-bold"
        >
          <Home className="h-6 w-6" />
          목록 페이지로 이동
        </button>
      )}
      {/* Gradient Header Box */}
      <div
        style={{
          background:
            'linear-gradient(180deg, rgba(54, 128, 255, 1) 0%, rgba(186, 134, 244, 1) 50%, rgba(249, 149, 157, 1) 100%)',
        }}
        className="flex w-full justify-center px-8"
      >
        <div
          className="my-15 flex w-fit flex-col items-center justify-center gap-2 rounded-[14px] bg-[rgba(255,255,255,0.5)] px-2 py-10"
          // style={{ background: 'rgba(255, 255, 255, 0.70)' }}
        >
          <div className="font-medium text-[#3680FF] opacity-90">
            {String(stepNumber)}
          </div>
          <h1 className="text-center text-[36px] leading-tight font-bold text-[#3680FF]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-center text-base leading-[1.4] font-medium text-[#424242]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
