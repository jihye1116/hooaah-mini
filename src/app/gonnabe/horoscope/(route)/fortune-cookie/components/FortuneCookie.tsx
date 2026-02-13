'use client';

import type { FortuneResult } from '@/app/gonnabe/horoscope/types/fortune';
import fortuneCookieAnimation from '@/lotties/fortune_cookie.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface FortuneCookieProps {
  fortuneResult: FortuneResult;
}

export default function FortuneCookie({ fortuneResult }: FortuneCookieProps) {
  const router = useRouter();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    if (!isPlaying && lottieRef.current) {
      setIsPlaying(true);
      lottieRef.current.play();
    }
  };

  const handleComplete = () => {
    setTimeout(() => {
      // 운세 데이터를 URL 인코딩해서 전달
      const params = new URLSearchParams({
        data: JSON.stringify(fortuneResult),
      });
      router.push(
        `/gonnabe/horoscope/fortune-cookie/result?${params.toString()}`,
      );
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
