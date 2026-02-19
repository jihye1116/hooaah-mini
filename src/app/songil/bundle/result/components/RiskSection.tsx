import React from 'react';
import { Zap } from 'lucide-react';
import riskGraphLine from '@/assets/images/songil/risk-graph-line.svg';
import { LineData } from '../types';
import WhiteBox, { SectionTitle, SubTitle } from './WhiteBox';
import { PremiumData } from '../premium';

const RiskSection = ({
  data,
  age,
  premiumData,
}: {
  data: LineData['risk'];
  age: number;
  premiumData: PremiumData;
}) => {
  const maxValue = Math.max(...(data.time || []), 100);
  const currentValue = data.time?.[1] ?? 0;
  const levelText =
    currentValue > 80
      ? '높은 수준'
      : currentValue > 50
        ? '중간 수준'
        : '낮은 수준';
  console.log('RiskSection Rendered with data:', data, 'age:', age);

  return (
    <div className="space-y-6">
      <WhiteBox>
        <SectionTitle>{premiumData.safety_title}</SectionTitle>
        {/* Bar Chart */}
        <div className="mb-6 flex w-full justify-center">
          <div className="relative h-[184px] w-[310px]">
            <div className="pointer-events-none absolute top-[36px] left-[39px] z-0 h-[122px] w-[231px]">
              <div className="absolute top-0 left-0 w-full border-t border-dashed border-[#E3E3E6]" />
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 border-t border-dashed border-[#E3E3E6]" />
              <div className="absolute bottom-0 left-0 w-full border-t border-dashed border-[#E3E3E6]" />
            </div>
            <div className="absolute top-[36px] right-0 left-0 z-10 flex h-[122px] items-end justify-between px-[40px]">
              {data.time?.map((val, idx) => {
                const height = (val / maxValue) * 100;
                const isCurrent = idx === 1;
                return (
                  <div
                    key={idx}
                    className="flex w-[36px] flex-col items-center gap-1"
                  >
                    <div className="flex h-[122px] w-full items-end justify-center">
                      <div
                        className={`w-[20px] rounded-t-[4px] transition-all duration-1000 ${isCurrent ? '' : 'bg-[#FCC1B9]'}`}
                        style={
                          isCurrent
                            ? {
                                height: `${height}%`,
                                backgroundImage:
                                  'linear-gradient(180deg, rgba(218, 60, 73, 1) 0%, rgba(255, 120, 102, 1) 100%)',
                              }
                            : { height: `${height}%` }
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-[166px] right-0 left-0 z-10 flex items-start justify-between px-[40px]">
              {data.time?.map((_, idx) => {
                const labels = [
                  `${age - 5}~${age - 1}`,
                  '현재',
                  `${age + 1}~${age + 5}`,
                  `${age + 6}~${age + 10}`,
                ];
                return (
                  <span
                    key={idx}
                    className="flex w-[36px] justify-center text-xs font-medium text-[#424242]"
                  >
                    {labels[idx]}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Risk Level */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-[12px] bg-[#FEF3F1] px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F97B68]">
              <Zap className="h-4 w-4 text-white" fill="white" />
            </span>
            <span className="text-[16px] font-semibold text-[#461008]">
              {levelText}
            </span>
          </div>
        </div>

        {/* Risk Types */}
        <div className="space-y-4">
          <SubTitle>{premiumData.risk_type}</SubTitle>
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
        <SectionTitle>{premiumData.advice}</SectionTitle>
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
      <div className="h-10"></div>
    </div>
  );
};

export default RiskSection;
