import React from 'react';
import { LineData } from '../types';
import WhiteBox, { PointList, SectionTitle } from './WhiteBox';

const PresentSection = ({
  data,
  age,
  total,
}: {
  data: LineData['present'];
  age: number;
  total: LineData['total'];
}) => {
  return (
    <div className="space-y-6">
      <WhiteBox>
        <SectionTitle>현재와 미래</SectionTitle>
        <p className="mb-6 text-sm text-[#424242]">
          최근 5년간의 흐름을 분석합니다.
        </p>

        {/* Line Graph (Simplified) */}
        <div className="relative mb-8 h-[140px] w-full">
          <div className="absolute inset-0 flex items-end justify-between px-2">
            {data.time?.map((val, idx) => {
              const height = (val / 100) * 100;
              const isCurrent = idx === 2;
              return (
                <div
                  key={idx}
                  className="group relative flex h-full flex-col justify-end"
                >
                  {/* Point */}
                  <div
                    className={`relative z-10 h-2 w-2 rounded-full ${isCurrent ? 'h-3 w-3 bg-[#F97B68]' : 'bg-[#FCC1B9]'}`}
                    style={{ marginBottom: `${height}%` }}
                  >
                    {isCurrent && (
                      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#F97B68] px-2 py-1 text-xs font-bold text-white">
                        {val}점
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <span className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 text-xs text-[#696969]">
                    {age - 2 + idx}세
                  </span>
                </div>
              );
            })}
          </div>
          {/* Connecting Line (SVG) */}
          <svg className="absolute inset-0 h-full w-full overflow-visible">
            <polyline
              fill="none"
              stroke="#F97B68"
              strokeWidth="2"
              points={data.time
                ?.map((val, idx) => {
                  const x = (idx / (data.time.length - 1)) * 100;
                  const y = 100 - val;
                  return `${x}%,${y}%`;
                })
                .join(' ')}
            />
          </svg>
        </div>

        <div className="mt-10 space-y-4">
          {data.flow?.map((item, idx) => (
            <div key={idx}>
              <h5 className="font-semibold text-[#111111]">{item.title}</h5>
              <ul className="text-sm text-[#424242]">
                <li>• {item.point1}</li>
                <li>• {item.point2}</li>
              </ul>
            </div>
          ))}
        </div>
      </WhiteBox>

      <WhiteBox>
        <SectionTitle>미래 운세</SectionTitle>
        <div
          className={`mb-4 inline-block rounded-xl px-4 py-2 font-bold ${data.fortune.evaluation === 'positive' ? 'bg-[#EBF7E9] text-[#2E7D32]' : 'bg-[#E3E3E6] text-[#424242]'}`}
        >
          {data.fortune.evaluation === 'positive' ? '긍정적 흐름' : '보통 흐름'}
        </div>
        <PointList points={data.fortune.point} />
        <div className="my-6 h-[1px] w-full bg-[#E3E3E6]" />
        <h5 className="mb-2 font-semibold text-[#111111]">
          {data.fortune.advice.title}
        </h5>
        <p className="text-sm text-[#696969]">
          {data.fortune.advice.description}
        </p>
      </WhiteBox>

      <WhiteBox>
        <SectionTitle>주의사항</SectionTitle>
        <div className="mb-4 inline-block rounded-xl bg-[#FFEDE0] px-4 py-2 font-bold text-[#883A2E]">
          {data.risk.title}
        </div>
        <PointList points={data.risk.point} />
      </WhiteBox>

      {/* Core Message (Total) */}
      <div className="rounded-[20px] bg-gradient-to-r from-[#3680FF] via-[#BA86F4] to-[#F9959D] p-[2px]">
        <WhiteBox className="h-full border-none !bg-white">
          <SectionTitle>핵심 메시지</SectionTitle>
          <p className="mb-6 text-center text-lg font-bold text-[#111111]">
            &quot;{total.core}&quot;
          </p>
          <div className="space-y-4">
            {total.point.map((p, idx) => (
              <div key={idx}>
                <h5 className="font-semibold text-[#111111]">{p.title}</h5>
                <p className="text-sm text-[#424242]">{p.description}</p>
              </div>
            ))}
          </div>
        </WhiteBox>
      </div>
    </div>
  );
};

export default PresentSection;
