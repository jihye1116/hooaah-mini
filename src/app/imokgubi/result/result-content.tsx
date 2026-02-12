'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import FaceResult, { type FaceResultData } from './face-result';
import FutureResult, { type FutureResultData } from './future-result';
import AnimalResult, { AnimalResultData } from './animal-result';

export default function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<
    FutureResultData | FaceResultData | Record<string, unknown> | null
  >(null);
  const [resultImage, setResultImage] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const rawContentsType = searchParams.get('contents') || 'myfuture';
  const contentsType = normalizeContentsType(rawContentsType);

  useEffect(() => {
    const resultText = searchParams.get('resultText');
    const resultImageParam = searchParams.get('resultImage');

    if (resultText) {
      try {
        const parsedResult = JSON.parse(resultText);
        setResult(parsedResult);
      } catch (e) {
        setErrorText(resultText);
      }
    }

    if (resultImageParam) {
      setResultImage(resultImageParam);
    }
  }, [searchParams]);

  if (!result) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">
            {errorText ? errorText : '로딩 중...'}
          </p>
        </div>
      </div>
    );
  }

  if (contentsType === 'myFuture') {
    return (
      <FutureResult
        result={result as FutureResultData}
        resultImage={resultImage}
        onBack={() => router.back()}
      />
    );
  }

  if (contentsType === 'myAnimal') {
    return (
      <AnimalResult
        result={result as AnimalResultData}
        resultImage={resultImage}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <FaceResult
      result={result as FaceResultData}
      resultImage={resultImage}
      onBack={() => router.back()}
    />
  );
}

const normalizeContentsType = (value: string) => {
  const normalized = value.replace(/\s+/g, '').toLowerCase();

  switch (normalized) {
    case 'myfuture':
      return 'myFuture';
    case 'mypair':
      return 'myPair';
    case 'myanimal':
      return 'myAnimal';
    case 'mytype':
      return 'myType';
    default:
      return value;
  }
};
