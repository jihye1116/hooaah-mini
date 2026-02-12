'use client';

import { useEffect, useState } from 'react';
import {
  hasAccessPermission,
  saveAccessPermission,
  validateAccessCode,
} from '../app/gonnabe/horoscope/utils/accessCode';
import AccessCodeModal from './AccessCodeModal';

interface PremiumContentGateProps {
  themeId: string;
  themeTitle: string;
  backgroundImage?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 프리미엄 콘텐츠 접근 제어 게이트
 * 클라이언트 컴포넌트로 localStorage 접근 및 코드 입력 처리
 */
export default function PremiumContentGate({
  themeId,
  themeTitle,
  backgroundImage,
  children,
}: PremiumContentGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    // 클라이언트에서만 localStorage 접근
    const hasPermission = hasAccessPermission(themeId);
    setHasAccess(hasPermission);
  }, [themeId]);

  const handleCodeSubmit = (code: string): boolean => {
    // 코드 검증
    if (validateAccessCode(code)) {
      // 접근 권한 저장
      saveAccessPermission(themeId);
      setHasAccess(true);
      return true;
    }
    return false;
  };

  // 로딩 중 (초기 마운트 시)
  if (hasAccess === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 접근 권한이 없는 경우
  if (!hasAccess) {
    return (
      <AccessCodeModal
        title={themeTitle}
        onCodeSubmit={handleCodeSubmit}
        backgroundImage={backgroundImage}
      />
    );
  }

  // 접근 권한이 있는 경우
  return <>{children}</>;
}
