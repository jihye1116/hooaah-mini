// 레거시 호환성을 위한 리다이렉트 파일
// 실제 구현은 @/utils/premium 와 @/utils/premiumAccess로 이동되었습니다

export { isPremiumContent, isPremiumTheme } from '@/utils/premium';
export {
  validateAccessCode,
  saveAccessPermission,
  hasAccessPermission,
  clearAccessPermission,
} from '@/utils/premiumAccess';
