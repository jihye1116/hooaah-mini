import { FortuneTheme } from '../types/fortune';

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

type ThemeKey = Exclude<
  (typeof FortuneTheme)[keyof typeof FortuneTheme],
  typeof FortuneTheme.TODAY
>;

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
  [FortuneTheme.ZODIAC_DATING_STYLE]: 'Zodiac Dating Style',
  [FortuneTheme.LOVE_PERSONALITY_TYPE]: 'Love Personality Type',
  [FortuneTheme.IDEAL_CAREER_FIELD]: 'Ideal Career Field',
  [FortuneTheme.GOOD_OPPORTUNITY]: 'Good Opportunity',
  [FortuneTheme.CHANGE_YOU_NEED]: 'Change You Need',
  [FortuneTheme.HIDDEN_POTENTIAL]: 'Hidden Potential',
  [FortuneTheme.KEEP_MAKING_MISTAKES]: 'Keep Making Mistakes',
  [FortuneTheme.EASE_MY_ANXIETY]: 'Ease My Anxiety',
  [FortuneTheme.GROW_CHARM]: 'Grow Charm',
  [FortuneTheme.BEST_STUDY_METHOD]: 'Best Study Method',
};
