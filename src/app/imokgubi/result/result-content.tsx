'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react'; // useEffect, useState 제거, useMemo 추가

import AnimalResult, {
  type AnimalResultData,
} from '@/app/imokgubi/result/animal-result';
import { type AnimalKey } from '@/app/imokgubi/constant/animalImages';
import FaceResult, {
  type FaceResultData,
} from '@/app/imokgubi/result/face-result';
import FutureResult, {
  type FutureResultData,
} from '@/app/imokgubi/result/future-result';
import PairResultScreen, {
  type PairResultData,
} from '@/app/imokgubi/result/pair-result';
import TypeResultScreen from './type-result';

// 타입 정의를 밖으로 빼거나 재사용하여 가독성을 높입니다.
type ResultType =
  | FutureResultData
  | FaceResultData
  | AnimalResultData
  | PairResultData
  | Record<string, unknown>
  | null;

export default function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { result, errorText } = useMemo<{
    result: ResultType;
    errorText: string;
  }>(() => {
    const resultText = searchParams.get('resultText');

    if (!resultText) {
      return { result: null, errorText: '' };
    }

    try {
      const parsedResult = JSON.parse(resultText);
      return { result: parsedResult, errorText: '' };
    } catch (e) {
      return { result: null, errorText: resultText };
    }
  }, [searchParams]);

  const resultImage = searchParams.get('resultImage') || '';

  const rawContentsType = searchParams.get('contents') || 'myfuture';
  const contentsType = normalizeContentsType(rawContentsType);

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
    const animalKey = (result as Record<string, unknown>)?.animal;

    if (!animalKey || typeof animalKey !== 'string') {
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
        animal={animalKey as AnimalKey}
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

  if (contentsType === 'myType') {
    return (
      <TypeResultScreen
      // result={result as Record<string, unknown>}
      // resultImage={resultImage}
      // onBack={() => router.back()}
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
