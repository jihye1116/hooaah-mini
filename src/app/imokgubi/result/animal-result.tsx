import Image from 'next/image';
import BottomButton from '@/components/BottomButton';

export interface AnimalResultData {
  overall: string;
  analysis: string;
  personality: {
    leadership: {
      brief: string;
      score: number;
    };
    creativity: {
      brief: string;
      score: number;
    };
    credibility: {
      brief: string;
      score: number;
    };
    analysis: string;
  };
  social: Array<{
    title: string;
    description: string;
  }>;
}

interface AnimalResultProps {
  result: AnimalResultData;
  resultImage: string;
  onBack: () => void;
}

const ScoreBar = ({ score }: { score: number }) => (
  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-400">
    <div
      className="h-full rounded-full bg-blue-500 transition-all"
      style={{ width: `${score}%` }}
    />
  </div>
);

export default function AnimalResult({
  result,
  resultImage,
  onBack,
}: AnimalResultProps) {
  if (!result?.personality?.analysis) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-32">
      <div className="mx-auto max-w-2xl px-5">
        <div className="pt-6 pb-8 text-center">
          <p className="mb-2 text-sm font-semibold text-blue-500">
            동물 분석 결과
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            당신의 동물 이야기
          </h1>
        </div>

        <div className="mb-8 rounded-2xl border-2 border-blue-500 bg-white p-4">
          <p className="text-center text-sm font-semibold text-blue-600">
            {result.overall}
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6">
          <h2 className="mb-8 text-lg font-bold text-gray-900">
            상세 분석 결과
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {result.analysis}
          </p>
        </div>

        <div className="mt-8 border-t-2 border-blue-100 pt-6">
          <h3 className="mb-3 text-lg font-bold text-gray-900">AI 종합 분석</h3>
          <p className="text-sm leading-relaxed text-gray-700">
            {result.personality.analysis}
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6">
          <h2 className="mb-6 text-lg font-bold text-gray-900">관계 분석</h2>

          {result.social.map((item, index) => (
            <div key={index} className={index > 0 ? 'mt-6' : ''}>
              <h3 className="mb-2.5 text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-700">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomButton onClick={onBack} />
    </div>
  );
}
