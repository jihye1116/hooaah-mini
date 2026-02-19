import React from 'react';
import { LineData } from '../types';
import WhiteBox, { SectionTitle } from './WhiteBox';

const ChronologySection = ({
  data,
  age,
}: {
  data: LineData['flow'];
  age: number;
}) => {
  return (
    <div className="space-y-6">
      <WhiteBox>
        <SectionTitle>흐름 분석</SectionTitle>
        <div className="relative space-y-8 pl-4">
          {/* Vertical Line */}
          <div className="absolute top-2 bottom-2 left-[19px] w-[2px] bg-[#E3E3E6]" />

          {data.time?.map((t, idx) => {
            const isCurrent = idx === 1; // Assuming 2nd item is present based on logic
            return (
              <div key={idx} className="relative flex gap-4">
                <div className="relative z-10 flex h-[40px] flex-col items-center justify-center">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${isCurrent ? 'bg-[#FCC1B9]' : 'bg-[#FEF3F1]'}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${isCurrent ? 'bg-[#F97B68]' : 'bg-[#FCC1B9]'}`}
                    />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div
                    className={`mb-2 inline-block rounded-lg px-3 py-1 text-sm font-semibold ${isCurrent ? 'bg-[#FCC1B9] text-[#461008]' : 'bg-[#FEF3F1] text-[#883A2E]'}`}
                  >
                    {t.age}
                  </div>
                  <p className="text-sm leading-relaxed text-[#424242]">
                    {t.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </WhiteBox>

      {data.prime && (
        <WhiteBox>
          <SectionTitle>{data.prime.title}</SectionTitle>
          <div className="mb-3 inline-block rounded-lg bg-[#FEF3F1] px-3 py-1 text-base font-semibold text-[#883A2E]">
            {data.prime.age}세 무렵
          </div>
          <p className="text-sm leading-relaxed text-[#696969]">
            {data.prime.description}
          </p>
        </WhiteBox>
      )}

      <WhiteBox>
        <SectionTitle>흐름 요약</SectionTitle>
        <p className="text-sm leading-relaxed text-[#696969]">{data.total}</p>
      </WhiteBox>
    </div>
  );
};

export default ChronologySection;
