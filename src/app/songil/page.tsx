import PalmUploader from '@/app/songil/palm-uploader';
import PremiumContentGate from '@/components/PremiumContentGate';
import { isPremiumContent } from '@/utils/premium';
import { Suspense } from 'react';

interface SongilPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function Page({ searchParams }: SongilPageProps) {
  const { category } = (await searchParams) ?? {};

  // 유료 콘텐츠인지 확인
  const isPremium = category ? isPremiumContent(`songil:${category}`) : false;

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
      <PalmUploader />
    </Suspense>
  );

  // 유료 콘텐츠인 경우 PremiumContentGate로 감싸기
  if (isPremium && category) {
    return (
      <PremiumContentGate
        contentId={`songil:${category}`}
        title={category === 'myfuture' ? '미래 운세' : '손금'}
      >
        {content}
      </PremiumContentGate>
    );
  }

  return content;
}
