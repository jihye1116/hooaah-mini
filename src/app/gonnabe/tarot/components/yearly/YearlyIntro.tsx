import Image from 'next/image';
import yearlyIntroBackground from '@/assets/images/gonnabe/tarot/yearly/yearly_report_main_background.png';
import yearlyIntroMain from '@/assets/images/gonnabe/tarot/yearly/yearly_report_main.png';

interface YearlyIntroProps {
  onStart: () => void;
}

export default function YearlyIntro({ onStart }: YearlyIntroProps) {
  return (
    <div className="relative flex size-full flex-col items-center justify-center bg-black pt-16 pb-28 text-white">
      {/* Background Image */}
      <Image
        src={yearlyIntroBackground}
        alt="Yearly Background"
        fill
        className="object-cover"
      />

      <div className="z-10 flex flex-col items-center gap-8 px-6 text-center">
        <Image
          src={yearlyIntroMain}
          alt="Yearly Report Main"
          width={165}
          height={165}
        />

        <div className="space-y-4">
          <h1 className="text-3xl leading-tight font-bold">
            <span className="bg-gradient-to-r from-[#CCFF8E] to-[#9003F2] bg-clip-text text-transparent">
              2026년, 당신의 밤하늘에 <br /> 새겨진 운명의 지도
            </span>
          </h1>
          <p className="text-sm text-white/80">
            78장의 타로 카드가 들려주는 당신만의 1년 이야기.
            <br />
            올해 당신이 마주할 가장 빛나는 순간은 언제일까요?
          </p>
        </div>

        <button
          onClick={onStart}
          className="mt-8 rounded-full bg-white/50 px-10 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          나의 운명 확인하기
        </button>
      </div>
    </div>
  );
}
