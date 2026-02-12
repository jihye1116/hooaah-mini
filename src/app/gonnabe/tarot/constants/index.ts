import { FortuneSubject } from '@/app/gonnabe/horoscope/types/fortune';
import { TarotTheme } from '@/app/gonnabe/tarot/types/theme';
import type { ValueOf } from 'next/dist/shared/lib/constants';

export const TAROT_S3_BASE_URL =
  'https://durumo.s3.ap-northeast-2.amazonaws.com/tarot';

// 타로 테마별 제목
export const tarotThemeTitles: Record<ValueOf<typeof TarotTheme>, string> = {
  [TarotTheme.WORK_VALUE_ALIGNMENT]: '지금 하는 일이 내 가치와 맞을까?',
  [TarotTheme.NEXT_CAREER_CHAPTER]: '내 커리어의 다음 챕터는 무엇일까?',
  [TarotTheme.HABIT_TO_CHANGE]: '성장을 위해 어떤 습관을 바꿔야 할까?',
  [TarotTheme.FIND_TRUE_PATH]: '진정으로 원하는 삶의 길은 어떻게 찾을까?',
  [TarotTheme.IGNORED_EMOTION]: '나는 어떤 감정을 외면하고 있을까?',
  [TarotTheme.CHANGE_EMOTION_TONE]: '내 감정의 톤을 바꾸려면?',
  [TarotTheme.RELATIONSHIP_ROLE]: '나는 관계에서 어떤 역할을 맡고 있을까?',
  [TarotTheme.RESOLVE_CONFLICT]: '지금 겪고 있는 갈등, 어떻게 풀 수 있을까?',
  [TarotTheme.STUDY_LIFE_PURPOSE]: '학업과 내 인생의 목적, 어떻게',
  [TarotTheme.OVERCOME_EXAM_ANXIETY]: '시험 전 불안 어떻게 이겨낼까?',
  [TarotTheme.MISSING_IN_RELATIONSHIP]:
    '지금 연애 관계에서 내가 놓치고 있는 것은?',
  [TarotTheme.RELATIONSHIP_LESSON]: '현재 연애가 나에게 주는 교훈은?',
};

// 타로 테마별 카테고리
export const tarotThemeCategories: Record<
  ValueOf<typeof TarotTheme>,
  ValueOf<typeof FortuneSubject>
> = {
  [TarotTheme.WORK_VALUE_ALIGNMENT]: FortuneSubject.CAREER,
  [TarotTheme.NEXT_CAREER_CHAPTER]: FortuneSubject.CAREER,
  [TarotTheme.HABIT_TO_CHANGE]: FortuneSubject.GROWTH,
  [TarotTheme.FIND_TRUE_PATH]: FortuneSubject.GROWTH,
  [TarotTheme.IGNORED_EMOTION]: FortuneSubject.EMOTION,
  [TarotTheme.CHANGE_EMOTION_TONE]: FortuneSubject.EMOTION,
  [TarotTheme.RELATIONSHIP_ROLE]: FortuneSubject.RELATIONSHIP,
  [TarotTheme.RESOLVE_CONFLICT]: FortuneSubject.RELATIONSHIP,
  [TarotTheme.STUDY_LIFE_PURPOSE]: FortuneSubject.STUDY,
  [TarotTheme.OVERCOME_EXAM_ANXIETY]: FortuneSubject.STUDY,
  [TarotTheme.MISSING_IN_RELATIONSHIP]: FortuneSubject.LOVE,
  [TarotTheme.RELATIONSHIP_LESSON]: FortuneSubject.LOVE,
};
