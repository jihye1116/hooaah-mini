import { generateThemeTarotAnalysisOnServer } from '@/app/gonnabe/tarot/api/analysis.server';
import TarotResultClient, {
  TarotAnalysisPayload,
} from '@/app/gonnabe/tarot/components/TarotResultClient';

// --- Interfaces ---
interface TarotThemeResultPageProps {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{
    cardId?: string;
    selected?: string;
    reversed?: string;
  }>;
}

// --- Helper Functions ---
function parseTarotAnalysisPayload(input: unknown): TarotAnalysisPayload {
  if (typeof input !== 'object' || input === null) {
    throw new Error('분석 결과 형식이 올바르지 않습니다.');
  }

  const root = input as Record<string, unknown>;
  const cardData = root.cardData as Record<string, unknown>;
  const analysis = root.analysis as Record<string, unknown>;
  const overallInsight = analysis?.overallInsight as Record<string, unknown>;

  return {
    cardData: {
      cardThumbnail: String(cardData?.cardThumbnail ?? '').trim(),
      cardName: String(cardData?.cardName ?? '').trim(),
    },
    analysis: {
      overallInsight: {
        cardName: String(overallInsight?.cardName ?? '').trim(),
        keywords: Array.isArray(overallInsight?.keywords)
          ? overallInsight.keywords.map(String)
          : [],
      },
      hookingMessage: String(analysis?.hookingMessage ?? '').trim(),
      cardInterpretation: String(analysis?.cardInterpretation ?? '').trim(),
      currentSituation: String(analysis?.currentSituation ?? '').trim(),
      lesson: String(analysis?.lesson ?? '').trim(),
      todaysMessage: String(analysis?.todaysMessage ?? '').trim(),
      themeTopic: String(root.themeTopic ?? '타로 분석 결과').trim(),
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function TarotThemeResultPage({
  params,
  searchParams,
}: TarotThemeResultPageProps) {
  const { theme } = await params;
  const {
    cardId: cardIdFromQuery,
    selected: selectedFromQuery,
    reversed: reversedFromQuery,
  } = (await searchParams) ?? {};

  // 선택된 카드 ID 파싱
  const selectedCardIds = (selectedFromQuery ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const cardId = (
    cardIdFromQuery ??
    selectedCardIds[selectedCardIds.length - 1] ??
    ''
  ).trim();

  // 데이터 페칭
  let result: TarotAnalysisPayload | null = null;
  let errorMessage: string | null = null;

  if (cardId) {
    // reversed 파라미터 파싱: "cardId1:true,cardId2:false" 형태
    const cardReversedInfo = (reversedFromQuery ?? '')
      .split(',')
      .reduce<Record<string, boolean>>((acc, pair) => {
        const [id, reversed] = pair.split(':');
        if (id) {
          acc[id.trim()] = reversed === 'true';
        }
        return acc;
      }, {});

    try {
      const response = await generateThemeTarotAnalysisOnServer<unknown>({
        theme,
        cardId,
        cardReversedInfo,
      });
      result = parseTarotAnalysisPayload(response);
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : '타로 분석에 실패했습니다.';
    }
  } else {
    errorMessage = '카드 정보가 없어 분석 결과를 불러올 수 없습니다.';
  }

  // 에러 화면
  if (errorMessage || !result) {
    return (
      <div className="flex min-h-screen flex-col bg-[#1E1E1E] px-5 pt-20 pb-8 text-white">
        <h1 className="text-center text-xl font-semibold">Error</h1>
        <div className="mt-8 rounded-xl bg-white/10 p-4">
          <p className="text-sm leading-6 text-red-200">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return <TarotResultClient theme={theme} result={result} />;
}
