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
  cardData?: {
    cardThumbnail?: string;
  };
  analysis?: {
    hookingMessage?: string;
    cardInterpretation?: string;
    currentSituation?: string;
    lesson?: string;
    todaysMessage?: string;
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

  let result: TarotAnalysisPayload | null = null;
  let errorMessage = '';

  try {
    result = await generateThemeTarotAnalysisOnServer<TarotAnalysisPayload>({
      theme,
      cardId,
      cardReversedInfo,
    });
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : '타로 분석에 실패했습니다.';
  }

  const thumbnailName = result?.cardData?.cardThumbnail?.trim();
  const thumbnailSrc = thumbnailName
    ? `${TAROT_S3_BASE_URL}/${thumbnailName}.png`
    : null;

  const hookingMessage = result?.analysis?.hookingMessage?.trim() || '';
  const cardInterpretation = result?.analysis?.cardInterpretation?.trim() || '';
  const currentSituation = result?.analysis?.currentSituation?.trim() || '';
  const lesson = result?.analysis?.lesson?.trim() || '';
  const todaysMessage = result?.analysis?.todaysMessage?.trim() || '';

  const mergedBody = [cardInterpretation, currentSituation, lesson]
    .filter(Boolean)
    .join('\n\n');

  return (
    <div className="flex min-h-screen flex-col bg-black px-5 pt-10 pb-8 text-white">
      <h1 className="font-playfair-display text-center text-xl font-semibold">
        {title}
      </h1>

      {!errorMessage && thumbnailSrc && (
        <div className="mt-8 flex justify-center">
          <Image
            src={thumbnailSrc}
            alt="선택한 타로 카드"
            width={160}
            height={240}
            className="h-auto w-40 rounded-xl object-cover"
          />
        </div>
      )}

      {!errorMessage && hookingMessage && (
        <p className="mt-3 text-center text-sm leading-6 text-white/80">
          {hookingMessage}
        </p>
      )}

      <div className="mt-8 rounded-xl bg-white/10 p-4">
        {errorMessage ? (
          <p className="font-plus-jakarta-sans text-sm leading-6 text-red-200">
            {errorMessage}
          </p>
        ) : (
          <p className="font-plus-jakarta-sans text-sm leading-7 whitespace-pre-line text-white">
            {mergedBody || '분석 본문이 없습니다.'}
          </p>
        )}
      </div>

      {!errorMessage && todaysMessage && (
        <div className="mt-6 rounded-xl bg-white/10 p-4">
          <p className="text-xs text-white/60">오늘의 메시지</p>
          <p className="font-plus-jakarta-sans mt-2 text-sm leading-6 text-white">
            {todaysMessage}
          </p>
        </div>
      )}
    </div>
  );
}
