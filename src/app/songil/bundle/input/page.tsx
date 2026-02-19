'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { uploadImage } from '@/app/songil/services/songIlService';

export default function BundleInputPage() {
  const router = useRouter();
  const [birthday, setBirthday] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // 번들 타입 확인 (연애운 vs 재물운)
  const [bundleType, setBundleType] = useState<string>('');

  useEffect(() => {
    const savedType = localStorage.getItem('temp_bundle_type');
    if (savedType) {
      // contentsType에서 bundle 타입 추출 (e.g., "bundle:wealth" -> "wealth")
      const bundleTypeValue = savedType.split(':')[1] || 'love';
      setTimeout(() => setBundleType(bundleTypeValue), 0);
    }
  }, []);

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 추출

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // YYYYMMDD 형식으로 포맷
    if (value.length >= 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length >= 7) {
      value = value.slice(0, 7) + '-' + value.slice(7);
    }

    setBirthday(value);
  };

  const handleConfirm = async () => {
    if (!birthday || birthday.length < 10) {
      setErrorText('생년월일을 올바르게 입력해주세요 (YYYY-MM-DD)');
      return;
    }

    const imageSrc = localStorage.getItem('temp_bundle_image');
    if (!imageSrc) {
      setErrorText('이미지를 찾을 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorText(null);

      // 1단계: 이미지 업로드
      const uploadedImageUrl = await uploadImage(imageSrc);

      if (!uploadedImageUrl) {
        setErrorText('이미지 업로드에 실패했습니다.');
        return;
      }

      const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
      if (!backendBase) {
        throw new Error('BACKEND_BASE environment variable is not set');
      }

      // 번들 타입에 따라 라인 결정
      let lines: string[] = [];
      if (bundleType.includes('love') || bundleType.includes('연애')) {
        lines = ['destiny', 'emotion', 'marriage'];
      } else if (bundleType.includes('wealth') || bundleType.includes('재물')) {
        lines = ['wealth', 'sun', 'destiny'];
      } else {
        // 기본값: 연애운
        lines = ['destiny', 'emotion', 'marriage'];
      }

      // 3개의 라인에 대해 각각 요청 (업로드된 이미지 URL 사용)
      const promises = lines.map((line) => {
        const queryParams = new URLSearchParams({
          imageUrl: uploadedImageUrl,
          line: line,
          birthday: birthday,
          language: 'ko',
        }).toString();

        return fetch(`${backendBase}/openai/palmistryPremium?${queryParams}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }).then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              `Failed to get palmistry result for ${line}: ${res.status}`,
            );
          }
          return res.json();
        });
      });

      const results = await Promise.all(promises);

      // 결과를 로컬 스토리지에 저장
      const linesData: Record<
        string,
        { score: string; summary: string; description: string[] }
      > = {};
      lines.forEach((line, index) => {
        linesData[line] = results[index] || {
          score: '0',
          summary: '',
          description: [],
        };
      });

      const bundleResult = {
        hand: results[0]?.hand || 'dragon',
        lines: linesData,
        bundleAnalysis: results[0]?.bundleAnalysis || '',
        error: false,
        errorText: '',
      };

      localStorage.setItem('bundle_result', JSON.stringify(bundleResult));
      localStorage.setItem('bundle_image', uploadedImageUrl);
      localStorage.setItem('bundle_type', bundleType);

      // 임시 데이터 삭제
      localStorage.removeItem('temp_bundle_image');
      localStorage.removeItem('temp_bundle_type');

      // 결과 페이지로 이동
      router.push('/songil/bundle/result');
    } catch (error) {
      console.error('Error:', error);
      setErrorText(
        error instanceof Error
          ? error.message
          : '오류가 발생했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F3F1]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[#F5F3F1] px-4 pt-4 pb-2">
        <Link href="/songil/bundle" className="-ml-2 inline-block p-2">
          <ChevronLeft className="h-6 w-6 text-[#696969]" />
        </Link>
      </header>

      <main className="flex-1 px-5 py-6">
        {/* 타이틀 */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-bold text-[#F97B68]">
            손금 번들 분석
          </h2>
          <h1 className="mb-3 text-2xl font-bold text-[#883A2E]">
            생년월일을 입력해주세요
          </h1>
          <p className="text-sm font-medium text-[#696969]">
            더 정확한 분석을 위해 생년월일이 필요합니다.
          </p>
        </div>

        {/* 생년월일 입력 */}
        <div className="mb-6">
          <label
            htmlFor="birthday"
            className="mb-2 block text-sm font-bold text-[#111111]"
          >
            생년월일
          </label>
          <input
            id="birthday"
            type="text"
            value={birthday}
            onChange={handleBirthdayChange}
            placeholder="YYYY-MM-DD"
            className="w-full rounded-xl border-2 border-[#F5F6F8] bg-white px-4 py-3 text-base font-medium text-[#111111] placeholder:text-[#BDBDBD] focus:border-[#F97B68] focus:outline-none"
            maxLength={10}
          />
          <p className="mt-2 text-xs text-[#696969]">예: 1990-01-01</p>
        </div>

        {/* 에러 메시지 */}
        {errorText && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">{errorText}</p>
          </div>
        )}
      </main>

      {/* 확인 버튼 */}
      <div className="sticky bottom-0 bg-[#F5F3F1] px-5 pt-4 pb-8">
        <button
          onClick={handleConfirm}
          disabled={isLoading || !birthday || birthday.length < 10}
          className="h-14 w-full rounded-xl bg-[#F97B68] text-lg font-bold text-white disabled:opacity-50"
        >
          {isLoading ? '분석 중...' : '분석 시작'}
        </button>
      </div>
    </div>
  );
}
