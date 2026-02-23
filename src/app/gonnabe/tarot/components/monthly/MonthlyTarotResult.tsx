import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import TarotSummaryCard from '@/app/gonnabe/tarot/components/TarotSummaryCard';
import type { MonthlyTarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import TarotDetailBackground from '@/assets/images/gonnabe/tarot/tarot_detail_background.webp';
import dayjs from 'dayjs';
import Image from 'next/image';

interface MonthlyTarotResultProps {
  cards: TarotCardsApiItem[];
  analysis: MonthlyTarotAnalysisData;
}

export default function MonthlyTarotResult({
  cards,
  analysis,
}: MonthlyTarotResultProps) {
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
          월간 타로 리딩
        </h1>

        <p className="font-plus-jakarta-sans mb-8 text-center text-[#DCDCDC]">
          {dayjs().locale('ko').format('YYYY년 MM월')}
        </p>

        <TarotSummaryCard
          title="이달의 흐름"
          subtitle="전체적인 감정 흐름과 리듬"
          description={analysis.monthly_theme}
          tags={analysis.keywords}
          cards={cards}
        />

        <div className="mt-8 flex flex-col gap-6">
          <TarotMessageCard
            title="강점과 기회"
            subtitle="활용할 수 있는 자원"
            description={analysis.opportunities_resources}
            image={cards[1].cardThumbnail}
            name={cards[1].informationKo.cardName}
            isReversed={cards[1].reversed}
          />
          <TarotMessageCard
            title="위험과 장애물"
            subtitle="주의해야 할 점"
            description={analysis.challenges_obstacles}
            image={cards[2].cardThumbnail}
            name={cards[2].informationKo.cardName}
            isReversed={cards[2].reversed}
          />
          <TarotMessageCard
            title="조언과 태도"
            subtitle="어떻게 대처할까"
            description={analysis.guidance_attitude}
            image={cards[3].cardThumbnail}
            name={cards[3].informationKo.cardName}
            isReversed={cards[3].reversed}
          />
          <TarotMessageCard
            title="결과와 성장"
            subtitle="이달의 마무리"
            description={analysis.growth_outcome}
            image={cards[4].cardThumbnail}
            name={cards[4].informationKo.cardName}
            isReversed={cards[4].reversed}
          />
          <TarotMessageCard
            title="예언"
            subtitle="통찰의 한 방울"
            description={analysis.monthly_summary}
          />
        </div>
      </div>
    </div>
  );
}
