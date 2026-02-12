'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import BottomButton from '@/components/BottomButton';

interface ResultData {
  overall: string;
  destiny: Array<{
    look: string;
    reason: string;
  }>;
  charming: {
    tag: string[];
    description: string;
  };
  personality: {
    chart: Array<{
      type: string;
      score: number;
      brief: string;
    }>;
    analysis: string;
  };
  social: Array<{
    title: string;
    description: string;
  }>;
  error: boolean;
  errorText: string;
}

const TypeResultScreen = () => {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [errorText, setErrorText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // URL에서 쿼리 파라미터 추출
  const resultText =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('resultText') || ''
      : '';
  const resultImage =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('resultImage') || ''
      : '';

  useEffect(() => {
    if (resultText) {
      try {
        const parsedResult = JSON.parse(resultText);
        if (parsedResult.error) {
          setErrorText(
            parsedResult.errorText || '분석 중 오류가 발생했습니다.',
          );
          setResult(null);
        } else {
          setResult(parsedResult);
          setErrorText('');
        }
      } catch (e) {
        setErrorText('결과를 불러올 수 없습니다.');
        setResult(null);
      }
    }
  }, [resultText]);

  const saveResult = async () => {
    try {
      setIsSaving(true);
      const timestamp = Date.now().toString();
      const savedData = {
        resultText,
        resultImage,
        timestamp,
      };

      // localStorage에 저장
      localStorage.setItem(
        `imokgubi_result_${timestamp}`,
        JSON.stringify(savedData),
      );

      alert('결과가 저장되었습니다.');
    } catch (e) {
      console.error(e);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* 스크롤 컨테이너 */}
      <div className="overflow-y-auto pb-32">
        {/* 상단 패딩 및 백버튼 */}
        <div className="px-5 pt-8">
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-[#54575D]" />
          </button>
        </div>

        {/* 제목 섹션 */}
        <div className="mt-4 mb-8 text-center">
          <p className="mb-1 text-sm font-semibold text-[#7A8CFF]">
            관상 분석 결과
          </p>
          <h1 className="text-2xl font-bold text-[#313866]">운명의 이상형</h1>
        </div>

        {/* 에러 상태 표시 */}
        {errorText && (
          <div className="mb-8 px-5">
            <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
              <p className="text-center text-sm text-red-600">{errorText}</p>
            </div>
          </div>
        )}

        {/* 결과 이미지 */}
        {resultImage && (
          <div className="mb-8 px-11">
            <div className="relative aspect-[9/10] w-full overflow-hidden rounded-3xl bg-white">
              <Image
                src={resultImage}
                alt="Result"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* 전체 평가 */}
        {result?.overall && (
          <div className="mb-8 px-5">
            <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
              <p className="text-center text-sm font-semibold text-[#6270CC]">
                {result.overall}
              </p>
            </div>
          </div>
        )}

        {/* 운명 섹션 */}
        {result?.destiny && result.destiny.length > 0 && (
          <div className="mb-8 px-5">
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-[#111111]">
                당신의 운명의 이상형은?
              </h2>
              <div className="space-y-6">
                {result.destiny.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="mb-2.5 text-base font-semibold text-[#111111]">
                      {item.look}
                    </h3>
                    <p className="text-sm text-[#54575D]">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 매력 포인트 섹션 */}
        {result?.charming && (
          <div className="mb-8 px-5">
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-[#111111]">
                이상형의 분위기 & 매력 포인트
              </h2>

              {/* 태그들 */}
              {result.charming.tag && result.charming.tag.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2.5">
                  {result.charming.tag.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-[#E4E8FF] px-2.5 py-1.5 text-xs font-semibold text-[#6270CC]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 설명 */}
              {result.charming.description && (
                <p className="text-sm text-[#54575D]">
                  {result.charming.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 성격 분석 섹션 */}
        {result?.personality && (
          <div className="mb-8 px-5">
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-[#111111]">
                이상형의 성격은
              </h2>

              {/* 차트들 */}
              {result.personality.chart &&
                result.personality.chart.length > 0 && (
                  <div className="mb-6 space-y-8">
                    {result.personality.chart.map((item, idx) => (
                      <div key={idx}>
                        <div className="mb-4 flex items-start gap-8">
                          <div className="w-20 flex-shrink-0">
                            <p className="text-sm font-semibold text-[#54575D]">
                              {item.type}
                            </p>
                          </div>
                          <div className="flex-1">
                            {/* 프로그레스 바 */}
                            <div className="mb-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#54575D]">
                              <div
                                className="h-full rounded-full bg-[#7A8CFF] transition-all"
                                style={{
                                  width: `${item.score || 0}%`,
                                }}
                              />
                            </div>
                            <p className="text-sm leading-relaxed text-[#54575D]">
                              {item.brief}
                            </p>
                          </div>
                          <div className="w-12 flex-shrink-0 text-right">
                            <p className="text-xs font-bold text-[#54575D]">
                              {item.score}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* 구분선 */}
              <div className="mb-6 border-t-2 border-[#E4E8FF]" />

              {/* AI 분석 */}
              {result.personality.analysis && (
                <div>
                  <h3 className="mb-2.5 text-lg font-bold text-[#111111]">
                    AI 분석 기반 종합 평가
                  </h3>
                  <p className="text-sm text-[#54575D]">
                    {result.personality.analysis}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 사회생활 섹션 */}
        {result?.social && result.social.length > 0 && (
          <div className="mb-8 px-5">
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-[#111111]">
                대인관계 특성
              </h2>
              <div className="space-y-6">
                {result.social.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="mb-2.5 text-base font-semibold text-[#111111]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#54575D]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="">
        <BottomButton onClick={() => router.back()} />
      </div>
    </div>
  );
};

export default TypeResultScreen;
