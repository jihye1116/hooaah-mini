'use client';

import { saveAs } from 'file-saver';
import { toJpeg } from 'html-to-image';
import { Download } from 'lucide-react';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { TAROT_S3_BASE_URL, tarotThemeTitles } from '../constants';
import { TarotTheme } from '../types/theme';
import { getPretendardFontCSS } from '../utils/fontUtils';

// --- Interfaces ---
export interface TarotAnalysisPayload {
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
    themeTopic: ValueOf<typeof TarotTheme>;
  };
}

interface TarotResultClientProps {
  theme: string;
  result: TarotAnalysisPayload;
}

// --- Constants & Mappers (From page.tsx) ---
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

const getThemeTitle = (theme: ValueOf<typeof TarotTheme>): string => {
  return tarotThemeTitles[theme] || '당신의 운세 흐름을 읽어드립니다.';
};

export default function TarotResultClient({
  theme,
  result,
}: TarotResultClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const { cardData, analysis } = result;
  const thumbnailSrc = `${TAROT_S3_BASE_URL}/${cardData.cardThumbnail}.png`;

  const handleSave = async () => {
    if (isSaving || !captureRef.current) return;
    setIsSaving(true);

    try {
      const fontCSS = await getPretendardFontCSS();
      const options = {
        backgroundColor: '#1E1E1E',
        pixelRatio: 2,
        quality: 0.9,
        cacheBust: false,
        fontEmbedCSS: fontCSS,
        skipFonts: true,
      };

      const dataUrl = await toJpeg(captureRef.current, options);
      saveAs(dataUrl, `tarot-result-${theme}.jpg`);
    } catch (e) {
      console.error('Save failed', e);
      if (e instanceof Error) {
        console.error('Error message:', e.message);
        console.error('Error stack:', e.stack);
      }
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const TagButton = ({ text }: { text: string }) => (
    <div className="rounded-full bg-white/25 px-4 py-2.5 backdrop-blur-sm">
      <p className="text-center text-xs font-medium text-white">{text}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#1E1E1E] text-white">
      {/* Capture Wrapper */}
      <div ref={captureRef} className="bg-[#1E1E1E]">
        {/* 1. Header Section with Background Image */}
        <div className="relative h-[270px] w-full">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={
                THEME_TO_IMAGE[theme] ||
                'https://durumo.s3.ap-northeast-2.amazonaws.com/tarot/full_reading_bg.png'
              }
              alt="Header Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute right-0 bottom-0 left-0 p-6">
            <p className="font-playfair-display text-[15px] leading-[2.2] font-semibold tracking-[1.2px] text-white uppercase">
              {getThemeTag(theme)}
            </p>
            <h1 className="mt-2 line-clamp-3 text-2xl leading-[1.3] font-bold text-white">
              {getThemeTitle(analysis.themeTopic)}
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center pb-10">
          {/* 2. Main Analysis Card */}
          <div className="relative z-10 mx-5 -mt-0 mt-[30px] w-[calc(100%-40px)] rounded-[20px] bg-white/15 px-5 py-10 backdrop-blur-sm">
            <h2 className="mb-3 text-center text-[19px] font-semibold text-white">
              전체적인 통찰
            </h2>

            <div className="mt-3 mb-9 flex justify-center">
              <div className="flex flex-col items-center rounded-lg bg-gray-400 px-2 py-3">
                <span className="mb-2 text-xs text-white">
                  {analysis.overallInsight.cardName}
                </span>
                <div className="relative h-62.5 w-37.5">
                  <Image
                    src={thumbnailSrc}
                    alt={analysis.overallInsight.cardName}
                    fill
                    sizes="auto"
                    loading="eager"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-x-1.5 gap-y-2.5">
              {analysis.overallInsight.keywords.map((tag, idx) => (
                <TagButton key={idx} text={tag} />
              ))}
            </div>

            <p className="mb-5 text-center text-[17px] leading-[1.65] font-bold text-white">
              {analysis.hookingMessage}
            </p>

            <div className="space-y-3 text-center">
              <p className="text-sm leading-[1.7] text-white">
                {analysis.cardInterpretation}
              </p>
              <p className="mt-3 text-sm leading-[1.7] text-white">
                {analysis.currentSituation}
              </p>
              <p className="mt-3 text-sm leading-[1.7] text-white">
                {analysis.lesson}
              </p>
            </div>
          </div>

          {/* 3. Today's Message Card */}
          <div className="mx-5 my-[30px] w-[calc(100%-40px)] rounded-[20px] bg-white/15 px-5 py-10 backdrop-blur-sm">
            <h3 className="mb-6 text-center text-[19px] font-semibold text-white">
              오늘의 메시지
            </h3>
            <p className="text-center text-sm leading-[1.5] font-medium text-white/70">
              {analysis.todaysMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="px-5 pb-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-transparent px-5 py-3.5 text-[13px] font-medium tracking-[0.04em] text-white/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:text-white/95 hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)] active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:opacity-60"
        >
          <span className="pointer-events-none absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-200 hover:opacity-100" />
          {isSaving ? (
            <>
              <Download className="h-4 w-4 animate-pulse" />
              <span className="relative">저장 중...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span className="relative">결과 이미지 저장하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
