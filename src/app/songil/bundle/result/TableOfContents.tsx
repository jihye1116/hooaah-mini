import React from 'react';

interface TableOfContentsProps {
  lineKeys: string[];
  lineNames: Record<string, string>;
  onSelect: (idx: number) => void;
}

export default function TableOfContents({
  lineKeys,
  lineNames,
  onSelect,
}: TableOfContentsProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F3F1] px-6 pb-[120px]">
      <h2 className="mb-8 text-2xl font-bold text-[#111]">분석할 손금 선택</h2>
      <div className="mb-10 grid w-full max-w-md grid-cols-2 gap-4">
        {lineKeys.map((key, idx) => (
          <button
            key={key}
            onClick={() => onSelect(idx + 1)}
            className="flex flex-col items-center rounded-2xl border-2 border-[#FCC1B9] bg-white px-4 py-8 shadow-md transition-colors hover:bg-[#FFF3F1]"
          >
            <span className="mb-2 text-lg font-bold text-[#F97B68]">
              {lineNames[key] || key}
            </span>
            <span className="text-xs text-[#696969]">정밀 분석</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-[#A0A0A0]">
        원하는 손금을 선택해 상세 분석을 확인하세요.
      </p>
    </div>
  );
}
