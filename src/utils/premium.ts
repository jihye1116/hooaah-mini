// 프리미엄 콘텐츠 판단 로직 (서버/클라이언트 양쪽 사용 가능)

import {
  HOROSCOPE_PREMIUM_CONTENTS,
  TAROT_PREMIUM_CONTENTS,
} from '@/app/gonnabe/constants/premium';
import { SONGIL_PREMIUM_CONTENTS } from '@/app/songil/constants/premium';
import { IMOKGUBI_PREMIUM_CONTENTS } from '@/app/imokgubi/constants/premium';

// 콘텐츠 타입별 프리미엄 콘텐츠 맵
const PREMIUM_CONTENT_MAP: Record<string, readonly string[]> = {
  horoscope: HOROSCOPE_PREMIUM_CONTENTS,
  tarot: TAROT_PREMIUM_CONTENTS,
  songil: SONGIL_PREMIUM_CONTENTS,
  imokgubi: IMOKGUBI_PREMIUM_CONTENTS,
};

/**
 * 유료 콘텐츠인지 확인
 * 서버/클라이언트 양쪽에서 사용 가능
 * @param contentId - 콘텐츠 식별자 (예: 'horoscope:zodiac_dating_style', 'imokgubi:myfuture', 'songil:palm')
 */
export function isPremiumContent(contentId: string): boolean {
  const parts = contentId.split(':');
  if (parts.length < 2) return false;

  const [type, id] = parts;
  const premiumContents = PREMIUM_CONTENT_MAP[type];

  return premiumContents?.includes(id) ?? false;
}

/**
 * 유료 테마인지 확인 (하위 호환성)
 * horoscope 테마만 체크합니다.
 * @deprecated isPremiumContent 사용 권장
 */
export function isPremiumTheme(theme: string): boolean {
  return (HOROSCOPE_PREMIUM_CONTENTS as readonly string[]).includes(theme);
}
