import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import type { DailyTarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import type { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import TarotDetailBackground from '@/assets/images/gonnabe/tarot/tarot_detail_background.webp';
import dayjs from 'dayjs';
import Image from 'next/image';

interface DailyTarotResultProps {
  card: TarotCardsApiItem;
  analysis: DailyTarotAnalysisData;
}

export default function DailyTarotResult({
  card,
  analysis,
}: DailyTarotResultProps) {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0">
        <Image
          src={TarotDetailBackground}
          alt="Background"
          fill
          sizes="auto"
          className="object-cover object-top"
        />
      </div>

      <div className="relative px-5 pt-10 pb-20">
        <h1 className="font-playfair-display mb-4 text-center text-2xl font-bold text-shadow-[0_0_14px_#FFF2C6]">
          오늘의 타로 리딩
        </h1>

        <p className="font-plus-jakarta-sans mb-8 text-center text-[#DCDCDC]">
          {dayjs().locale('ko').format('YYYY년 MM월 DD일')}
        </p>

        <TarotSummaryCard
          title="카드가 전하는 말"
          subtitle="오늘 카드가 속삭이는 내면의 메시지"
          tags={analysis.keywords}
          description={analysis.message_today || '메시지가 없습니다.'}
          cards={[card]}
        />

        <div className="mt-8 flex flex-col gap-6">
          <TarotMessageCard
            title="오늘의 흐름"
            subtitle="오늘의 전반적 상황과 기류"
            description={analysis.today_flow}
          />
          <TarotMessageCard
            title="감정 상태"
            subtitle="내가 어떤 감정을 느낄지와 그 이유"
            description={analysis.emotional_state}
          />
          <TarotMessageCard
            title="마음가짐과 주의점"
            subtitle="오늘 필요한 마음의 태도"
            description={analysis.mindful_reminder}
          />
          <TarotMessageCard
            title="조용한 한 문장"
            subtitle="오늘을 위한 작은 통찰"
            description={analysis.quiet_message}
          />
        </div>
      </div>
    </div>
  );
}
