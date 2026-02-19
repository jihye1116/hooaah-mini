import React from 'react';
import { LineData } from '../types';
import WhiteBox, { SectionTitle } from './WhiteBox';

const ChanceSection = ({
  data,
  age,
}: {
  data: LineData['chance'];
  age: number;
}) => {
  return (
    <div className="space-y-6">
      <WhiteBox>
        <SectionTitle>기회의 시기</SectionTitle>
        <div className="relative space-y-8 pl-4">
          <div className="absolute top-2 bottom-2 left-[23px] w-[2px] bg-[#E3E3E6]" />
          {data.years?.map((year, idx) => (
            <div key={idx} className="relative flex gap-4">
              <div className="relative z-10 flex h-[40px] flex-col items-center justify-center">
                <div className="flex h-6 w-6 items-center justify-start bg-white">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FEF3F1]">
                    <div className="h-2 w-2 rounded-full bg-[#FCC1B9]" />
                  </div>
                </div>
              </div>
              <div className="flex-1 pt-1">
                <div className="mb-2 inline-block rounded-lg bg-[#FEF3F1] px-3 py-1 text-sm font-semibold text-[#883A2E]">
                  {year.age} ({age + idx}세)
                </div>
                <ul className="space-y-1">
                  {year.point.map((p, pIdx) => (
                    <li key={pIdx} className="text-sm text-[#424242]">
                      • {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </WhiteBox>

      <WhiteBox>
        <SectionTitle>투자 조언</SectionTitle>
        <div className="mb-4 inline-block rounded-xl bg-[#FEF3F1] px-4 py-2 font-bold text-[#883A2E]">
          {data.investment.month1}월, {data.investment.month2}월이 좋아요
        </div>
        <p className="mb-6 text-sm leading-relaxed text-[#696969]">
          {data.investment.description}
        </p>
        <div className="h-[1px] w-full bg-[#E3E3E6]" />
        <div className="mt-6 space-y-4">
          {data.investment.methods.map((method, idx) => (
            <div key={idx}>
              <h5 className="mb-1 font-semibold text-[#111111]">
                {method.asset}
              </h5>
              <p className="text-sm text-[#424242]">{method.description}</p>
            </div>
          ))}
        </div>
      </WhiteBox>
    </div>
  );
};

export default ChanceSection;
