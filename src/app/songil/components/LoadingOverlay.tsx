'use client';

import React, { useState, useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import loadingAnimation from '@/lotties/photo-analysis.json';

interface LoadingOverlayProps {
  isLoading: boolean;
  lottieData?: Record<string, unknown>;
}

// 📌 설정: 로딩 지속 시간 (ms)
const LOADING_DURATION_MS = 30000; // 30초

// 📌 체크 표시가 시작되는 지점을 설정 (0.8 = 전체 프레임의 80% 지점부터 체크마크 진입)
const CHECKMARK_START_RATIO = 0.8;

export default function LoadingOverlay({
  isLoading,
  lottieData = loadingAnimation as Record<string, unknown>,
}: LoadingOverlayProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // 진행률 (화면에 표시되는 숫자)
  const [progress, setProgress] = useState(0);
  // 로띠의 전체 프레임 수 저장
  const [totalFrames, setTotalFrames] = useState(0);

  const handleLottieLoad = () => {
    if (lottieRef.current) {
      const duration = lottieRef.current.getDuration(true);
      if (typeof duration === 'number') {
        setTotalFrames(duration);
      }
    }
  };

  // 2. 30초 동안 프레임을 직접 제어하는 타이머 로직
  useEffect(() => {
    if (!isLoading || totalFrames === 0) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      // 경과 시간 (ms)
      const elapsed = timestamp - startTime;

      // 전체 시간 대비 현재 진행 비율 (0.0 ~ 1.0)
      // Math.min을 사용하여 1.0을 넘지 않도록 고정
      const timeRatio = Math.min(elapsed / LOADING_DURATION_MS, 1);

      // A. 로띠 프레임 강제 이동 (수동 운전)
      if (lottieRef.current) {
        const targetFrame = totalFrames * timeRatio;
        // goToAndStop을 사용하여 해당 프레임에 딱 멈추게 함 (연속 호출로 애니메이션 효과)
        lottieRef.current.goToAndStop(targetFrame, true);
      }

      // B. 텍스트 퍼센트 계산 (기존 로직 유지)
      // 시간 비율이 CHECKMARK_START_RATIO(0.8)에 도달하면 100%가 되도록 계산
      const adjustedPercent = (timeRatio / CHECKMARK_START_RATIO) * 100;
      const finalProgress =
        adjustedPercent >= 100 ? 100 : Math.round(adjustedPercent);

      setProgress(finalProgress);

      // 시간이 남았다면 계속 애니메이션 수행
      if (timeRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading, totalFrames]); // isLoading이나 totalFrames가 준비되면 실행

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
            autoplay={false} // 📌 중요: 자동 재생을 끄고 useEffect에서 직접 제어합니다.
            onDOMLoaded={handleLottieLoad} // 로띠가 준비되면 프레임 정보를 읽음
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
