import Image from 'next/image';
import yearlyQuestionBackground from '@/assets/images/gonnabe/tarot/yearly/yearly_report_question_background.png';

interface YearlyQuestionProps {
  number: string;
  title: string;
  description: string;
  onStartSelection: () => void;
}

export default function YearlyQuestion({
  number,
  title,
  description,
  onStartSelection,
}: YearlyQuestionProps) {
  return (
    <div className="relative flex size-full flex-col items-center justify-center bg-black pt-16 pb-28 text-white">
      <Image
        src={yearlyQuestionBackground}
        alt="Question Background"
        fill
        className="object-cover"
      />

      <div className="z-10 mx-auto flex w-[calc(100%-10rem)] flex-col items-center rounded-3xl bg-white/25 px-4 py-16 text-center backdrop-blur-xl">
        <span className="mb-2 text-sm font-semibold text-white/80">
          {number}.
        </span>
        <h1 className="mb-6 text-3xl font-bold whitespace-pre-line">{title}</h1>
        <p className="text-center text-sm leading-relaxed break-keep text-white/80">
          {description}
        </p>
      </div>
    </div>
  );
}
