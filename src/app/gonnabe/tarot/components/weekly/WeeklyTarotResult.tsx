import TarotMessageCard from '@/app/gonnabe/tarot/components/TarotMessageCard';
import type { WeeklyTarotAnalysisData } from '@/app/gonnabe/tarot/types/analysis';
import { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';

interface WeeklyTarotResultProps {
  cards: TarotCardsApiItem[];
  analysis: WeeklyTarotAnalysisData;
}

export default function WeeklyTarotResult({
  cards,
  analysis,
}: WeeklyTarotResultProps) {
  return (
    <div className="min-h-screen w-full bg-black px-5 pt-10 pb-20 text-white">
      <h1 className="mb-2 text-center text-2xl font-bold">주간 타로 리딩</h1>

      {/* <TarotSummaryCard
        title="이번 주의 아르카나"
        subtitle="전체적인 테마"
        description={analysis.arcanaOfWeek}
        tags={analysis.keywords}
        cards={
          <div className="flex gap-2">
            <ResultTarotCard
              imageUrl={getCardUrl(card1)}
              width={60}
              height={90}
              onClick={() => handleCardClick(card1._id)}
            />
            <ResultTarotCard
              imageUrl={getCardUrl(card2)}
              width={60}
              height={90}
              onClick={() => handleCardClick(card2._id)}
            />
            <ResultTarotCard
              imageUrl={getCardUrl(card3)}
              width={60}
              height={90}
              onClick={() => handleCardClick(card3._id)}
            />
          </div>
        }
      /> */}

      <div className="mt-8 flex flex-col gap-6">
        <TarotMessageCard
          title="현재 상황 (Mirror)"
          subtitle="나의 모습"
          description={analysis.mirror_card}
        />
        <TarotMessageCard
          title="변화의 바람"
          subtitle="다가오는 사건"
          description={analysis.winds_of_change}
        />
        <TarotMessageCard
          title="그림자와 도전"
          subtitle="주의할 점"
          description={analysis.shadow_and_challenge}
        />
        <TarotMessageCard
          title="이야기의 흐름"
          subtitle="전개 방향"
          description={analysis.thread_of_story}
        />
        <TarotMessageCard
          title="타로의 속삭임"
          subtitle="조언"
          description={analysis.tarots_whisper}
        />
      </div>
    </div>
  );
}
