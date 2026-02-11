import { Suspense } from 'react';
import ResultContent from './result-content';

export default function ImokgubiResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
