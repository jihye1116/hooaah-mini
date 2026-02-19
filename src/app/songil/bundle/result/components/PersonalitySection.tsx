import React from 'react';
import { LineData } from '../types';
import WhiteBox, { SectionTitle } from './WhiteBox';

const PersonalitySection = ({
  data,
  lineName,
}: {
  data: LineData['personality'];
  lineName: string;
}) => {
  const score = Number(data.score) || 66;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-base font-semibold text-[#424242]">
          {lineName}으로 보는 성향
        </h3>
        <div className="mt-2 inline-block rounded-xl bg-white px-6 py-3 text-xl font-bold text-[#883A2E] shadow-sm">
          {data.type}
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center py-6">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-[#F97B68]/20">
          <svg
            className="absolute top-0 left-0 h-full w-full -rotate-90 transform"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="44" // (100 - border*2)/2 roughly
              fill="transparent"
              stroke="#F97B68"
              strokeWidth="12"
              strokeDasharray={`${(score / 100) * 276} 276`} // 2 * pi * 44 ≈ 276
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#111111]">{score}</div>
            <div className="text-sm font-semibold text-[#424242]">점</div>
          </div>
        </div>
      </div>

      <WhiteBox>
        <p className="text-sm font-medium leading-relaxed text-[#111111]">
          {data.description}
        </p>
      </WhiteBox>

      {/* Features */}
      <WhiteBox>
        <SectionTitle>{data.type} 특징</SectionTitle>
        <div className="space-y-4">
          {data.point?.map((p, idx) => (
            <div key={idx}>
              <h4 className="mb-1 text-base font-semibold text-[#111111]">
                {p.title}
              </h4>
              <p className="text-sm text-[#424242]">{p.description}</p>
            </div>
          ))}
        </div>
      </WhiteBox>

      {/* Details (Skill/Will/Sense) */}
      {data.skill && (
        <WhiteBox>
          <SectionTitle>재능과 적성</SectionTitle>
          <div className="mb-3 inline-block rounded-lg bg-[#FEF3F1] px-3 py-1 text-base font-semibold text-[#883A2E]">
            {data.skill.level === 'high' || data.skill.level === 'very high'
              ? '탁월함'
              : '보통'}
          </div>
          <p className="mb-4 text-sm text-[#696969]">
            {data.skill.description}
          </p>
          <div className="my-4 h-[1px] w-full bg-[#E3E3E6]" />
          <h4 className="mb-1 text-base font-semibold text-[#111111]">
            {data.skill.preference}
          </h4>
          <p className="text-sm text-[#696969]">{data.skill.methods}</p>
        </WhiteBox>
      )}

      {data.will && (
        <WhiteBox>
          <SectionTitle>의지와 관계</SectionTitle>
          <div className="mb-3 inline-block rounded-lg bg-[#FEF3F1] px-3 py-1 text-base font-semibold text-[#883A2E]">
            {data.will.level === 'high' || data.will.level === 'very high'
              ? '강함'
              : '보통'}
          </div>
          <p className="mb-4 text-sm text-[#696969]">{data.will.description}</p>
          <div className="my-4 h-[1px] w-full bg-[#E3E3E6]" />
          <h4 className="mb-1 text-base font-semibold text-[#111111]">
            {data.will.preference}
          </h4>
          <p className="text-sm text-[#696969]">{data.will.methods}</p>
        </WhiteBox>
      )}

      {data.sense && (
        <WhiteBox>
          <SectionTitle>감각과 판단</SectionTitle>
          <div className="mb-3 inline-block rounded-lg bg-[#FEF3F1] px-3 py-1 text-base font-semibold text-[#883A2E]">
            {data.sense.level === 'high' || data.sense.level === 'very high'
              ? '뛰어남'
              : '보통'}
          </div>
          <p className="text-sm text-[#696969]">{data.sense.description}</p>
        </WhiteBox>
      )}
    </div>
  );
};

export default PersonalitySection;
