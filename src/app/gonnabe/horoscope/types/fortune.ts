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
  LOVE_PERSONALITY_TYPE: 'love_personality_type',
  IDEAL_CAREER_FIELD: 'ideal_career_field',
  GOOD_OPPORTUNITY: 'good_opportunity',
  CHANGE_YOU_NEED: 'change_you_need',
  HIDDEN_POTENTIAL: 'hidden_potential',
  KEEP_MAKING_MISTAKES: 'keep_making_mistakes',
  EASE_MY_ANXIETY: 'ease_my_anxiety',
  GROW_CHARM: 'grow_charm',
  BEST_STUDY_METHOD: 'best_study_method',
} as const;

export type ThemeKey = Exclude<
  (typeof FortuneTheme)[keyof typeof FortuneTheme],
  typeof FortuneTheme.TODAY
>;

export interface FortuneSubjectInfo {
  subject: (typeof FortuneSubject)[keyof typeof FortuneSubject];
  theme: ThemeKey;
}

export interface FortuneData {
  [key: string]: unknown;
}
