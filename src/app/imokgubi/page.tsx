'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { RefreshCcw, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import LoadingOverlay from '@/app/songil/components/LoadingOverlay';

export default function FaceUploader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentsType = searchParams.get('contents') || 'myFace';

  // 1. 상태 관리
  // streamRef: 렌더링과 상관없이 카메라 스트림을 잡아두기 위함
  const streamRef = useRef<MediaStream | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // 2. DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. 카메라 초기화 및 정리 (useEffect 안에 로직 통합)
  useEffect(() => {
    // 이미지가 있거나(결과확인중), 로딩중이면 카메라 켜지 않음
    if (imageSrc || isLoading) return;

    let currentStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        // 기존 스트림 정리 (방어 코드)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode, // 상태값 사용
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: false,
        });

        currentStream = stream;
        streamRef.current = stream; // 캡처용 Ref에 저장

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera Error:', err);
        // 비동기 안에서의 setState는 안전함
        setErrorText('카메라 권한을 확인해주세요.');
      }
    };

    initCamera();

    // Cleanup: 컴포넌트가 죽거나, facingMode가 바뀔 때 실행
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, imageSrc, isLoading]); // 의존성은 이제 '값' 뿐임. 함수 없음.

  // 4. 사진 촬영
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // 좌우 반전 처리 (셀카일 때)
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImageSrc(dataUrl);

        // 촬영 후 스트림 정지 (배터리 절약)
        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
    }
  };

  // 5. 갤러리 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImageSrc(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 6. 카메라 전환
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // 7. 이미지 업로드
  const uploadImage = async (): Promise<string> => {
    if (!imageSrc) return '';

    try {
      const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
      if (!backendBase) {
        throw new Error('BACKEND_BASE environment variable is not set');
      }

      // base64를 Blob으로 변환
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // 이미지 압축 (quality: 100, EXIF 보존)
      const compressedBlob = await compressImage(blob);

      // FormData 생성
      const formData = new FormData();
      const timestamp = Date.now();
      formData.append(
        'image',
        compressedBlob,
        `compressed_image_${timestamp}.jpg`,
      );

      // 서버로 업로드
      const uploadResponse = await fetch(`${backendBase}/upload/physiognomy`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (uploadResponse.status === 201) {
        const imageUrl = await uploadResponse.text();

        // Analytics 로깅

        return imageUrl;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);

      // Analytics 에러 로깅

      throw error;
    }
  };

  // 이미지 압축 함수
  const compressImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // 원본 크기 유지
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          // 이미지 그리기
          ctx.drawImage(img, 0, 0);

          // quality: 100으로 압축 (JPEG)
          canvas.toBlob(
            (compressedBlob) => {
              if (compressedBlob) {
                resolve(compressedBlob);
              } else {
                reject(new Error('Image compression failed'));
              }
            },
            'image/jpeg',
            1.0, // quality: 100%
          );
        } else {
          reject(new Error('Canvas context is null'));
        }
      };

      img.onerror = () => {
        reject(new Error('Image load failed'));
      };

      img.src = URL.createObjectURL(blob);
    });
  };

  // 8. 손금 분석 결과 가져오기
  const getfaceResult = async (imageUrl: string) => {
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
    if (!backendBase) {
      throw new Error('BACKEND_BASE environment variable is not set');
    }

    // userId 가져오기 (인증 로직이 있다면 추가)
    // const userId = getUserId(); // 필요시 구현

    const apiUrl = `${backendBase}/openai/physiognomy?imageUrl=${encodeURIComponent(imageUrl)}&category=${contentsType}&language=ko`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to get physiognomy result: ${response.status}`);
    }

    const resultText = await response.text();

    console.log('physiognomy Result:', resultText);

    // 에러 응답 체크
    try {
      const resultJson = JSON.parse(resultText);
      if (resultJson.error === true) {
        const userMessage =
          resultJson.errorText ||
          '분석이 어려운 이미지입니다. 다시 촬영해주세요.';
        throw new Error(userMessage);
      }
    } catch (e) {
      // JSON 파싱 실패 시에는 원래 텍스트 반환
      if (e instanceof SyntaxError) {
        // JSON이 아닌 경우 그냥 진행
      } else {
        // 우리가 던진 에러는 다시 throw
        throw e;
      }
    }

    return resultText;
  };

  // 9. 확인 및 분석 처리
  const handleConfirm = async () => {
    if (!imageSrc) return;

    try {
      setIsLoading(true);
      setErrorText(null);

      // 1단계: 이미지 업로드
      const uploadedImageUrl = await uploadImage();

      if (!uploadedImageUrl) {
        setErrorText('이미지 업로드에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      // 2단계: Premium 콘텐츠 체크
      if (contentsType.includes('premium')) {
        // Premium 콘텐츠는 다른 입력 화면으로 이동
        const line = contentsType.replace(' premium', '');
        localStorage.setItem('temp_upload_image', uploadedImageUrl);
        router.push(
          `/songil/input?line=${line}&resultImage=${encodeURIComponent(uploadedImageUrl)}`,
        );
        setIsLoading(false);
        return;
      }

      // 3단계: 얼굴 분석 결과 가져오기
      const resultText = await getfaceResult(uploadedImageUrl);

      // 4단계: 결과 페이지로 이동
      router.push(
        `/imokgubi/result?resultText=${encodeURIComponent(resultText)}&resultImage=${encodeURIComponent(uploadedImageUrl)}`,
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

  // --- 렌더링 부분 (기존과 동일) ---

  // [Case 1] 촬영/선택된 이미지 확인 (Preview)
  if (imageSrc) {
    return (
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white">
        {/* 상단바 */}
        <div className="z-10 flex items-center gap-3 bg-white px-5 pt-4 pb-2">
          <button
            onClick={() => {
              setImageSrc(null);
            }}
            disabled={isLoading}
            className="p-2 disabled:opacity-50"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* 텍스트 섹션 */}
        <div className="px-5 py-4">
          <h1 className="text-2xl font-bold text-gray-900">사진 촬영 완료</h1>
          <p className="mt-1 text-sm font-medium text-gray-600">
            이 사진으로 분석을 진행할까요?
          </p>
        </div>

        {/* 이미지 영역 */}
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

        {/* 하단 버튼 영역 */}
        <div className="flex gap-3 px-5 pb-8">
          <button
            onClick={() => {
              setImageSrc(null);
            }}
            disabled={isLoading}
            className="h-16 flex-1 rounded-2xl bg-gray-100 text-base font-bold text-gray-700 transition active:scale-95 disabled:opacity-50"
          >
            재촬영
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="h-16 flex-1 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-300 text-base font-bold text-gray-900 transition active:scale-95 disabled:opacity-50"
          >
            {isLoading ? '분석중...' : '확인'}
          </button>
        </div>

        {/* 로딩 오버레이 */}
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

      {/* 비디오 화면 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
      />

      {/* 상단 검은색 오버레이 */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-32 bg-black/50" />

      {/* 하단 검은색 오버레이 */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-40 bg-black/50" />

      {/* 뒤로가기 & 타이틀 */}
      <div className="absolute top-0 right-0 left-0 z-20 flex h-24 items-center px-4 pt-2">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <span className="ml-2 text-lg font-bold text-white/80">
          이목구비 분석
        </span>
      </div>

      {/* 오버레이 영역 */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          preserveAspectRatio="none" // 비율 상관없이 부모 컨테이너(480px)에 꽉 채움
        >
          <defs>
            <mask id="holeMask">
              {/* 1. 전체 화면을 흰색으로 칠함 (보이는 영역) */}
              <rect width="100%" height="100%" fill="white" />

              {/* 2. 가운데 타원을 검은색으로 칠함 (뚫리는 영역) */}
              {/* rx="40": 좌우 폭을 80%까지 넓혀서 시원하게 뚫음 (양옆 여백 10%씩) */}
              {/* ry="35": 얼굴 길이에 맞춤 */}
              <ellipse cx="50" cy="45" rx="40" ry="27" fill="black" />
            </mask>
          </defs>

          {/* 3. 마스크 적용된 검은 배경 (테두리 선 없음) */}
          <rect
            width="100%"
            height="100%"
            fill="black"
            fillOpacity="0.5" // 바깥 어두운 정도
            mask="url(#holeMask)"
          />
        </svg>
      </div>
      {/* 하단 컨트롤러 */}
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
