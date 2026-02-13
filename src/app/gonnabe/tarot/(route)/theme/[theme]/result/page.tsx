import { generateThemeTarotAnalysisOnServer } from '@/app/gonnabe/tarot/api/analysis.server';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import { TarotTheme } from '@/app/gonnabe/tarot/types/theme';
import Image from 'next/image';
import Link from 'next/link'; // 네비게이션용

// --- Interfaces ---
interface TarotThemeResultPageProps {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{ cardId?: string; selected?: string }>;
}

interface TarotAnalysisPayload {
  cardData: {
    cardThumbnail: string;
    cardName?: string;
    image?: string;
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
    themeTopic?: string; // Dart 코드의 analysisResult.themeTopic 대응
  };
}

// --- Constants & Mappers (From Dart) ---
const BASE_IMG_URL = 'https://durumo.s3.ap-northeast-2.amazonaws.com/tarot';

const THEME_TO_IMAGE: Record<string, string> = {
  [TarotTheme.MISSING_IN_RELATIONSHIP]: `${BASE_IMG_URL}/overlooking_relationship.png`,
  [TarotTheme.RELATIONSHIP_LESSON]: `${BASE_IMG_URL}/learning_relationship.png`,
  [TarotTheme.NEXT_CAREER_CHAPTER]: `${BASE_IMG_URL}/next_chapter.png`,
  [TarotTheme.WORK_VALUE_ALIGNMENT]: `${BASE_IMG_URL}/align_job.png`,
  [TarotTheme.HABIT_TO_CHANGE]: `${BASE_IMG_URL}/change_grow.png`,
  [TarotTheme.FIND_TRUE_PATH]: `${BASE_IMG_URL}/truly_want.png`,
  [TarotTheme.IGNORED_EMOTION]: `${BASE_IMG_URL}/turning_away.png`,
  [TarotTheme.CHANGE_EMOTION_TONE]: `${BASE_IMG_URL}/emotion_tone.png`,
  [TarotTheme.RELATIONSHIP_ROLE]: `${BASE_IMG_URL}/relationship_role.png`,
  [TarotTheme.RESOLVE_CONFLICT]: `${BASE_IMG_URL}/resolve_conflict.png`,
  [TarotTheme.STUDY_LIFE_PURPOSE]: `${BASE_IMG_URL}/connect_studies.png`,
  [TarotTheme.OVERCOME_EXAM_ANXIETY]: `${BASE_IMG_URL}/exam_anxiety.png`,
};

// 다국어 지원이 필요한 경우 별도 처리 필요, 현재는 하드코딩된 영문/한글 혼용 구조 유지
const getThemeTag = (theme: string) => {
  switch (theme) {
    case TarotTheme.MISSING_IN_RELATIONSHIP:
    case TarotTheme.RELATIONSHIP_LESSON:
      return 'LOVE & ROMANCE';
    case TarotTheme.WORK_VALUE_ALIGNMENT:
    case TarotTheme.NEXT_CAREER_CHAPTER:
      return 'CAREER & PATH';
    case TarotTheme.HABIT_TO_CHANGE:
    case TarotTheme.FIND_TRUE_PATH:
      return 'GROWTH & SELF';
    case TarotTheme.IGNORED_EMOTION:
    case TarotTheme.CHANGE_EMOTION_TONE:
      return 'EMOTION & MIND';
    case TarotTheme.RELATIONSHIP_ROLE:
    case TarotTheme.RESOLVE_CONFLICT:
      return 'RELATIONSHIP';
    case TarotTheme.STUDY_LIFE_PURPOSE:
    case TarotTheme.OVERCOME_EXAM_ANXIETY:
      return 'STUDY & GOAL';
    default:
      return 'TAROT';
  }
};

const THEME_TO_KOREAN_TITLE: Record<string, string> = {
  [TarotTheme.MISSING_IN_RELATIONSHIP]:
    '지금 연애 관계에서 내가 놓치고 있는 것은?',
  [TarotTheme.RELATIONSHIP_LESSON]: '현재 연애가 나에게 주는 교훈은?',
  [TarotTheme.NEXT_CAREER_CHAPTER]: '내 커리어의 다음 챕터는 무엇일까?',
  [TarotTheme.WORK_VALUE_ALIGNMENT]: '지금 하는 일이 내 가치와 맞을까?',
  [TarotTheme.HABIT_TO_CHANGE]: '성장을 위해 어떤 습관을 바꿔야 할까?',
  [TarotTheme.FIND_TRUE_PATH]: '진정으로 원하는 삶의 길은 어떻게 찾을까?',
  [TarotTheme.IGNORED_EMOTION]: '나는 어떤 감정을 외면하고 있을까?',
  [TarotTheme.CHANGE_EMOTION_TONE]: '내 감정의 톤을 바꾸려면?',
  [TarotTheme.RELATIONSHIP_ROLE]: '나는 관계에서 어떤 역할을 맡고 있을까?',
  [TarotTheme.RESOLVE_CONFLICT]: '지금 겪고 있는 갈등, 어떻게 풀어야 할까?',
  [TarotTheme.STUDY_LIFE_PURPOSE]: '학업과 내 인생의 목적, 어떻게 연결할까?',
  [TarotTheme.OVERCOME_EXAM_ANXIETY]: '시험 전 불안 어떻게 이겨낼까?',
};

