'use client';

import { loadFortune } from '@/app/gonnabe/horoscope/api/fortune';
import type { FortuneResult } from '@/app/gonnabe/horoscope/types/fortune';
import { FortuneTheme } from '@/app/gonnabe/horoscope/types/fortune';
import fortuneCookieAnimation from '@/lotties/fortune_cookie.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function FortuneCookie() {
  const router = useRouter();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fortuneResult, setFortuneResult] = useState<FortuneResult | null>(
    null,
  );

  const handleClick = async () => {
    if (!isPlaying && lottieRef.current) {
      setIsPlaying(true);
      lottieRef.current.play();

      // API 호출
      try {
        const result = await loadFortune(FortuneTheme.TODAY);
        setFortuneResult(result);
      } catch (error) {
        console.error('운세 로드 실패:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleComplete = () => {
    setTimeout(() => {
      if (fortuneResult) {
        // 운세 데이터를 URL 인코딩해서 전달
        const params = new URLSearchParams({
          data: JSON.stringify(fortuneResult),
        });
        router.push(
          `/gonnabe/horoscope/fortune-cookie/result?${params.toString()}`,
        );
      }
    }, 1000);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Lottie
        lottieRef={lottieRef}
        animationData={fortuneCookieAnimation}
        autoplay={false}
        loop={false}
        onComplete={handleComplete}
        className="mt-[clamp(2rem,10vh,7rem)] mb-[clamp(3rem,10vh,8rem)] h-50 w-50"
      />
    </div>
  );
}
