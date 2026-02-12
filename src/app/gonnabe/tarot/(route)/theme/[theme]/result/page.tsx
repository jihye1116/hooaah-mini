import { generateThemeTarotAnalysisOnServer } from '@/app/gonnabe/tarot/api/analysis.server';
import {
  TAROT_S3_BASE_URL,
  tarotThemeTitles,
} from '@/app/gonnabe/tarot/constants';
import Image from 'next/image';

interface TarotThemeResultPageProps {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{ cardId?: string; selected?: string }>;
}

interface TarotAnalysisPayload {
  cardData: {
    cardThumbnail: string;
  };
  analysis: {
    overallInsight: {
      cardName: string;
      keywords: string[];
    };
    hookingMessage: string;
    cardInterpretation: string;
    currentSituation: string;
    lesson: string;
    todaysMessage: string;
  };
}

function parseTarotAnalysisPayload(input: unknown): TarotAnalysisPayload {
  if (typeof input !== 'object' || input === null) {
    throw new Error('분석 결과 형식이 올바르지 않습니다.');
  }

  const root = input as Record<string, unknown>;
  const cardData = root.cardData as Record<string, unknown>;
  const analysis = root.analysis as Record<string, unknown>;
  const overallInsight = analysis?.overallInsight as Record<string, unknown>;

  const cardThumbnail = String(cardData?.cardThumbnail ?? '').trim();
  const cardName = String(overallInsight?.cardName ?? '').trim();
  const keywordsRaw = overallInsight?.keywords;
  const keywords = Array.isArray(keywordsRaw)
    ? keywordsRaw.map((item) => String(item))
    : [];
  const hookingMessage = String(analysis?.hookingMessage ?? '').trim();
  const cardInterpretation = String(analysis?.cardInterpretation ?? '').trim();
  const currentSituation = String(analysis?.currentSituation ?? '').trim();
  const lesson = String(analysis?.lesson ?? '').trim();
  const todaysMessage = String(analysis?.todaysMessage ?? '').trim();

  return {
    cardData: {
      cardThumbnail,
    },
    analysis: {
      overallInsight: {
        cardName,
        keywords,
      },
      hookingMessage,
      cardInterpretation,
      currentSituation,
      lesson,
      todaysMessage,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function TarotThemeResultPage({
  params,
  searchParams,
}: TarotThemeResultPageProps) {
  const { theme } = await params;
  const { cardId: cardIdFromQuery, selected: selectedFromQuery } =
    (await searchParams) ?? {};

  const selectedCardIds = (selectedFromQuery ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const cardId = (
    cardIdFromQuery ??
    selectedCardIds[selectedCardIds.length - 1] ??
    ''
  ).trim();

  const title =
    tarotThemeTitles[theme as keyof typeof tarotThemeTitles] ??
    '타로 분석 결과';

  if (!cardId) {
    return (
      <div className="flex min-h-screen flex-col bg-black px-5 pt-10 pb-8 text-white">
        <h1 className="font-playfair-display text-center text-xl font-semibold">
          {title}
        </h1>
        <p className="mt-8 text-center text-sm text-white/70">
          카드 정보가 없어 분석 결과를 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  const cardReversedInfo = selectedCardIds.reduce<Record<string, boolean>>(
    (acc, id) => {
      acc[id] = true;
      return acc;
    },
    {},
  );

  let result: TarotAnalysisPayload;

  try {
    const response = await generateThemeTarotAnalysisOnServer<unknown>({
      theme,
      cardId,
      cardReversedInfo,
    });

    result = parseTarotAnalysisPayload(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '타로 분석에 실패했습니다.';

    return (
      <div className="flex min-h-screen flex-col bg-black px-5 pt-10 pb-8 text-white">
        <h1 className="font-playfair-display text-center text-xl font-semibold">
          {title}
        </h1>
        <div className="mt-8 rounded-xl bg-white/10 p-4">
          <p className="font-plus-jakarta-sans text-sm leading-6 text-red-200">
            {message}
          </p>
        </div>
      </div>
    );
  }

  const thumbnailSrc = `${TAROT_S3_BASE_URL}/${result.cardData.cardThumbnail}.png`;
  const cardName = result.analysis.overallInsight.cardName;
  const keywords = result.analysis.overallInsight.keywords;
  const hookingMessage = result.analysis.hookingMessage;
  const cardInterpretation = result.analysis.cardInterpretation;
  const currentSituation = result.analysis.currentSituation;
  const lesson = result.analysis.lesson;
  const todaysMessage = result.analysis.todaysMessage;

  const mergedBody = [cardInterpretation, currentSituation, lesson]
    .filter(Boolean)
    .join('\n\n');

  return (
    <div className="flex min-h-screen flex-col bg-black px-5 pt-10 pb-8 text-white">
      <h1 className="font-playfair-display text-center text-xl font-semibold">
        {title}
      </h1>

      <p className="mt-4 text-center text-base font-semibold text-white">
        {cardName}
      </p>

      <div className="mt-8 flex justify-center">
        <Image
          src={thumbnailSrc}
          alt="선택한 타로 카드"
          width={160}
          height={240}
          className="h-auto w-40 rounded-xl object-cover"
        />
      </div>

      <p className="mt-3 text-center text-sm text-white/70">
        {keywords.join(' · ')}
      </p>

      <p className="mt-3 text-center text-sm leading-6 text-white/80">
        {hookingMessage}
      </p>

      <div className="mt-8 rounded-xl bg-white/10 p-4">
        <p className="font-plus-jakarta-sans text-sm leading-7 whitespace-pre-line text-white">
          {mergedBody}
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-white/10 p-4">
        <p className="text-xs text-white/60">오늘의 메시지</p>
        <p className="font-plus-jakarta-sans mt-2 text-sm leading-6 text-white">
          {todaysMessage}
        </p>
      </div>
    </div>
  );
}
