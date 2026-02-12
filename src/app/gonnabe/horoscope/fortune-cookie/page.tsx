import FortuneCookie from '@/app/gonnabe/horoscope/fortune-cookie/components/FortuneCookie';

export default function HoroscopeFortuneCookiePage() {
  return (
    <div className="flex size-full flex-col items-center justify-center bg-white">
      {/* Main Content */}
      <div className="flex w-full flex-col items-center justify-center gap-1.25 text-center whitespace-pre-wrap text-black">
        <p className="font-playfair-display w-full text-[27px] leading-10 font-semibold">
          오늘의 운세
        </p>
        <p className="font-playfair-display w-full text-base leading-5.5 font-normal">
          오늘 나에게 행운을 가져다 줄 것은?
        </p>
      </div>

      {/* Fortune Cookie Illustration */}
      <FortuneCookie />

      {/* Instruction Text */}
      <p className="font-plus-jakarta-sans w-full text-center text-base leading-5 font-normal tracking-[-0.408px] whitespace-pre-wrap text-[#8a8a8a] [text-shadow:0px_1px_3.5px_rgba(0,0,0,0.15)]">
        쿠키를 터치해서 깨보세요.
      </p>
    </div>
  );
}
