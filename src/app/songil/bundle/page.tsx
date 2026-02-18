import PalmUploader from '@/app/songil/palm-uploader';
import PremiumContentGate from '@/components/PremiumContentGate';
import { isPremiumContent } from '@/utils/premium';
import { Suspense } from 'react';

interface BundlePageProps {
  searchParams?: Promise<{
    bundle?: string;
  }>;
}

export default async function Page({ searchParams }: BundlePageProps) {
  const { bundle } = (await searchParams) ?? {};

  // 유료 콘텐츠인지 확인
  const isPremium = bundle ? isPremiumContent(`songil:${bundle}`) : false;

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
      <PalmUploader
        contentsType={`bundle${bundle ? `:${bundle}` : ''}`}
        resultPath="bundle"
      />
    </Suspense>
  );

  // 유료 콘텐츠인 경우 PremiumContentGate로 감싸기
  if (isPremium && bundle) {
    return (
      <PremiumContentGate contentId={`songil:${bundle}`} title="손금 번들">
        {content}
      </PremiumContentGate>
    );
  }

  return content;
}
