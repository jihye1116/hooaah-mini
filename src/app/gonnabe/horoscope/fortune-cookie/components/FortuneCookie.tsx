'use client';

import fortuneCookieAnimation from '@/lotties/fortune_cookie.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function FortuneCookie() {
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
      // TODO: 결과 페이지 경로 설정 필요
      router.push('/gonnabe/horoscope/fortune-cookie/result');
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
