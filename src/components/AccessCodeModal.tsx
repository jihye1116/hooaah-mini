'use client';

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

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
  const [codes, setCodes] = useState<string[]>(Array(6).fill(''));
  const [codeError, setCodeError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, value: string) => {
    // 숫자와 영문만 허용
    const sanitized = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    if (sanitized.length > 1) return;

    const newCodes = [...codes];
    newCodes[index] = sanitized;
    setCodes(newCodes);
    setCodeError('');

    // 값이 입력되면 다음 칸으로 이동
    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCodes = [...codes];
      newCodes[index - 1] = '';
      setCodes(newCodes);
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData('text')
      .replace(/[^0-9A-Za-z]/g, '')
      .toUpperCase();

    const newCodes = [...codes];
    for (let i = 0; i < Math.min(pastedText.length, 6); i++) {
      newCodes[i] = pastedText[i];
    }
    setCodes(newCodes);
    setCodeError('');

    // 마지막으로 붙여넣은 위치로 포커스 이동
    const lastIndex = Math.min(pastedText.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');

    const code = codes.join('');
    if (code.length !== 6) {
      setCodeError('6자리 코드를 모두 입력해주세요.');
      return;
    }

    setIsValidating(true);

    // 코드 검증
    setTimeout(() => {
      const isValid = onCodeSubmit(code);

      if (!isValid) {
        setCodeError('유효하지 않은 접근 코드입니다.');
        setIsValidating(false);
        // 입력 칸 초기화
        setCodes(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
    }, 300);
  };

  const isComplete = codes.every((code) => code !== '');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* 배경 장식 요소 */}
      <div className="floating-bg absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute top-[50%] left-[10%] h-96 w-96 rounded-full bg-teal-400/5 blur-3xl" />
        <div className="absolute top-[20%] right-[10%] h-80 w-80 rounded-full bg-amber-400/8 blur-3xl" />
        <div className="absolute bottom-[20%] left-[30%] h-72 w-72 rounded-full bg-teal-400/3 blur-3xl" />
      </div>

      {backgroundImage && (
        <div className="absolute inset-0">
          <div className="relative h-full w-full opacity-30 blur-md">
            {backgroundImage}
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="glass-container relative mx-4 w-full max-w-[380px] overflow-hidden rounded-3xl border border-black/8 bg-white/90 p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-[20px]">
          {/* 상단 라인 효과 */}
          <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-40" />

          <div className="mb-10 text-center">
            <h1 className="mb-4 text-2xl font-medium tracking-tight text-gray-800">
              코드 번호를 입력해 주세요
            </h1>
            <p className="text-sm leading-relaxed font-light text-gray-600">
              코드번호는 사이트에서 결제완료 후
              <br />
              문자로 전송됩니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <div className="mb-6 flex justify-center gap-3">
                {codes.map((code, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={code}
                    onChange={(e) => handleInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => setCodeError('')}
                    className={`h-14 w-12 rounded-xl border-[1.5px] bg-white/80 text-center font-mono text-xl font-medium tracking-tight transition-all duration-300 outline-none ${
                      codeError
                        ? 'animate-shake border-red-400'
                        : code
                          ? 'border-teal-500 bg-teal-50/10 shadow-[0_0_20px_rgba(0,212,170,0.3)]'
                          : 'border-black/10'
                    } focus:scale-105 focus:border-teal-500 focus:bg-white focus:shadow-[0_0_20px_rgba(0,212,170,0.3)] disabled:cursor-not-allowed disabled:opacity-50`}
                    disabled={isValidating}
                    autoFocus={index === 0}
                    autoComplete="off"
                    placeholder="●"
                  />
                ))}
              </div>

              {codeError && (
                <p className="animate-fadeIn text-center text-[13px] text-red-600">
                  {codeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isComplete || isValidating}
              className={`shine-effect group relative h-[52px] w-full overflow-hidden rounded-2xl font-medium text-white transition-all duration-300 ${
                isComplete && !isValidating
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-[0_4px_16px_rgba(0,212,170,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,212,170,0.4)]'
                  : 'cursor-not-allowed bg-gray-300'
              } disabled:opacity-50`}
            >
              {/* 샤인 효과 */}
              {isComplete && !isValidating && (
                <div className="shine-overlay absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full" />
              )}
              {isValidating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  확인 중...
                </span>
              ) : (
                '확인'
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .floating-bg {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
