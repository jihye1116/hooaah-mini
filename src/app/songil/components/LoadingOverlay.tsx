'use client';

import React, { useState, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import loadingAnimation from '@/lotties/photo-analysis.json';

interface LoadingOverlayProps {
  isLoading: boolean;
  lottieData?: Record<string, unknown>;
}

// 📌 체크 표시가 시작되는 지점을 설정 (0.85 = 전체 애니메이션의 85% 지점부터 체크마크라고 가정)
// 만약 숫자가 너무 빨리 100이 되거나, 너무 늦게 사라지면 이 숫자를 조절하세요 (0.7 ~ 0.9 사이)
const CHECKMARK_START_RATIO = 0.8;

export default function LoadingOverlay({
  isLoading,
  lottieData = loadingAnimation as Record<string, unknown>,
}: LoadingOverlayProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [progress, setProgress] = useState(0);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[5px]" />

      <div className="relative flex items-center justify-center">
        <div style={{ width: 150, height: 150 }}>
          <Lottie
            lottieRef={lottieRef}
            animationData={lottieData}
            loop={false}
            autoplay={true}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onEnterFrame={(e: any) => {
              if (e && e.totalTime > 0) {
                // 현재 진행률 (0.0 ~ 1.0)
                const currentRatio = e.currentTime / e.totalTime;

                // 📌 비율 재계산:
                // 전체 시간이 아니라 "체크마크 시작 전(0.85)"까지만 0~100%로 매핑
                const adjustedPercent =
                  (currentRatio / CHECKMARK_START_RATIO) * 100;

                // 100%를 넘어가면 100으로 고정 (이때 opacity 조건에 의해 숫자는 사라짐)
                const finalProgress =
                  adjustedPercent >= 100 ? 100 : Math.round(adjustedPercent);

                setProgress(finalProgress);
              }
            }}
          />
        </div>

        {/* progress가 100이 되면(즉, 체크마크 구간에 진입하면) 투명해짐 */}
        <div
          className={`absolute z-10 transition-opacity duration-200 ${
            progress < 100 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-2xl font-extrabold text-[#7a8cfd]">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
