'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { RefreshCcw, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import LoadingOverlay from '@/app/songil/components/LoadingOverlay';
import guideImage from '@/assets/images/songil/guide.svg';

export default function PalmUploader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentsType = searchParams.get('contents') || 'palmistry';

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
      const uploadResponse = await fetch(`${backendBase}/upload/palmistry`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (uploadResponse.status === 201) {
        const imageUrl = await uploadResponse.text();

        // Analytics 로깅
        console.log('손길 이미지 업로드', {
          screen_name: '손길 컨텐츠 화면',
          screen_class: 'palmDrama_uploader',
          event_class: 'palmDrama_image_upload',
        });

        return imageUrl;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);

      // Analytics 에러 로깅
      console.log('손길 이미지 업로드 오류', {
        screen_name: '손길 컨텐츠 화면',
        screen_class: 'palmDrama_uploader',
      });

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
  const getPalmistryResult = async (imageUrl: string) => {
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
    if (!backendBase) {
      throw new Error('BACKEND_BASE environment variable is not set');
    }

    // userId 가져오기 (인증 로직이 있다면 추가)
    // const userId = getUserId(); // 필요시 구현

    const apiUrl = `${backendBase}/openai/palmistry?imageUrl=${encodeURIComponent(imageUrl)}&category=${contentsType}&language=ko`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to get palmistry result: ${response.status}`);
    }

    const resultText = await response.text();

    console.log('Palmistry Result:', resultText);

    // 에러 응답 체크
    try {
      const resultJson = JSON.parse(resultText);
      if (resultJson.error === true) {
        const userMessage =
          resultJson.errorText ||
          '분석이 어려운 이미지입니다. 다시 촬영해주세요.';
        // throw new Error(userMessage);
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

      // 3단계: 손금 분석 결과 가져오기
      const resultText = await getPalmistryResult(uploadedImageUrl);

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

  // --- 렌더링 부분 (기존과 동일) ---

  // [Case 1] 촬영/선택된 이미지 확인 (Preview)
  if (imageSrc) {
    return (
      <div className="relative flex h-full min-h-screen w-full flex-col bg-white">
        {/* 상단바 */}
        <div className="flex items-center p-4 pt-8 pb-4">
          <button
            onClick={() => {
              setImageSrc(null); /* state바뀌면 useEffect가 알아서 카메라 켬 */
            }}
            disabled={isLoading}
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* 텍스트 */}
        <div className="mb-6 px-5">
          <h1 className="mb-2 text-2xl font-extrabold text-gray-900">
            사진 확인
          </h1>
          <p className="text-sm font-medium text-gray-500">
            이 사진으로 분석을 진행할까요?
          </p>
        </div>

        {/* 이미지 */}
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

        {/* 에러 메시지 */}
        {errorText && (
          <div className="mx-5 mb-4 rounded-2xl bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">{errorText}</p>
          </div>
        )}

        {/* 하단 버튼 */}
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

      {/* 비디오 화면 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
      />

      {/* 오버레이 디자인 */}
      <div className="pointer-events-none absolute top-0 h-32 w-full bg-black/50" />
      <div className="pointer-events-none absolute bottom-0 h-36 w-full bg-black/50" />

      {/* 뒤로가기 & 타이틀 */}
      <div className="absolute top-0 right-0 left-0 z-10 flex h-16 items-center px-4 pt-6">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <span className="ml-2 text-lg font-bold text-white">손금 촬영</span>
      </div>

      {/* 가이드라인 박스 */}
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

      {/* 하단 컨트롤러 */}
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
