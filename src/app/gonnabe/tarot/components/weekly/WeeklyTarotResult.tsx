import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import type { WeeklyTarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import TarotDetailBackground from '@/assets/images/gonnabe/tarot/tarot_detail_background.webp';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Image from 'next/image';

dayjs.extend(isoWeek);

interface WeeklyTarotResultProps {
  cards: TarotCardsApiItem[];
  analysis: WeeklyTarotAnalysisData;
}

export default function WeeklyTarotResult({
  cards,
  analysis,
}: WeeklyTarotResultProps) {
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
          주간 타로 리딩
        </h1>

        <p className="font-plus-jakarta-sans mb-8 text-center text-[#DCDCDC]">
          {dayjs().locale('ko').startOf('isoWeek').format('YYYY년 MM월 DD일')} ~{' '}
          {dayjs().locale('ko').endOf('isoWeek').format('YYYY년 MM월 DD일')}
        </p>

        <TarotSummaryCard
          title="이번 주의 비밀 열쇠"
          subtitle="한 주를 이끄는 핵심 에너지"
          description={analysis.arcana_of_week}
          tags={analysis.keywords}
          cards={cards}
        />

        <div className="mt-8 flex flex-col gap-6">
          <TarotMessageCard
            title="나를 비추는 카드"
            subtitle="현재 내 상태를 비추는 거울"
            description={analysis.mirror_card}
            image={cards[0].cardThumbnail}
            name={cards[0].informationKo.cardName}
            isReversed={cards[0].reversed}
          />
          <TarotMessageCard
            title="움직이는 외부 기운"
            subtitle="이번 주 나에게 다가올 변화"
            description={analysis.winds_of_change}
            image={cards[1].cardThumbnail}
            name={cards[1].informationKo.cardName}
            isReversed={cards[1].reversed}
          />
          <TarotMessageCard
            title="그림자와 마주하기"
            subtitle="갈등 뒤에 숨은 본질"
            description={analysis.shadow_and_challenge}
            image={cards[2].cardThumbnail}
            name={cards[2].informationKo.cardName}
            isReversed={cards[2].reversed}
          />
          <TarotMessageCard
            title="카드가 말하는 이야기"
            subtitle="흐름을 하나로 꿰는 인사이트"
            description={analysis.thread_of_story}
          />
          <TarotMessageCard
            title="카드의 속삭임"
            subtitle="이번 주를 위한 한 문장 예언"
            description={analysis.tarots_whisper}
          />
        </div>
      </div>
    </div>
  );
}
