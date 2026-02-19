// Hand Images
import dragonHand from '@/assets/images/songil/hands/dragon.png';
import phoenixHand from '@/assets/images/songil/hands/phoenix.png';
import snakeHand from '@/assets/images/songil/hands/snake.png';
import monkeyHand from '@/assets/images/songil/hands/monkey.png';
import buddhaHand from '@/assets/images/songil/hands/buddha.png';
import tigerHand from '@/assets/images/songil/hands/tiger.png';

// Palmistry Line Images
import lifeLineImage from '@/assets/images/songil/palmistry/life.png';
import emotionLineImage from '@/assets/images/songil/palmistry/emotion.png';
import destinyLineImage from '@/assets/images/songil/palmistry/destiny.png';
import intelligenceLineImage from '@/assets/images/songil/palmistry/intelligence.png';
import marriageLineImage from '@/assets/images/songil/palmistry/marriage.png';
import sunLineImage from '@/assets/images/songil/palmistry/sun.png';
import wealthLineImage from '@/assets/images/songil/palmistry/wealth.png';

// Destiny Line Details
import destinyCurveFlat from '@/assets/images/songil/palmistry/destiny/curve_flat.png';
import destinyCurveNormal from '@/assets/images/songil/palmistry/destiny/curve_normal.png';
import destinyCurveSteep from '@/assets/images/songil/palmistry/destiny/curve_steep.png';
import destinyTypeDiversion from '@/assets/images/songil/palmistry/destiny/type_diversion.png';
import destinyTypeLong from '@/assets/images/songil/palmistry/destiny/type_long.png';
import destinyTypeShort from '@/assets/images/songil/palmistry/destiny/type_short.png';

// Emotion Line Details
import emotionCurveFlat from '@/assets/images/songil/palmistry/emotion/curve_flat.png';
import emotionCurveNormal from '@/assets/images/songil/palmistry/emotion/curve_normal.png';
import emotionCurveSteep from '@/assets/images/songil/palmistry/emotion/curve_steep.png';
import emotionTypeDiversion from '@/assets/images/songil/palmistry/emotion/type_diversion.png';
import emotionTypeLong from '@/assets/images/songil/palmistry/emotion/type_long.png';
import emotionTypeShort from '@/assets/images/songil/palmistry/emotion/type_short.png';

// Intelligence Line Details
import intelligenceCurveFlat from '@/assets/images/songil/palmistry/intelligence/curve_flat.png';
import intelligenceCurveNormal from '@/assets/images/songil/palmistry/intelligence/curve_normal.png';
import intelligenceCurveSteep from '@/assets/images/songil/palmistry/intelligence/curve_steep.png';
import intelligenceTypeDiversion from '@/assets/images/songil/palmistry/intelligence/type_diversion.png';
import intelligenceTypeLong from '@/assets/images/songil/palmistry/intelligence/type_long.png';
import intelligenceTypePinky from '@/assets/images/songil/palmistry/intelligence/type_pinky.png';
import intelligenceTypeShort from '@/assets/images/songil/palmistry/intelligence/type_short.png';

// Life Line Details
import lifeCurveFlat from '@/assets/images/songil/palmistry/life/curve_flat.png';
import lifeCurveNormal from '@/assets/images/songil/palmistry/life/curve_normal.png';
import lifeCurveSteep from '@/assets/images/songil/palmistry/life/curve_steep.png';
import lifeTypeCross from '@/assets/images/songil/palmistry/life/type_cross.png';
import lifeTypeDiversion from '@/assets/images/songil/palmistry/life/type_diversion.png';
import lifeTypeNormal from '@/assets/images/songil/palmistry/life/type_normal.png';
import lifeTypeParallel from '@/assets/images/songil/palmistry/life/type_parallel.png';
import lifeTypeShort from '@/assets/images/songil/palmistry/life/type_short.png';

// Marriage Line Details
import marriageCurveFlat from '@/assets/images/songil/palmistry/marriage/curve_flat.png';
import marriageCurveNormal from '@/assets/images/songil/palmistry/marriage/curve_normal.png';
import marriageCurveSteep from '@/assets/images/songil/palmistry/marriage/curve_steep.png';
import marriageTypeDouble from '@/assets/images/songil/palmistry/marriage/type_double.png';
import marriageTypePinky from '@/assets/images/songil/palmistry/marriage/type_pinky.png';
import marriageTypeSingle from '@/assets/images/songil/palmistry/marriage/type_single.png';

