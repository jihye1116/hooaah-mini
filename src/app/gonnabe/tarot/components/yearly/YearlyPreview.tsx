import Image from 'next/image';
import yearlyPreviewBackground from '@/assets/images/gonnabe/tarot/yearly/yearly_report_preview_background.png';

interface YearlyPreviewProps {
  onNext: () => void;
}

export default function YearlyPreview({ onNext }: YearlyPreviewProps) {
  return (
    <div className="relative flex size-full flex-col bg-black pt-16 pb-28 text-white">
      <Image
        src={yearlyPreviewBackground}
        alt="Preview Background"
        fill
        className="object-cover"
      />

      <div className="z-10 flex grow flex-col justify-center px-6">
        <h1 className="mb-4 text-center text-2xl font-bold">
          리포트 구성 리스트
        </h1>
        <p className="mb-10 text-center text-sm text-white/80">
          2026년 전체 운세를 위한
          <br />
          리포트의 전개되는 순서에요.
        </p>

        <div className="space-y-3">
          {[
            { emoji: '👤', text: 'Chapter 03. 2026년 나의 흐름' },
            { emoji: '📈', text: 'Chapter 04. 상반기와 하반기' },
            { emoji: '⚖️', text: 'Chapter 05. 위기와 기회' },
            { emoji: '🧭', text: 'Chapter 06. 변화와 조력자' },
            { emoji: '💬', text: 'Chapter 07. 2026년의 완성' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/20 px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#FFBCC8]/60">
                <span className="text-sm">{item.emoji}</span>
              </div>
              <span className="text-sm text-white">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
