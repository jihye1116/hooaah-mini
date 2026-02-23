import type { TarotPeriod } from '@/app/gonnabe/tarot/types/period';
import type { TarotTheme } from '@/app/gonnabe/tarot/types/theme';
import type { ValueOf } from 'next/dist/shared/lib/constants';
import { TarotCardsApiItem } from './cards';

interface BaseTarotAnalysisData {
  keywords: string[];
  cardKeywords: string[];
}

export interface DailyTarotAnalysisData extends BaseTarotAnalysisData {
  message_today: string;
  today_flow: string;
  emotional_state: string;
  mindful_reminder: string;
  quiet_message: string;
}

export interface WeeklyTarotAnalysisData extends BaseTarotAnalysisData {
  arcana_of_week: string;
  mirror_card: string;
  winds_of_change: string;
  shadow_and_challenge: string;
  thread_of_story: string;
  tarots_whisper: string;
}

export interface MonthlyTarotAnalysisData extends BaseTarotAnalysisData {
  monthly_theme: string;
  opportunities_resources: string;
  challenges_obstacles: string;
  guidance_attitude: string;
  growth_outcome: string;
  monthly_summary: string;
}

export interface TarotAnalysisResult<
  T extends Exclude<ValueOf<typeof TarotPeriod>, 'yearly'>,
> {
  analysis: T extends 'daily'
    ? DailyTarotAnalysisData
    : T extends 'weekly'
      ? WeeklyTarotAnalysisData
      : T extends 'monthly'
        ? MonthlyTarotAnalysisData
        : never;
  selectedCards: TarotCardsApiItem[];
}

interface ThemeTarotAnalysisData {
  overallInsight: {
    cardName: string;
    keywords: string[];
  };
  hookingMessage: string;
  cardInterpretation: string;
  currentSituation: string;
  lesson: string;
  todaysMessage: string;
}

export interface ThemeTarotAnalysisResult {
  themeTopic: ValueOf<typeof TarotTheme>;
  analysis: ThemeTarotAnalysisData;
  cardData: TarotCardsApiItem;
}
