'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import FaceResult, { type FaceResultData } from './face-result';
import FutureResult, { type FutureResultData } from './future-result';
import AnimalResult, { type AnimalResultData } from './animal-result';
import PairResultScreen, { type PairResultData } from './pair-result';

export default function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<
    | FutureResultData
    | FaceResultData
    | AnimalResultData
    | PairResultData
    | Record<string, unknown>
    | null
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
    // For animal results, we expect the result to contain the animal key
    const animalKey = (result as { animal?: string }).animal;

    if (!animalKey) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600">동물 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      );
    }

    return (
      <AnimalResult
        animal={animalKey as any}
        resultImage={resultImage}
        onBack={() => router.back()}
      />
    );
  }

  if (contentsType === 'myPair') {
    return (
      <PairResultScreen
        result={result as PairResultData}
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
