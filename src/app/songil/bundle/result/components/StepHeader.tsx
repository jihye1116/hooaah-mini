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
    <div className="flex flex-col items-center gap-2 pt-4 pb-6 text-center">
      <span className="text-sm font-bold tracking-widest text-[#FF8B7D] uppercase">
        {step}
      </span>
      <h2 className="text-2xl leading-tight font-bold break-keep text-[#111111]">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm leading-relaxed break-keep text-[#696969]">
          {description}
        </p>
      )}
    </div>
  );
}
