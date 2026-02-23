import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import BottomButton from '@/components/BottomButton';

export interface FortuneResultData {
  advice: string;
  health: { score: number; brief: string; face: string; points: string[] };
  intelligence: {
    score: number;
    brief: string;
    face: string;
    points: string[];
  };
  relationship: {
    score: number;
    brief: string;
    face: string;
    points: string[];
  };
  finance: { score: number; brief: string; face: string; points: string[] };
  determination: {
    score: number;
    brief: string;
    face: string;
    points: string[];
  };
  flow: { score: number; brief: string; face: string; points: string[] };
  summary: string;
  overall: string[];
}

interface FortuneResultProps {
  result: FortuneResultData;
  resultImage: string;
  onBack: () => void;
}

const ScoreBar = ({ score, brief }: { score: number; brief: string }) => (
  <div className="flex-1">
    <div className="mb-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#54575D]">
      <div
        className="h-full rounded-full bg-[#7A8CFF] transition-all"
        style={{ width: `${score}%` }}
      />
    </div>
    <p className="text-sm leading-relaxed text-[#54575D]">{brief}</p>
  </div>
);

export default function FortuneResult({
  result,
  resultImage,
  onBack,
}: FortuneResultProps) {
  const sections = [
    { key: 'health', label: '건강 기운', data: result.health },
    { key: 'intelligence', label: '지성운', data: result.intelligence },
    { key: 'relationship', label: '대인 관계운', data: result.relationship },
    { key: 'finance', label: '재물 복덕운', data: result.finance },
    { key: 'determination', label: '결단력 지수', data: result.determination },
    { key: 'flow', label: '운명 흐름도', data: result.flow },
  ] as const;

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] pb-36">
      <div className="mx-auto w-full max-w-2xl">
        <div className="px-5 pt-8">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-[#54575D]" />
          </button>
        </div>

        <div className="pt-4 pb-6 text-center">
          <p className="text-sm font-semibold text-[#7A8CFF]">관상 분석 결과</p>
          <h1 className="mt-1 text-2xl font-bold text-[#313866]">
            나의 운세 흐름은?
          </h1>
        </div>

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

        <div className="mb-8 px-5">
          <div className="rounded-2xl border-2 border-[#E4E8FF] bg-white px-4 py-4">
            <p className="text-center text-base font-semibold text-[#6270CC]">
              {result.advice}
            </p>
          </div>
        </div>

        {/* 전반적인 운세 */}
        <div className="mb-6 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">
              종합 운세 분석
            </h2>
            <div className="space-y-6">
              {sections.map(({ key, label, data }) => (
                <div key={key} className="flex items-start gap-4">
                  <span className="w-[70px] flex-shrink-0 text-sm font-semibold text-[#54575D]">
                    {label}
                  </span>
                  <ScoreBar score={data.score} brief={data.brief} />
                  <span className="flex-shrink-0 text-xs font-bold text-[#54575D]">
                    {data.score}%
                  </span>
                </div>
              ))}
            </div>

            <div className="my-8 border-t-2 border-[#E4E8FF]" />

            <h3 className="mb-3 text-lg font-bold text-[#111111]">
              AI 분석 기반 종합 평가
            </h3>
            <p className="text-sm leading-relaxed text-[#54575D]">
              {result.summary}
            </p>
          </div>
        </div>

        {/* 상세 분석 */}
        <div className="mb-6 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">
              자세한 관상 분석
            </h2>
            <div className="space-y-8">
              {sections.map(({ key, label, data }) => (
                <div key={key}>
                  <div className="mb-3 inline-block rounded-md bg-[#E4E8FF] px-2.5 py-1.5">
                    <span className="text-xs font-semibold text-[#6270CC]">
                      {label}
                    </span>
                  </div>
                  <h3 className="mb-3 text-base font-bold text-[#111111]">
                    {data.face}
                  </h3>
                  <ul className="space-y-1.5">
                    {data.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="text-sm font-light text-[#54575D]"
                      >
                        · {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 종합 결론 */}
        <div className="mb-8 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-[#111111]">
              종합 분석 결과
            </h2>
            <div className="space-y-4">
              {result.overall.map((text, idx) => (
                <p key={idx} className="text-sm font-semibold text-[#54575D]">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-safe fixed inset-x-0 bottom-0 mx-auto max-w-[480px] border-t border-gray-100 bg-white pt-4">
        <BottomButton onClick={onBack} />
      </div>
    </div>
  );
}
