import type { ValueOf } from 'next/dist/shared/lib/constants';

export interface FortuneResult {
  fortuneData: FortuneData;
  luckyNumber: number;
}

export const FortuneSubject = {
  LOVE: '연애 · 사랑',
  CAREER: '커리어 · 진로',
  GROWTH: '자기계발 · 성장',
  EMOTION: '마음상태 · 감정',
  RELATIONSHIP: '대인관계',
  STUDY: '학업 · 시험',
} as const;

export const FortuneTheme = {
  TODAY: 'today',
  ZODIAC_DATING_STYLE: 'zodiac_dating_style',
  GOOD_OPPORTUNITY: 'good_opportunity',
  GROW_CHARM: 'grow_charm',
  CHANGE_YOU_NEED: 'change_you_need',
  IDEAL_CAREER_FIELD: 'ideal_career_field',
  EASE_MY_ANXIETY: 'ease_my_anxiety',
  LOVE_PERSONALITY_TYPE: 'love_personality_type',
  HIDDEN_POTENTIAL: 'hidden_potential',
  KEEP_MAKING_MISTAKES: 'keep_making_mistakes',
  BEST_STUDY_METHOD: 'best_study_method',
} as const;

// 유료 테마 목록
export const PREMIUM_THEMES = [
  FortuneTheme.ZODIAC_DATING_STYLE,
  FortuneTheme.GOOD_OPPORTUNITY,
  FortuneTheme.GROW_CHARM,
  FortuneTheme.LOVE_PERSONALITY_TYPE,
  FortuneTheme.EASE_MY_ANXIETY,
  FortuneTheme.HIDDEN_POTENTIAL,
  FortuneTheme.KEEP_MAKING_MISTAKES,
] as const;

export type ThemeKey = Exclude<
  ValueOf<typeof FortuneTheme>,
  typeof FortuneTheme.TODAY
>;

export interface FortuneSubjectInfo {
  subject: ValueOf<typeof FortuneSubject>;
  theme: ThemeKey;
}

export interface FortuneData {
  theme: ThemeKey;
  zodiacSign: string;
  data: {
    main: {
      analysis: string;
      current_situation: string;
    };
    introduction: string;
    conclusion: string;
  };
}
