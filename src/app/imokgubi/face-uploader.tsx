'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { RefreshCcw, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import LoadingOverlay from '@/app/songil/components/LoadingOverlay';
import { useCamera } from '@/app/imokgubi/hooks/useCamera';
import {
  capturePhotoFromCanvas,
  fileToDataUrl,
} from '@/app/imokgubi/utils/imageProcessor';
import {
  uploadImage,
  analyzeImage,
} from '@/app/imokgubi/services/imokgubiService';

export default function FaceUploader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawContentsType = searchParams.get('contents') || 'myfuture';
  const contentsType = normalizeContentsType(rawContentsType);

  // 상태 관리
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 카메라 훅 사용
  const { streamRef, stopStream } = useCamera({
    facingMode,
    videoRef,
    enabled: !imageSrc && !isLoading,
    onError: setErrorText,
  });

  // 사진 촬영
  const capturePhoto = () => {
    const dataUrl = capturePhotoFromCanvas(videoRef, canvasRef, facingMode);
    if (dataUrl) {
      setImageSrc(dataUrl);
      stopStream();
    }
  };

  // 갤러리 선택
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setImageSrc(dataUrl);
      } catch (error) {
        setErrorText('파일을 읽을 수 없습니다.');
      }
    }
  };

  // 카메라 전환
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // 확인 및 분석 처리
  const handleConfirm = async () => {
    if (!imageSrc) return;

    try {
      setIsLoading(true);
      setErrorText(null);

      // 1단계: 이미지 업로드
      const uploadedImageUrl = await uploadImage(imageSrc);

      if (!uploadedImageUrl) {
        setErrorText('이미지 업로드에 실패했습니다.');
        return;
      }

      // 2단계: Premium 콘텐츠 체크
      if (rawContentsType.includes('premium')) {
        const line = normalizeContentsType(
          rawContentsType.replace(' premium', ''),
        );
        localStorage.setItem('temp_upload_image', uploadedImageUrl);
        router.push(
          `/songil/input?line=${line}&resultImage=${encodeURIComponent(uploadedImageUrl)}`,
        );
        return;
      }

      // 3단계: 분석 결과 가져오기
      const resultText = await analyzeImage(uploadedImageUrl, contentsType);

      // 4단계: 결과 페이지로 이동
      router.push(
        `/imokgubi/result?resultText=${encodeURIComponent(resultText)}&resultImage=${encodeURIComponent(uploadedImageUrl)}&contents=${encodeURIComponent(contentsType)}`,
      );
    } catch (error) {
      console.error('Error:', error);
      setErrorText(
        error instanceof Error
          ? error.message
          : '오류가 발생했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // [Case 1] 이미지 확인 화면
  if (imageSrc) {
    return (
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white">
        <div className="flex items-center p-4 pt-8 pb-4">
          <button onClick={() => setImageSrc(null)} disabled={isLoading}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="px-5 py-4">
          <h1 className="text-2xl font-bold text-gray-900">사진 촬영 완료</h1>
          <p className="mt-1 text-sm font-medium text-gray-600">
            이 사진으로 분석을 진행할까요?
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center px-8 py-4">
          <div className="relative aspect-[10/11] w-full max-w-xs overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
            <Image
              src={imageSrc}
              alt="Captured"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        {errorText && (
          <div className="mx-5 mb-4 rounded-2xl bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">{errorText}</p>
          </div>
        )}
        <div className="flex gap-3 px-5 pb-8">
          <button
            onClick={() => {
              setImageSrc(null);
              setErrorText(null);
            }}
            disabled={isLoading}
            className="h-16 flex-1 rounded-2xl bg-gray-100 text-base font-bold text-gray-700"
          >
            재촬영
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="h-16 flex-1 rounded-[15px] border-2 border-[#7A8CFF] bg-gradient-to-r from-[#7A8CFF] to-[#CAD1FF] text-base font-bold text-gray-900"
          >
            {isLoading ? '분석중...' : '확인'}
          </button>
        </div>
        <LoadingOverlay isLoading={isLoading} />
      </div>
    );
  }

  // [Case 2] 카메라 화면
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
      />

      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-32 bg-black/50" />

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-40 bg-black/50" />

      <div className="absolute top-0 right-0 left-0 z-20 flex h-24 items-center p-4 pt-4 pb-4">
        <button onClick={() => router.back()} className="">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>

        <span className="ml-2 text-lg font-bold text-white/80">
          이목구비 분석
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <mask id="holeMask">
              <rect width="100%" height="100%" fill="white" />
              <ellipse cx="50" cy="45" rx="40" ry="27" fill="black" />
            </mask>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="black"
            fillOpacity="0.5"
            mask="url(#holeMask)"
          />
        </svg>
      </div>
      <div className="absolute right-0 bottom-12 left-0 z-30 flex items-center justify-between px-8">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition hover:bg-black/50"
        >
          <ImageIcon className="h-6 w-6 text-white" />
        </button>

        <button
          onClick={capturePhoto}
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-transparent transition-all active:scale-95"
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </button>

        <button
          onClick={toggleCamera}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition hover:bg-black/50"
        >
          <RefreshCcw className="h-6 w-6 text-white" />
        </button>
      </div>

      {errorText && (
        <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black/90 px-6 py-4 text-center">
          <p className="text-sm font-medium text-white">{errorText}</p>
        </div>
      )}
    </div>
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
