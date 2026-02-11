import { FortuneSubject, FortuneTheme, type ThemeKey } from '../types/fortune';

import bestStudyMethod from '@/assets/images/gonnabe/best_study_method.png';
import changeYouNeed from '@/assets/images/gonnabe/change_you_need.png';
import easeMyAnxiety from '@/assets/images/gonnabe/ease_my_anxiety.png';
import goodOpportunity from '@/assets/images/gonnabe/good_opportunity.png';
import growCharm from '@/assets/images/gonnabe/grow_charm.png';
import hiddenPotential from '@/assets/images/gonnabe/hidden_potential.png';
import idealCareerField from '@/assets/images/gonnabe/ideal_career_field.png';
import keepMakingMistakes from '@/assets/images/gonnabe/keep_making_mistakes.png';
import lovePersonalityType from '@/assets/images/gonnabe/love_personality_type.png';
import zodiacDatingStyle from '@/assets/images/gonnabe/zodiac_dating_style.png';
import type { StaticImageData } from 'next/image';

export const themeImages: Record<ThemeKey, StaticImageData> = {
  [FortuneTheme.ZODIAC_DATING_STYLE]: zodiacDatingStyle,
  [FortuneTheme.LOVE_PERSONALITY_TYPE]: lovePersonalityType,
  [FortuneTheme.IDEAL_CAREER_FIELD]: idealCareerField,
  [FortuneTheme.GOOD_OPPORTUNITY]: goodOpportunity,
  [FortuneTheme.CHANGE_YOU_NEED]: changeYouNeed,
  [FortuneTheme.HIDDEN_POTENTIAL]: hiddenPotential,
  [FortuneTheme.KEEP_MAKING_MISTAKES]: keepMakingMistakes,
  [FortuneTheme.EASE_MY_ANXIETY]: easeMyAnxiety,
  [FortuneTheme.GROW_CHARM]: growCharm,
  [FortuneTheme.BEST_STUDY_METHOD]: bestStudyMethod,
};

export const themeTitles: Record<ThemeKey, string> = {
  [FortuneTheme.ZODIAC_DATING_STYLE]: '별자리로 보는 나의 연애스타일',
  [FortuneTheme.LOVE_PERSONALITY_TYPE]: '나에게 잘 맞는 사람은 어떤 사람일까?',
  [FortuneTheme.IDEAL_CAREER_FIELD]: '나에게 맞는 분야/직종',
  [FortuneTheme.GOOD_OPPORTUNITY]: '곧 좋은 기회가 있을까?',
  [FortuneTheme.CHANGE_YOU_NEED]: '나에게 필요한 변화',
  [FortuneTheme.HIDDEN_POTENTIAL]: '내가 몰랐던 나의 가능성',
  [FortuneTheme.KEEP_MAKING_MISTAKES]: '나는 왜 같은 실수를 반복할까?',
  [FortuneTheme.EASE_MY_ANXIETY]: '나의 불안을 줄이려면 어떻게 해야할까?',
  [FortuneTheme.GROW_CHARM]: '남이 보는 나의 이미지와 매력 상승 팁',
  [FortuneTheme.BEST_STUDY_METHOD]: '나에게 맞는 공부법',
};

export const themeSubjects: Record<
  ThemeKey,
  (typeof FortuneSubject)[keyof typeof FortuneSubject]
> = {
  [FortuneTheme.ZODIAC_DATING_STYLE]: FortuneSubject.LOVE,
  [FortuneTheme.LOVE_PERSONALITY_TYPE]: FortuneSubject.LOVE,
  [FortuneTheme.IDEAL_CAREER_FIELD]: FortuneSubject.CAREER,
  [FortuneTheme.GOOD_OPPORTUNITY]: FortuneSubject.CAREER,
  [FortuneTheme.CHANGE_YOU_NEED]: FortuneSubject.GROWTH,
  [FortuneTheme.HIDDEN_POTENTIAL]: FortuneSubject.GROWTH,
  [FortuneTheme.KEEP_MAKING_MISTAKES]: FortuneSubject.EMOTION,
  [FortuneTheme.EASE_MY_ANXIETY]: FortuneSubject.EMOTION,
  [FortuneTheme.GROW_CHARM]: FortuneSubject.GROWTH,
  [FortuneTheme.BEST_STUDY_METHOD]: FortuneSubject.STUDY,
};
