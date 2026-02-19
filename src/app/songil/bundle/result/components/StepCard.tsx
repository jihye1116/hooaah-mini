import React from 'react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
}

export default function StepCard({
  stepNumber,
  title,
  description,
}: StepCardProps) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-2 rounded-[14px] p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0px 0px 10px 0px rgba(232, 175, 175, 0.25)',
        width: '319px',
        margin: '0 auto',
      }}
    >
      {/* Step Number and Title */}
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <div
          className="text-center text-base font-medium"
          style={{
            background:
              'linear-gradient(54deg, rgba(54, 128, 255, 1) 39%, rgba(186, 134, 244, 1) 73%, rgba(249, 149, 157, 1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {stepNumber}
        </div>
        <h2
          className="text-center text-[36px] leading-tight font-bold"
          style={{ color: '#3680FF' }}
        >
          {title}
        </h2>
      </div>

      {/* Description */}
      <div className="flex w-full flex-col items-center justify-center">
        <p
          className="text-center text-base leading-[1.4] font-medium"
          style={{ color: '#424242' }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
