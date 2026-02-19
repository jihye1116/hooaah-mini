import React from 'react';
import { Zap } from 'lucide-react';
import { LineData } from '../types';
import WhiteBox, { SectionTitle, SubTitle } from './WhiteBox';

const RiskSection = ({ data, age }: { data: LineData['risk']; age: number }) => {
  const maxValue = Math.max(...(data.time || []), 100);

  return (
    <div className="space-y-6">
      <WhiteBox>
        <SectionTitle>주의할 점</SectionTitle>
        {/* Bar Chart */}
        <div className="mb-6 h-[180px] w-full px-4">
          <div className="flex h-full items-end justify-between gap-2">
            {data.time?.map((val, idx) => {
              const height = (val / maxValue) * 100;
              const isCurrent = idx === 1;
              const labels = [
                `${age - 5}~${age - 1}`,
                '현재',
                `${age + 1}~${age + 5}`,
                `${age + 6}~${age + 10}`,
              ];
              return (
                <div
                  key={idx}
                  className="flex flex-1 flex-col items-center justify-end"
                >
                  <div
                    className={`w-full max-w-[30px] rounded-t-md transition-all duration-1000 ${isCurrent ? 'bg-[#DA3C49]' : 'bg-[#FCC1B9]'}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="mt-2 text-xs font-medium text-[#424242]">
                    {labels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Level */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-xl bg-[#FFEDE0] px-4 py-2">
            <Zap className="h-5 w-5 text-[#883A2E]" fill="#883A2E" />
            <span className="font-bold text-[#883A2E]">
              {data.time && data.time[1] > 50
                ? data.time[1] > 80
                  ? '높음'
                  : '중간'
                : '낮음'}
            </span>
          </div>
        </div>

        {/* Risk Types */}
        <div className="space-y-4">
          <SubTitle>예상되는 위험 유형</SubTitle>
          {data.type?.map((item, idx) => (
            <div key={idx} className="rounded-lg bg-gray-50 p-3">
              <h5 className="mb-1 font-semibold text-[#111111]">
                {item.title}
              </h5>
              <ul className="text-sm text-[#424242]">
                <li>• {item.point1}</li>
                <li>• {item.point2}</li>
              </ul>
            </div>
          ))}
        </div>
      </WhiteBox>

      <WhiteBox>
        <SectionTitle>조언</SectionTitle>
        <div className="space-y-4">
          {data.advice?.map((item, idx) => (
            <div key={idx}>
              <h5 className="mb-1 font-semibold text-[#111111]">
                {item.title}
              </h5>
              <ul className="text-sm text-[#424242]">
                <li>• {item.point1}</li>
                <li>• {item.point2}</li>
              </ul>
            </div>
          ))}
        </div>
      </WhiteBox>
    </div>
  );
};

export default RiskSection;
