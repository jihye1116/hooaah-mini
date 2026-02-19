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
  const t = { age: '세' };
  // 그래프 값 파싱 (기본값 66)
  const graphValues = Array.from({ length: 5 }).map((_, i) => {
    const val = parseFloat(String(data.time?.[i]));
    return isNaN(val) ? 66 : val;
  });

  return (
    <div className="space-y-6">
      <WhiteBox>
        <SectionTitle>현재와 미래</SectionTitle>
        <p className="mb-6 text-sm text-[#424242]">
          최근 5년간의 흐름을 분석합니다.
        </p>

        <div className="relative mt-5 h-[200px] pr-[40px]">
          {/* Y축 점선 배경 */}
          <div className="absolute top-0 right-0 left-0 flex h-[140px] w-full flex-col justify-between">
            {[100, 50, 0].map((val) => (
              <div key={`y-axis-${val}`} className="flex items-center">
                <div className="w-[15px]" />
                <span className="w-[30px] text-[12px] font-semibold text-[#B5B5B5]">
                  {val}
                </span>
                <div className="w-[15px]" />
                <div className="flex-1 border-b-2 border-dashed border-[#E3E3E6]" />
              </div>
            ))}
          </div>

          {/* 그래프 캔버스 영역 */}
          <div className="absolute top-[10px] right-[10px] left-[70px] h-[140px]">
            <LineGraph values={graphValues} />
          </div>

          {/* X축 레이블 */}
          <div className="absolute right-0 bottom-0 left-[60px] flex justify-between">
            {[-2, -1, 0, 1, 2].map((offset) => (
              <span
                key={`x-axis-${offset}`}
                className="text-[14px] text-[#424242]"
              >
                {age + offset} {t.age}
              </span>
            ))}
          </div>
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

const LineGraph = ({ values }: { values: number[] }) => {
  const width = 400;
  const height = 140;
  const segmentWidth = width / (values.length - 1);

  // 포인트 좌표 계산 (0 ~ 100 값을 높이 140px 비율에 맞게 변환)
  const points = values.map((val, i) => ({
    x: i * segmentWidth,
    y: height - (val / 100) * height,
  }));

  // 베지어 곡선 Path 생성
  let pathD = `M ${points[0].x} ${points[0].y}`;
  let fillPathD = `M ${points[0].x} ${height} L ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const controlX1 = p1.x + segmentWidth * 0.35;
    const controlX2 = p2.x - segmentWidth * 0.35;

    const curve = ` C ${controlX1} ${p1.y}, ${controlX2} ${p2.y}, ${p2.x} ${p2.y}`;
    pathD += curve;
    fillPathD += curve;
  }

  fillPathD += ` L ${points[points.length - 1].x} ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full overflow-visible"
    >
      <defs>
        <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCC1B9" stopOpacity="1" />
          <stop offset="100%" stopColor="#FEF3F1" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 그라데이션 배경 */}
      <path d={fillPathD} fill="url(#graphGradient)" />

      {/* 꺾은선 (베지어) */}
      <path d={pathD} fill="none" stroke="#F97B68" strokeWidth="1.5" />

      {/* 각 포인트 점 (원) */}
      {points.map((p, i) => (
        <g key={`point-${i}`}>
          <circle cx={p.x} cy={p.y} r="4" fill="#FCC1B9" />
          <circle
            cx={p.x}
            cy={p.y}
            r="2"
            fill={i === 2 ? '#F97B68' : '#FEF3F1'}
          />
        </g>
      ))}

      {/* 중앙 기준점(현재 나이) 말풍선 */}
      <g transform={`translate(${points[2].x}, ${points[2].y - 20})`}>
        {/* 말풍선 둥근 사각형 */}
        <rect x="-35" y="-25" width="70" height="25" rx="6" fill="#FCC1B9" />
        {/* 말풍선 아래 역삼각형 */}
        <path d="M -4 0 L 0 6 L 4 0 Z" fill="#FCC1B9" />
        {/* 텍스트 */}
        <text
          x="0"
          y="-8"
          textAnchor="middle"
          fill="#883A2E"
          fontSize="12"
          fontWeight="600"
        >
          {Math.round(values[2])} 점
        </text>
      </g>
    </svg>
  );
};
