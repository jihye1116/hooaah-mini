'use client';

const STORAGE_KEY = 'premium_content_access';

// 유료 콘텐츠 접근 코드 (실제 운영 시에는 서버에서 관리해야 합니다)
const VALID_ACCESS_CODES = ['HOOAAH2026', 'PREMIUM123', '123123'];

/**
 * 접근 코드 검증
 * @param code - 입력받은 접근 코드
 */
export function validateAccessCode(code: string): boolean {
  // 현재는 모든 콘텐츠가 같은 코드를 사용
  // 추후 백엔드에서 contentId별 코드를 관리하도록 변경
  return VALID_ACCESS_CODES.includes(code.toUpperCase().trim());
}

/**
 * 유료 접근 권한 저장
 * @param contentId - 콘텐츠 식별자 (예: 'horoscope:zodiac_dating_style', 'imokgubi:myfuture')
 */
export function saveAccessPermission(contentId: string): void {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(STORAGE_KEY);
  const accessedContents = stored ? JSON.parse(stored) : [];

  if (!accessedContents.includes(contentId)) {
    accessedContents.push(contentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accessedContents));
  }
}

/**
 * 유료 접근 권한 확인
 * @param contentId - 콘텐츠 식별자 (예: 'horoscope:zodiac_dating_style', 'imokgubi:myfuture')
 */
export function hasAccessPermission(contentId: string): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;

  const accessedContents = JSON.parse(stored);
  return accessedContents.includes(contentId);
}

/**
 * 유료 접근 권한 초기화 (테스트용)
 */
export function clearAccessPermission(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
