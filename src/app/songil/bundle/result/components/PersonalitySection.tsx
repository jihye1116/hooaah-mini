import React from 'react';
import Image from 'next/image';
import { LineData } from '../types';
import WhiteBox, { SectionTitle } from './WhiteBox';
import destinyScoreIcon from '@/assets/icons/songil/destiny_score.svg';
import emotionScoreIcon from '@/assets/icons/songil/emotion_score.svg';
import intelligenceScoreIcon from '@/assets/icons/songil/intelligence_score.svg';
import marriageScoreIcon from '@/assets/icons/songil/marriage_score.svg';
import wealthScoreIcon from '@/assets/icons/songil/wealth_score.svg';
import sunScoreIcon from '@/assets/icons/songil/sun_score.svg';
import { PremiumData } from '../premium';

const PersonalitySection = ({
  data,
  lineName,
  premiumData,
}: {
  data: LineData['personality'];
  lineName: string;
  premiumData: PremiumData;
}) => {
  const score = Number(data.score) || 66;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-base font-semibold text-[#424242]">
          {premiumData.character}
        </h3>
        <div className="mt-2 inline-block rounded-xl bg-white px-6 py-3 text-xl font-bold text-[#883A2E]">
          {data.type}
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center py-6">
        <ScoreGauge score={score} lineName={lineName} />
      </div>

      <WhiteBox>
        <p className="text-sm leading-relaxed font-medium text-[#111111]">
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
          <SectionTitle>{premiumData.skill}</SectionTitle>
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
          <SectionTitle>{premiumData.will}</SectionTitle>
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
          <SectionTitle>{premiumData.sense}</SectionTitle>
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

const ScoreGauge = ({ score = 57, lineName = '' }) => {
  // --- 설정값 ---
  const radius = 45; // 반지름
  const strokeWidth = 8; // 선 두께
  const gapDegree = 90; // 하단 빈 공간 각도 (직각)
  // ----------------

  // lineName에 따라 아이콘 선택
  const getIconByLineName = (name: string) => {
    const iconMap: { [key: string]: string } = {
      운명선: destinyScoreIcon,
      감정선: emotionScoreIcon,
      지능선: intelligenceScoreIcon,
      결혼선: marriageScoreIcon,
      부의선: wealthScoreIcon,
      태양선: sunScoreIcon,
    };
    return iconMap[name] || destinyScoreIcon;
  };

  const circumference = 2 * Math.PI * radius; // 원의 전체 둘레 (약 251.32)
  const totalPathDegree = 360 - gapDegree; // 실제 게이지가 그려지는 각도 (270도)

  // 실제 게이지의 총 길이 (dasharray의 첫 번째 값)
  const totalLength = circumference * (totalPathDegree / 360);

  // 현재 점수에 따른 진행 길이
  const progress = (score / 100) * totalLength;

  // 시작점을 맞추기 위한 회전 각도 계산
  // 3시 방향(0도) 기준, 하단 90도를 비우려면 시작점이 135도(90+45)여야 함.
  // SVG rotate는 시계방향이므로 -225도(-180-45) 회전하여 시작점을 맞춤.
  const rotation = -225;

  return (
    <div className="flex justify-center py-6">
      {/* 컨테이너 크기 설정 (선 두께 고려) */}
      <div className="relative flex h-[180px] w-[180px] items-center justify-center">
        <svg
          className="h-full w-full transform"
          style={{ transform: `rotate(${rotation}deg)` }} // 계산된 회전 각도 적용
          viewBox="0 0 100 100"
        >
          <defs>
            {/* 그라데이션 정의 수정:
              - 방향: 수평 (x1=0% -> x2=100%)
              - 색상: 요청하신 두 가지 색상 적용
            */}
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#F97B68" /> {/* 끝: 코랄/레드 */}
              <stop offset="100%" stopColor="#3680FF" /> {/* 시작: 파랑 */}
            </linearGradient>
          </defs>

          {/* 배경 트랙 (연한 회색) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#E5E7EB" // Tailwind gray-200
            strokeWidth={strokeWidth}
            // 트랙도 totalLength만큼만 그려서 하단을 비움
            strokeDasharray={`${totalLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* 실제 점수 바 (그라데이션 적용) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="url(#gaugeGradient)" // 위에서 정의한 그라데이션 ID 사용
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            // 점수 변경 시 부드러운 애니메이션
            style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
          />
        </svg>

        {/* 중앙 컨텐츠 영역 (아이콘 및 점수) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          {/* 아이콘 영역: lineName에 따라 다른 아이콘 표시 */}
          <div className="mb-1 flex h-8 w-8 items-center justify-center">
            <Image
              src={getIconByLineName(lineName)}
              alt={lineName}
              width={36}
              height={36}
            />
          </div>

          {/* 점수 텍스트 */}
          <div className="flex items-center">
            <span className="text-4xl leading-none font-bold text-[#111111]">
              {score}
            </span>
            <span className="font-meduim ml-1 text-xl leading-none text-[#424242]">
              점
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
