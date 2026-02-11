'use client';

import { useState } from 'react';

interface AccessCodeModalProps {
  title: string;
  onCodeSubmit: (code: string) => boolean;
  backgroundImage?: React.ReactNode;
}

export default function AccessCodeModal({
  title,
  onCodeSubmit,
  backgroundImage,
}: AccessCodeModalProps) {
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');

    if (!accessCode.trim()) {
      setCodeError('접근 코드를 입력해주세요.');
      return;
    }

    setIsValidating(true);

    // 코드 검증
    const isValid = onCodeSubmit(accessCode);

    if (!isValid) {
      setCodeError('유효하지 않은 접근 코드입니다.');
      setIsValidating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {backgroundImage && (
        <div className="relative aspect-square w-full blur-sm">
          {backgroundImage}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-800">
              🔒 프리미엄 콘텐츠
            </div>
            <h1 className="font-playfair-display mb-3 text-xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-sm text-gray-600">
              이 콘텐츠는 유료 서비스입니다.
              <br />
              접근 코드를 입력해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setCodeError('');
                }}
                placeholder="HOOAAH2026"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg font-semibold tracking-wider uppercase focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                disabled={isValidating}
                autoComplete="off"
                autoFocus
              />
              {codeError && (
                <p className="mt-2 text-center text-sm text-red-600">
                  {codeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isValidating}
              className="w-full rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isValidating ? '확인 중...' : '확인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
