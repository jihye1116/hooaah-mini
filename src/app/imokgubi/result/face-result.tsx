import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

import noseIcon from '@/assets/images/imokgubi/icons/nose.png';
import earIcon from '@/assets/images/imokgubi/icons/ear.png';
import mouthIcon from '@/assets/images/imokgubi/icons/mouth.png';
import eyeIcon from '@/assets/images/imokgubi/icons/eye.png';
import eyebrowIcon from '@/assets/images/imokgubi/icons/eyebrow.png';
import faceIcon from '@/assets/images/imokgubi/icons/face.png';
import dotIcon from '@/assets/images/imokgubi/icons/dot.png';

export interface FaceResultData {
  overall: string;
  nose: string;
  ear: string;
  mouth: string;
  eye: string;
  eyebrow: string;
  face: string;
  dot: string;
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

interface FaceResultProps {
  result: FaceResultData;
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

const iconMap: { [key: string]: any } = {
  nose: noseIcon,
  ear: earIcon,
  mouth: mouthIcon,
  eye: eyeIcon,
  eyebrow: eyebrowIcon,
  face: faceIcon,
  dot: dotIcon,
};

const AnalysisSection = ({
  icon,
  title,
  content,
}: {
  icon: string;
  title: string;
  content: string;
}) => (
  <div className="mb-8 flex items-start gap-2.5">
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 p-2">
      <Image src={iconMap[icon]} alt={title} width={28} height={28} />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="mb-1.5 text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm leading-normal text-gray-500">{content}</p>
    </div>
  </div>
);

export default function FaceResult({
  result,
  resultImage,
  onBack,
}: FaceResultProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-32">
      <div className="sticky top-0 z-10">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <button
            onClick={onBack}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5">
        <div className="pt-6 pb-8 text-center">
          <p className="mb-2 text-sm font-semibold text-blue-500">
            이목구비 분석 결과
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            당신의 얼굴 이야기
          </h1>
        </div>

        <div className="mb-8">
          <div className="relative aspect-[9/10] w-full overflow-hidden rounded-3xl bg-white">
            {resultImage && (
              <Image
                src={resultImage}
                alt="분석 결과"
                fill
                className="object-cover"
              />
            )}
          </div>
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

          <AnalysisSection icon="nose" title="코 분석" content={result.nose} />
          <AnalysisSection icon="ear" title="귀 분석" content={result.ear} />
          <AnalysisSection
            icon="mouth"
            title="입 분석"
            content={result.mouth}
          />
          <AnalysisSection icon="eye" title="눈 분석" content={result.eye} />
          <AnalysisSection
            icon="eyebrow"
            title="눈썹 분석"
            content={result.eyebrow}
          />
          <AnalysisSection
            icon="face"
            title="얼굴형 분석"
            content={result.face}
          />
          <AnalysisSection icon="dot" title="점 분석" content={result.dot} />
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6">
          <h2 className="mb-6 text-lg font-bold text-gray-900">
            얼굴형 특성 분석
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {result.analysis}
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6">
          <h2 className="mb-8 text-lg font-bold text-gray-900">성격 분석</h2>

          <div className="mb-8">
            <div className="mb-4 flex items-start gap-8">
              <span className="w-20 flex-shrink-0 text-sm font-semibold text-gray-700">
                리더십
              </span>
              <div className="flex-1">
                <ScoreBar score={result.personality.leadership.score} />
                <p className="mt-1.5 text-xs leading-relaxed text-gray-700">
                  {result.personality.leadership.brief}
                </p>
              </div>
              <span className="flex-shrink-0 text-xs font-bold text-gray-700">
                {result.personality.leadership.score}%
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex items-start gap-8">
              <span className="w-20 flex-shrink-0 text-sm font-semibold text-gray-700">
                창의성
              </span>
              <div className="flex-1">
                <ScoreBar score={result.personality.creativity.score} />
                <p className="mt-1.5 text-xs leading-relaxed text-gray-700">
                  {result.personality.creativity.brief}
                </p>
              </div>
              <span className="flex-shrink-0 text-xs font-bold text-gray-700">
                {result.personality.creativity.score}%
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex items-start gap-8">
              <span className="w-20 flex-shrink-0 text-sm font-semibold text-gray-700">
                신뢰도
              </span>
              <div className="flex-1">
                <ScoreBar score={result.personality.credibility.score} />
                <p className="mt-1.5 text-xs leading-relaxed text-gray-700">
                  {result.personality.credibility.brief}
                </p>
              </div>
              <span className="flex-shrink-0 text-xs font-bold text-gray-700">
                {result.personality.credibility.score}%
              </span>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-blue-100 pt-6">
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              AI 종합 분석
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {result.personality.analysis}
            </p>
          </div>
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

      <div className="fixed bottom-0 w-full max-w-[480px] bg-white p-4 pb-8">
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 rounded-xl border-2 border-[#7A8CFF] bg-gradient-to-r from-[#7A8CFF] to-[#CAD1FF] py-4 font-bold text-white"
          >
            다시하기
          </button>
        </div>
      </div>
    </div>
  );
}
