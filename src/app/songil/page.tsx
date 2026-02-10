'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { RefreshCcw, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import LoadingOverlay from '@/app/songil/components/LoadingOverlay';

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

  // 7. 확인 및 업로드 이동
  const handleConfirm = async () => {
    if (!imageSrc) return;
    try {
      setIsLoading(true);
      localStorage.setItem('temp_upload_image', imageSrc);
      // TODO: 실제 처리 로직을 여기에 추가
      setTimeout(() => {
        router.push(`/songil/result?contents=${contentsType}`);
      }, 2000); // 2초 후 이동
      // setTimeout(() => {
      //   router.push(`/songil/result?contents=${contentsType}`);
      // }, 2000); // 2초 후 이동
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  // --- 렌더링 부분 (기존과 동일) ---

  // [Case 1] 촬영/선택된 이미지 확인 (Preview)
  if (imageSrc) {
    return (
      <div className="relative flex flex-col w-full h-full min-h-screen bg-white">
        {/* 상단바 */}
        <div className="flex items-center p-4 pt-8 pb-4">
          <button
            onClick={() => {
              setImageSrc(null); /* state바뀌면 useEffect가 알아서 카메라 켬 */
            }}
            disabled={isLoading}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 텍스트 */}
        <div className="px-5 mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            사진 확인
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            이 사진으로 분석을 진행할까요?
          </p>
        </div>

        {/* 이미지 */}
        <div className="px-8 mb-8 flex-1 flex items-center justify-center">
          <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-lg">
            <Image
              src={imageSrc}
              alt="Captured"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto px-5 pb-8 flex gap-3">
          <button
            onClick={() => {
              setImageSrc(null);
            }}
            disabled={isLoading}
            className="flex-1 h-14 rounded-xl bg-gray-100 text-gray-600 font-bold text-lg disabled:opacity-50"
          >
            재촬영
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 h-14 rounded-xl bg-[#F97B68] text-white font-bold text-lg shadow-lg disabled:opacity-50"
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
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
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
      />

      {/* 오버레이 디자인 */}
      <div className="absolute top-0 w-full h-32 bg-black/50  pointer-events-none" />
      <div className="absolute bottom-0 w-full h-36 bg-black/50  pointer-events-none" />

      {/* 뒤로가기 & 타이틀 */}
      <div className="absolute top-0 left-0 right-0 pt-6 px-4 flex items-center z-10 h-16">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="text-white w-6 h-6" />
        </button>
        <span className="ml-2 text-white font-bold text-lg drop-shadow-md">
          손금 촬영
        </span>
      </div>

      {/* 가이드라인 박스 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[calc(100%-80px)] h-full">
            <Image
              src="/images/guide.svg"
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 하단 컨트롤러 */}
      <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-between items-center z-20">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
        >
          <ImageIcon className="text-white w-6 h-6" />
        </button>

        <button
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center bg-transparent active:scale-95 transition-all"
        >
          <div className="w-16 h-16 bg-white rounded-full" />
        </button>

        <button
          onClick={toggleCamera}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
        >
          <RefreshCcw className="text-white w-6 h-6" />
        </button>
      </div>

      {errorText && (
        <div className="absolute center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-3 rounded-xl text-sm">
          {errorText}
        </div>
      )}
    </div>
  );
}
