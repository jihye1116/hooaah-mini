import fortuneCookieResultImage from '@/assets/images/gonnabe/fortune_cookie_after.png';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface FortuneCookieResult {
  fortuneData: {
    zodiacSign: string;
    theme: string;
    data: {
      keyword: string;
      description: string;
    };
  };
  luckyNumber: number;
}

interface FortuneCookieResultPageProps {
  searchParams?: Promise<{
    data?: string;
  }>;
}

export default async function FortuneCookieResultPage({
  searchParams,
}: FortuneCookieResultPageProps) {
  const { data } = (await searchParams) ?? {};

  // 데이터가 없으면 메인 페이지로 리다이렉트
  if (!data) {
    redirect('/gonnabe/horoscope/fortune-cookie');
  }

  let fortuneResult: FortuneCookieResult | null = null;

  try {
    const decodedData = decodeURIComponent(data);
    fortuneResult = JSON.parse(decodedData) as FortuneCookieResult;
  } catch {
    try {
      fortuneResult = JSON.parse(data) as FortuneCookieResult;
    } catch {
      redirect('/gonnabe/horoscope/fortune-cookie');
    }
  }

  if (!fortuneResult) {
    redirect('/gonnabe/horoscope/fortune-cookie');
  }

  const { fortuneData } = fortuneResult;
  const keywordList = fortuneData.data.keyword
    ? fortuneData.data.keyword
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    : [];

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
        <p className="text-center text-xl font-semibold text-[#282424]">
          {fortuneData.data.description}
        </p>
      </div>

      <span className="mt-16 mb-5 text-[14px] text-[#6B6B6B]">
        오늘 나에게 행운을 가져다 줄 것은?
      </span>

      <div className="flex w-[clamp(15rem,70vw,20rem)] flex-wrap justify-center gap-x-2 gap-y-4">
        {keywordList.map((keyword) => (
          <div
            key={keyword}
            className="rounded-3xl border border-[#6E572A] px-5 py-1"
          >
            <span className="font-playfair-display font-medium text-black">
              {keyword}
            </span>
          </div>
        ))}
        {keywordList.length === 0 && (
          <span className="text-[14px] text-[#6B6B6B]">정보 없음</span>
        )}
      </div>
    </div>
  );
}
