import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import type { MonthlyTarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';

interface MonthlyTarotResultProps {
  cards: TarotCardsApiItem[];
  analysis: MonthlyTarotAnalysisData;
}

export default function MonthlyTarotResult({
  cards,
  analysis,
}: MonthlyTarotResultProps) {
  const getCardUrl = (c: TarotCardsApiItem) =>
    `https://durumo.s3.ap-northeast-2.amazonaws.com/tarot/${c.cardThumbnail || c.image}.png`;

  return (
    <div className="min-h-screen w-full bg-black px-5 pt-10 pb-20 text-white">
      <h1 className="mb-2 text-center text-2xl font-bold">월간 타로 리딩</h1>

      {/* <TarotSummaryCard
        title="이달의 흐름"
        subtitle="전체 테마"
        description={analysis.monthly_theme}
        tags={analysis.keywords}
        cards={
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[0])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[0]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[1])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[1]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[2])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[2]._id)}
              />
            </div>
            <div className="flex justify-center gap-2">
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[3])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[3]._id)}
              />
              <ResultTarotCard
                imageUrl={getCardUrl(cardsData[4])}
                width={50}
                height={75}
                onClick={() => handleCardClick(cardsData[4]._id)}
              />
            </div>
          </div>
        }
      /> */}

      <div className="mt-8 flex flex-col gap-6">
        <TarotMessageCard
          title="강점과 기회"
          subtitle="활용할 수 있는 자원"
          description={analysis.opportunities_resources}
        />
        <TarotMessageCard
          title="위험과 장애물"
          subtitle="주의해야 할 점"
          description={analysis.challenges_obstacles}
        />
        <TarotMessageCard
          title="조언과 태도"
          subtitle="어떻게 대처할까"
          description={analysis.guidance_attitude}
        />
        <TarotMessageCard
          title="결과와 성장"
          subtitle="이달의 마무리"
          description={analysis.growth_outcome}
        />
        <TarotMessageCard
          title="예언"
          subtitle="통찰의 한 방울"
          description={analysis.monthly_summary}
        />
      </div>
    </div>
  );
}