// Sun Line Details
import sunCurveFlat from '@/assets/images/songil/palmistry/sun/curve_flat.png';
import sunCurveNormal from '@/assets/images/songil/palmistry/sun/curve_normal.png';
import sunCurveSteep from '@/assets/images/songil/palmistry/sun/curve_steep.png';
import sunTypeDiversion from '@/assets/images/songil/palmistry/sun/type_diversion.png';
import sunTypeLong from '@/assets/images/songil/palmistry/sun/type_long.png';
import sunTypeShort from '@/assets/images/songil/palmistry/sun/type_short.png';

// Wealth Line Details
import wealthCurveFlat from '@/assets/images/songil/palmistry/wealth/curve_flat.png';
import wealthCurveNormal from '@/assets/images/songil/palmistry/wealth/curve_normal.png';
import wealthCurveSteep from '@/assets/images/songil/palmistry/wealth/curve_steep.png';
import wealthTypeDiversion from '@/assets/images/songil/palmistry/wealth/type_diversion.png';
import wealthTypeLong from '@/assets/images/songil/palmistry/wealth/type_long.png';
import wealthTypeShort from '@/assets/images/songil/palmistry/wealth/type_short.png';

import { StaticImageData } from 'next/image';

export const HAND_IMAGES: Record<string, StaticImageData> = {
  dragon: dragonHand,
  phoenix: phoenixHand,
  snake: snakeHand,
  monkey: monkeyHand,
  buddha: buddhaHand,
  tiger: tigerHand,
};

export const LINE_IMAGES: Record<string, StaticImageData> = {
  life: lifeLineImage,
  emotion: emotionLineImage,
  destiny: destinyLineImage,
  intelligence: intelligenceLineImage,
  marriage: marriageLineImage,
  sun: sunLineImage,
  wealth: wealthLineImage,
};

export const LINE_DETAIL_IMAGES: Record<
  string,
  {
    curve: Record<string, StaticImageData>;
    type: Record<string, StaticImageData>;
  }
> = {
  destiny: {
    curve: {
      flat: destinyCurveFlat,
      normal: destinyCurveNormal,
      steep: destinyCurveSteep,
    },
    type: {
      diversion: destinyTypeDiversion,
      long: destinyTypeLong,
      short: destinyTypeShort,
    },
  },
  emotion: {
    curve: {
      flat: emotionCurveFlat,
      normal: emotionCurveNormal,
      steep: emotionCurveSteep,
    },
    type: {
      diversion: emotionTypeDiversion,
      long: emotionTypeLong,
      short: emotionTypeShort,
    },
  },
  intelligence: {
    curve: {
      flat: intelligenceCurveFlat,
      normal: intelligenceCurveNormal,
      steep: intelligenceCurveSteep,
    },
    type: {
      diversion: intelligenceTypeDiversion,
      long: intelligenceTypeLong,
      pinky: intelligenceTypePinky,
      short: intelligenceTypeShort,
    },
  },
  life: {
    curve: {
      flat: lifeCurveFlat,
      normal: lifeCurveNormal,
      steep: lifeCurveSteep,
    },
    type: {
      cross: lifeTypeCross,
      diversion: lifeTypeDiversion,
      normal: lifeTypeNormal,
      parallel: lifeTypeParallel,
      short: lifeTypeShort,
    },
  },
  marriage: {
    curve: {
      flat: marriageCurveFlat,
      normal: marriageCurveNormal,
      steep: marriageCurveSteep,
    },
    type: {
      double: marriageTypeDouble,
      pinky: marriageTypePinky,
      single: marriageTypeSingle,
    },
  },
  sun: {
    curve: {
      flat: sunCurveFlat,
      normal: sunCurveNormal,
      steep: sunCurveSteep,
    },
    type: {
      diversion: sunTypeDiversion,
      long: sunTypeLong,
      short: sunTypeShort,
    },
  },
  wealth: {
    curve: {
      flat: wealthCurveFlat,
      normal: wealthCurveNormal,
      steep: wealthCurveSteep,
    },
    type: {
      diversion: wealthTypeDiversion,
      long: wealthTypeLong,
      short: wealthTypeShort,
    },
  },
};
