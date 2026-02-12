'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { RefreshCcw, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import LoadingOverlay from '@/app/songil/components/LoadingOverlay';
import guideImage from '@/assets/images/songil/guide.svg';
import { useCamera } from '@/app/songil/hooks/useCamera';
import {
  capturePhotoFromCanvas,
  fileToDataUrl,
} from '@/app/songil/utils/imageProcessor';
import { uploadImage, analyzeImage } from '@/app/songil/services/songIlService';

export default function PalmUploader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentsType = searchParams.get('contents') || 'palmistry';

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
      if (contentsType.includes('premium')) {
        const line = contentsType.replace(' premium', '');
        localStorage.setItem('temp_upload_image', uploadedImageUrl);
        router.push(
          `/songil/input?line=${line}&resultImage=${encodeURIComponent(uploadedImageUrl)}`,
        );
        return;
      }

      // 3단계: 분석 결과 가져오기
      const resultText = await analyzeImage(uploadedImageUrl, contentsType);

      // 4단계: 결과 저장 및 페이지 이동
      localStorage.setItem('palmistry_result', resultText);
      localStorage.setItem('palmistry_image', uploadedImageUrl);

      router.push(`/songil/result?contents=${contentsType}`);
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
      <div className="relative flex h-full min-h-screen w-full flex-col bg-white">
        <div className="flex items-center p-4 pt-8 pb-4">
          <button onClick={() => setImageSrc(null)} disabled={isLoading}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="mb-6 px-5">
          <h1 className="mb-2 text-2xl font-extrabold text-gray-900">
            사진 확인
          </h1>
          <p className="text-sm font-medium text-gray-500">
            이 사진으로 분석을 진행할까요?
          </p>
        </div>

        <div className="mb-8 flex flex-1 items-center justify-center px-8">
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            <Image
              src={imageSrc}
              alt="Captured"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {errorText && (
          <div className="mx-5 mb-4 rounded-2xl bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">{errorText}</p>
          </div>
        )}

        <div className="mt-auto flex gap-3 px-5 pb-8">
          <button
            onClick={() => {
              setImageSrc(null);
              setErrorText(null);
            }}
            disabled={isLoading}
            className="h-14 flex-1 rounded-xl bg-gray-100 text-lg font-bold text-gray-600 disabled:opacity-50"
          >
            재촬영
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="h-14 flex-1 rounded-xl bg-[#F97B68] text-lg font-bold text-white disabled:opacity-50"
          >
            {isLoading ? '처리중...' : '확인'}
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

      <div className="pointer-events-none absolute top-0 h-32 w-full bg-black/50" />
      <div className="pointer-events-none absolute bottom-0 h-36 w-full bg-black/50" />

      <div className="absolute top-0 right-0 left-0 z-10 flex h-16 items-center px-4 pt-6">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <span className="ml-2 text-lg font-bold text-white">손금 촬영</span>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-[calc(100%-80px)]">
            <Image
              src={guideImage}
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-10 left-0 z-20 flex items-center justify-between px-10">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
        >
          <ImageIcon className="h-6 w-6 text-white" />
        </button>

        <button
          onClick={capturePhoto}
          className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-white bg-transparent transition-all active:scale-95"
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </button>

        <button
          onClick={toggleCamera}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
        >
          <RefreshCcw className="h-6 w-6 text-white" />
        </button>
      </div>

      {errorText && (
        <div className="center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black/80 px-4 py-3 text-sm text-white">
          {errorText}
        </div>
      )}
    </div>
  );
}
