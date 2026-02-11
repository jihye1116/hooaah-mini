export interface FortuneResult {
  fortuneData: FortuneData;
  luckyNumber: number;
}

export enum FortuneTheme {
  TODAY = 'today',
  ZODIAC_DATING_STYLE = 'zodiac_dating_style',
  LOVE_PERSONALITY_TYPE = 'love_personality_type',
  IDEAL_CAREER_FIELD = 'ideal_career_field',
  GOOD_OPPORTUNITY = 'good_opportunity',
  CHANGE_YOU_NEED = 'change_you_need',
  HIDDEN_POTENTIAL = 'hidden_potential',
  KEEP_MAKING_MISTAKES = 'keep_making_mistakes',
  EASE_MY_ANXIETY = 'ease_my_anxiety',
  GROW_CHARM = 'grow_charm',
  GOOD_FRIEND = 'good_friend',
  BEST_STUDY_METHOD = 'best_study_method',
}

export interface FortuneData {
  [key: string]: unknown;
}
