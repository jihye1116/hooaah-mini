import { loadFortune } from '@/app/gonnabe/horoscope/api/fortune';
import { FortuneTheme } from '@/app/gonnabe/horoscope/types/fortune';
import fortuneCookieResultImage from '@/assets/images/gonnabe/fortune_cookie_after.png';
import Image from 'next/image';

export default async function FortuneCookieResultPage() {
  const { fortuneData } = await loadFortune('test-user-id', FortuneTheme.TODAY);

  return (
    <div className="flex size-full flex-col items-center bg-white p-8">
      <h1 className="font-playfair-display my-16 text-2xl font-semibold">
        오늘의 운세
      </h1>

      <Image
        src={fortuneCookieResultImage}
        alt="Fortune Cookie Result"
        className="w-50"
        priority
      />

      <div className="mt-12 flex w-[clamp(15rem,80vw,25rem)] flex-col items-center gap-4 rounded-xl bg-[#FFF7F7] p-5">
        <span className="text-[14px] text-[#6B6B6B]">오늘의 메시지</span>
        <p className="text-xl font-semibold text-[#282424]">
          {JSON.stringify(fortuneData)}
        </p>
      </div>

      <span className="mt-16 mb-5 text-[14px] text-[#6B6B6B]">
        오늘 나에게 행운을 가져다 줄 것은?
      </span>

      <div className="flex w-[clamp(15rem,70vw,20rem)] flex-wrap justify-center gap-x-2 gap-y-4">
        <div className="rounded-3xl border border-[#6E572A] px-5 py-1">
          <span className="font-playfair-display font-medium text-black">
            노란색
          </span>
        </div>
        <div className="rounded-3xl border border-[#6E572A] px-5 py-1">
          <span className="font-playfair-display font-medium text-black">
            노란색
          </span>
        </div>
        <div className="rounded-3xl border border-[#6E572A] px-5 py-1">
          <span className="font-playfair-display font-medium text-black">
            노란색
          </span>
        </div>
        <div className="rounded-3xl border border-[#6E572A] px-5 py-1">
          <span className="font-playfair-display font-medium text-black">
            노란색
          </span>
        </div>
        <div className="rounded-3xl border border-[#6E572A] px-5 py-1">
          <span className="font-playfair-display font-medium text-black">
            노란색
          </span>
        </div>
        <div className="rounded-3xl border border-[#6E572A] px-5 py-1">
          <span className="font-playfair-display font-medium text-black">
            노란색
          </span>
        </div>
      </div>
    </div>
  );
}
