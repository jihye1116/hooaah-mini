import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export interface FutureResultData {
  overall: string;
  ten: {
    title: string;
    description: string;
  };
  partner: {
    title: string;
    description: string;
  };
  twenty: string;
  thirty: string;
  forty: string;
  fifty: string;
}

interface FutureResultProps {
  result: FutureResultData;
  resultImage: string;
  onBack: () => void;
}

export default function FutureResult({
  result,
  resultImage,
  onBack,
}: FutureResultProps) {
  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] pb-36">
      <div className="mx-auto w-full max-w-2xl px-5">
        <div className="pt-8">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
          >
            <ArrowLeft className="h-5 w-5 text-[#54575D]" />
          </button>
        </div>

        <div className="pt-4 pb-6 text-center">
          <p className="text-sm font-semibold text-[#7A8CFF]">이목구비 결과</p>
          <h1 className="mt-1 text-2xl font-bold text-[#313866]">미래 운세</h1>
        </div>

        <div className="mb-6 px-6">
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

        <div className="mb-8 rounded-2xl border-2 border-[#7A8CFF] bg-white px-4 py-3">
          <p className="text-center text-sm font-semibold text-[#6270CC]">
            {result.overall}
          </p>
        </div>

        <div className="mb-6 rounded-2xl bg-white px-6 py-6">
          <h2 className="text-lg font-semibold text-[#111111]">종합 운세</h2>
          <div className="mt-6">
            <p className="text-base font-semibold text-[#111111]">
              {result.ten?.title || ''}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#54575D]">
              {result.ten?.description || ''}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white px-6 py-6">
          <h2 className="text-lg font-semibold text-[#111111]">인연 운세</h2>
          <div className="mt-6">
            <p className="text-base font-semibold text-[#54575D]">
              {result.partner?.title || ''}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#54575D]">
              {result.partner?.description || ''}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white px-6 py-6">
          <h2 className="text-lg font-semibold text-[#111111]">미래 분석</h2>

          <div className="mt-6">
            <p className="text-base font-semibold text-[#54575D]">20대 운세</p>
            <p className="mt-2 text-sm leading-relaxed text-[#54575D]">
              {result.twenty}
            </p>
          </div>

          <div className="mt-5">
            <p className="text-base font-semibold text-[#54575D]">30대 운세</p>
            <p className="mt-2 text-sm leading-relaxed text-[#54575D]">
              {result.thirty}
            </p>
          </div>

          <div className="mt-5">
            <p className="text-base font-semibold text-[#54575D]">40대 운세</p>
            <p className="mt-2 text-sm leading-relaxed text-[#54575D]">
              {result.forty}
            </p>
          </div>

          <div className="mt-5">
            <p className="text-base font-semibold text-[#54575D]">50대 운세</p>
            <p className="mt-2 text-sm leading-relaxed text-[#54575D]">
              {result.fifty}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 bg-white px-5 pt-4 pb-8">
        <button
          onClick={onBack}
          className="w-full rounded-[15px] border-2 border-[#7A8CFF] bg-gradient-to-r from-[#7A8CFF] to-[#CAD1FF] py-4 text-base font-bold text-white"
        >
          다시하기
        </button>
      </div>
    </div>
  );
}
