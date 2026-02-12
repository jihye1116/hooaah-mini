'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Plus, RefreshCcw, Info, ShieldCheck } from 'lucide-react';
import LoadingOverlay from '@/app/songil/components/LoadingOverlay'; // 경로 확인 필요
import { fileToDataUrl } from '@/app/imokgubi/utils/imageProcessor'; // 경로 확인 필요
import {
  uploadImage,
  analyzePairImage,
} from '@/app/imokgubi/services/imokgubiService';
import privacyIcon from '@/assets/images/imokgubi/icons/privacy.svg';
import faceIcon from '@/assets/images/imokgubi/icons/logo.svg';

export default function DoubleFaceUploader() {
  const router = useRouter();

  // 상태 관리: 나(Left)와 상대방(Right) 이미지
  const [myImageSrc, setMyImageSrc] = useState<string | null>(null);
  const [yourImageSrc, setYourImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // 현재 어떤 슬롯을 수정 중인지 추적 ('my' | 'your' | null)
  const activeSlotRef = useRef<'my' | 'your' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlotRef.current) {
      try {
        const dataUrl = await fileToDataUrl(file);
        if (activeSlotRef.current === 'my') {
          setMyImageSrc(dataUrl);
        } else {
          setYourImageSrc(dataUrl);
        }
      } catch (error) {
        setErrorText('이미지를 읽을 수 없습니다.');
      }
    }
    // 초기화 (같은 파일 다시 선택 가능하게)
    e.target.value = '';
    activeSlotRef.current = null;
  };

  // 슬롯 클릭 시 파일 입력창 열기
  const triggerFileInput = (slot: 'my' | 'your') => {
    activeSlotRef.current = slot;
    fileInputRef.current?.click();
  };

  // 궁합 분석 시작
  const handleAnalyze = async () => {
    if (!myImageSrc || !yourImageSrc) {
      setErrorText('두 사람의 사진을 모두 등록해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorText(null);

      // 1. 두 이미지 병렬 업로드
      const uploadPromises = [
        uploadImage(myImageSrc),
        uploadImage(yourImageSrc),
      ];

      const [myUrl, yourUrl] = await Promise.all(uploadPromises);

      if (!myUrl || !yourUrl) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      // 2. 분석 요청 (서비스 함수가 2개 URL을 받도록 수정 필요)
      // Dart 코드 참조: category=mypair (또는 props로 전달된 contents)
      const resultText = await analyzePairImage(myUrl, yourUrl, 'myPair');

      // 3. 결과 페이지 이동
      router.push(
        `/imokgubi/result?resultText=${encodeURIComponent(resultText)}&resultImage=${encodeURIComponent(myUrl)}&resultImage2=${encodeURIComponent(yourUrl)}&contents=myPair`,
      );
    } catch (error) {
      console.error('Error:', error);
      setErrorText(
        error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center p-4 pt-6">
        <button onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="px-5 pb-4">
        <p className="text-sm font-semibold text-[#7A8CFF]">
          우린 얼마나 잘 맞을까?
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#313866]">
          얼굴 궁합 분석
        </h1>
      </div>

      {/* Image Slots Area */}
      <div className="flex w-full gap-3 px-5">
        {/* My Face Slot */}
        <ImageSlot
          imageSrc={myImageSrc}
          label="나의 얼굴"
          onClick={() => triggerFileInput('my')}
        />

        {/* Your Face Slot */}
        <ImageSlot
          imageSrc={yourImageSrc}
          label="상대의 얼굴"
          onClick={() => triggerFileInput('your')}
        />
      </div>

      {/* Tips Section */}
      <div className="mt-6 px-5">
        <div className="inline-flex items-center rounded bg-[#E4E8FF] px-2 py-1">
          <span className="text-xs font-bold text-[#6270CC]">TIP</span>
        </div>
        <ul className="mt-3 space-y-1 pl-1">
          {[
            '정면이 잘 나온 사진을 골라주세요.',
            '안경이나 마스크는 피해주세요.',
          ].map((hint, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600"
            >
              <span className="h-1 w-1 rounded-full bg-gray-600" />
              {hint}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Image src={privacyIcon} alt="Privacy Icon" width={16} height={16} />
          <span>사진은 분석 후 즉시 삭제됩니다.</span>
        </div>
      </div>

      {/* Error Message */}
      {errorText && (
        <div className="mx-5 mt-4 rounded-xl bg-red-50 p-3 text-center">
          <p className="text-sm font-medium text-red-600">{errorText}</p>
        </div>
      )}

      <div className="flex-1" />

      {/* Submit Button */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 bg-white px-5 pt-4 pb-8">
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full rounded-[15px] border-2 border-[#7A8CFF] bg-gradient-to-r from-[#7A8CFF] to-[#CAD1FF] py-4 text-base font-bold transition active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading ? '분석중...' : '궁합 보기'}
        </button>
      </div>

      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}

// Sub-component for Image Slot
function ImageSlot({
  imageSrc,
  label,
  onClick,
}: {
  imageSrc: string | null;
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative flex aspect-[3/4] flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[15px] border border-[#E3E3E6] bg-[#F5F6F8] transition active:scale-95"
    >
      {imageSrc ? (
        <>
          <Image src={imageSrc} alt={label} fill className="object-cover" />
          <div className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <RefreshCcw className="h-4 w-4 text-white" />
          </div>
        </>
      ) : (
        <>
          <Image src={faceIcon} alt="Face Icon" width={48} height={48} />
          <span className="mt-10 text-sm font-semibold text-[#54575D]">
            {label}
          </span>
          <div className="mt-4">
            {/* 로고 대신 아이콘 사용 */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3E3E6]">
              <Plus className="h-6 w-6 text-[#54575D]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