const getThemeTitle = (theme: string): string => {
  return THEME_TO_KOREAN_TITLE[theme] || '당신의 운세 흐름을 읽어드립니다.';
};

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
      themeTopic: String(root.themeTopic ?? '타로 분석 결과').trim(), // API 응답 구조에 따라 조정 필요
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
    const cardReversedInfo = selectedCardIds.reduce<Record<string, boolean>>(
      (acc, id) => {
        acc[id] = true;
        return acc;
      },
      {},
    );

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
        <h1 className="font-playfair-display text-center text-xl font-semibold">
          Error
        </h1>
        <div className="mt-8 rounded-xl bg-white/10 p-4">
          <p className="font-plus-jakarta-sans text-sm leading-6 text-red-200">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  // 데이터 매핑
  const { cardData, analysis } = result;
  const thumbnailSrc = `${TAROT_S3_BASE_URL}/${cardData.cardThumbnail}.png`;

  // Dart의 buildActionButton 구현 (태그)
  const TagButton = ({ text }: { text: string }) => (
    <div className="rounded-full bg-white/25 px-4 py-2.5 backdrop-blur-sm">
      <p className="font-plus-jakarta-sans text-center text-xs font-medium text-white">
        {text}
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#1E1E1E] text-white">
      {/* 1. Header Section with Background Image */}
      <div className="relative h-[270px] w-full">
        {/* Background Image */}
        <div className="absolute inset-0 h-full w-full">
          {/* Next/Image 사용 시 width/height를 알 수 없다면 fill 사용. 
                외부 URL(S3)인 경우 next.config.js에 domain 설정 필요 */}
          <Image
            src={
              THEME_TO_IMAGE[theme] ||
              'https://durumo.s3.ap-northeast-2.amazonaws.com/tarot/full_reading_bg.png'
            }
            alt="Header Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Black Overlay (Colors.black.withAlpha(204) -> opacity 0.8) */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Text Overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-6">
          <p className="font-playfair-display text-[15px] leading-[2.2] font-semibold tracking-[1.2px] text-white uppercase">
            {getThemeTag(theme)}
          </p>
          <h1 className="font-playfair-display mt-2 line-clamp-3 text-2xl leading-[1.3] font-bold text-white">
            {/* API에서 themeTopic이 온다고 가정, 없으면 기본 텍스트 */}
            {getThemeTitle(analysis.themeTopic || theme)}
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* 2. Main Analysis Card */}
        {/* Flutter: margin symmetric 20, vertical 40, color white.withAlpha(38) */}
        <div className="relative z-10 mx-5 -mt-0 mt-[30px] w-[calc(100%-40px)] rounded-[20px] bg-white/15 px-5 py-10 backdrop-blur-sm">
          <h2 className="font-plus-jakarta-sans mb-3 text-center text-[19px] font-semibold text-white">
            전체적인 통찰
          </h2>

          {/* Card Image */}
          <div className="mt-3 mb-9 flex justify-center">
            {/* TarotCard 위젯 대응 */}
            <div className="flex flex-col items-center rounded-lg bg-gray-400 px-2 py-3">
              <span className="font-playfair-display mb-2 text-xs text-white">
                {analysis.overallInsight.cardName}
              </span>
              <Image
                src={thumbnailSrc}
                alt={analysis.overallInsight.cardName}
                width={150}
                height={250} // Aspect ratio approximation
                className="h-auto w-[150px] rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Keywords (Tags) */}
          <div className="mb-6 flex flex-wrap justify-center gap-x-1.5 gap-y-2.5">
            {analysis.overallInsight.keywords.map((tag, idx) => (
              <TagButton key={idx} text={tag} />
            ))}
          </div>

          {/* Hooking Message */}
          <p className="font-plus-jakarta-sans mb-5 text-center text-[17px] leading-[1.65] font-bold text-white">
            {analysis.hookingMessage}
          </p>

          {/* Detailed Analysis */}
          <div className="space-y-3 text-center">
            <p className="font-plus-jakarta-sans text-sm leading-[1.7] text-white">
              {analysis.cardInterpretation}
            </p>
            <p className="font-plus-jakarta-sans mt-3 text-sm leading-[1.7] text-white">
              {analysis.currentSituation}
            </p>
            <p className="font-plus-jakarta-sans mt-3 text-sm leading-[1.7] text-white">
              {analysis.lesson}
            </p>
          </div>
        </div>

        {/* 3. Today's Message Card */}
        <div className="mx-5 my-[30px] w-[calc(100%-40px)] rounded-[20px] bg-white/15 px-5 py-10 backdrop-blur-sm">
          <h3 className="font-playfair-display mb-6 text-center text-[19px] font-semibold text-white">
            오늘의 메시지
          </h3>
          <p className="font-playfair-display text-center text-sm leading-[1.5] font-medium text-white/70">
            {analysis.todaysMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
