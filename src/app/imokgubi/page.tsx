import FaceUploader from '@/app/imokgubi/face-uploader';
import PremiumContentGate from '@/components/PremiumContentGate';
import { isPremiumContent } from '@/utils/premium';
import { Suspense } from 'react';

interface ImokgubiPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function Page({ searchParams }: ImokgubiPageProps) {
  const { category } = (await searchParams) ?? {};

  // 유료 콘텐츠인지 확인
  const isPremium = category ? isPremiumContent(`imokgubi:${category}`) : false;

  const content = (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <FaceUploader />
    </Suspense>
  );

  // 유료 콘텐츠인 경우 PremiumContentGate로 감싸기
  if (isPremium && category) {
    return (
      <PremiumContentGate
        contentId={`imokgubi:${category}`}
        title={
          category === 'myfuture'
            ? '미래 운세'
            : category === 'myanimal'
              ? '나의 동물상'
              : '얼굴 분석'
        }
      >
        {content}
      </PremiumContentGate>
    );
  }

  return content;
}
