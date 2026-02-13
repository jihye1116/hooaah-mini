'use client';

import { PREMIUM_THEMES } from '@/app/gonnabe/horoscope/types/fortune';

const STORAGE_KEY = 'horoscope_premium_access';

// 유료 테마 접근 코드 (실제 운영 시에는 서버에서 관리해야 합니다)
const VALID_ACCESS_CODES = ['HOOAAH2026', 'PREMIUM123', '123123'];

/**
 * 접근 코드 검증
 */
export function validateAccessCode(code: string): boolean {
  return VALID_ACCESS_CODES.includes(code.toUpperCase().trim());
}

/**
 * 유료 테마인지 확인
 */
export function isPremiumTheme(theme: string): boolean {
  return PREMIUM_THEMES.includes(theme as (typeof PREMIUM_THEMES)[number]);
}

/**
 * 유료 접근 권한 저장
 */
export function saveAccessPermission(theme: string): void {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(STORAGE_KEY);
  const accessedThemes = stored ? JSON.parse(stored) : [];

  if (!accessedThemes.includes(theme)) {
    accessedThemes.push(theme);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accessedThemes));
  }
}

/**
 * 유료 접근 권한 확인
 */
export function hasAccessPermission(theme: string): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;

  const accessedThemes = JSON.parse(stored);
  return accessedThemes.includes(theme);
}

/**
 * 유료 접근 권한 초기화 (테스트용)
 */
export function clearAccessPermission(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
