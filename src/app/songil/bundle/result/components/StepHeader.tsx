import React from 'react';

interface StepHeaderProps {
  step: string;
  title: string;
  description?: string;
}

export default function StepHeader({
  step,
  title,
  description,
}: StepHeaderProps) {
  return (
    <div className="flex flex-col items-center pb-6">
      <div className="flex w-full items-center justify-center bg-[#424242] py-3">
        <h2 className="text-lg font-bold text-white">
          {step}: {title}
        </h2>
      </div>
      {description && (
        <p className="mt-4 px-5 text-center text-sm leading-relaxed text-[#696969] break-keep">
          {description}
        </p>
      )}
    </div>
  );
}
