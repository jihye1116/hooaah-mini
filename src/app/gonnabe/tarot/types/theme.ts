import type { ValueOf } from 'next/dist/shared/lib/constants';

export const TarotTheme = {
  WORK_VALUE_ALIGNMENT: 'work_value_alignment',
  HABIT_TO_CHANGE: 'habit_to_change',
  FIND_TRUE_PATH: 'find_true_path',
  IGNORED_EMOTION: 'ignored_emotion',
  CHANGE_EMOTION_TONE: 'change_emotion_tone',
  RELATIONSHIP_ROLE: 'relationship_role',
  RESOLVE_CONFLICT: 'resolve_conflict',
  STUDY_LIFE_PURPOSE: 'study_life_purpose',
  OVERCOME_EXAM_ANXIETY: 'overcome_exam_anxiety',
  MISSING_IN_RELATIONSHIP: 'missing_in_relationship',
  RELATIONSHIP_LESSON: 'relationship_lesson',
  NEXT_CAREER_CHAPTER: 'next_career_chapter',
} as const;

// 유료 테마 목록
export const PREMIUM_TAROT_THEMES = [
  TarotTheme.HABIT_TO_CHANGE,
  TarotTheme.IGNORED_EMOTION,
  TarotTheme.CHANGE_EMOTION_TONE,
  TarotTheme.RESOLVE_CONFLICT,
  TarotTheme.MISSING_IN_RELATIONSHIP,
  TarotTheme.RELATIONSHIP_LESSON,
  TarotTheme.NEXT_CAREER_CHAPTER,
] as const;

export type TarotThemeKey = ValueOf<typeof TarotTheme>;

export interface TarotThemeInfo {
  theme: TarotThemeKey;
  title: string;
  description: string;
}

export interface TarotResult {
  cards: TarotCard[];
  interpretation: string;
}

export interface TarotCard {
  id: number;
  frontImage: string;
  reversed: boolean;
}
