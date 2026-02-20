'use client';

import React, { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { getPretendardFontCSS } from '@/app/gonnabe/tarot/utils/fontUtils';

interface HoroscopeCaptureWrapperProps {
  children: React.ReactNode;
  themeId: string;
}

export default function HoroscopeCaptureWrapper({
  children,
  themeId,
}: HoroscopeCaptureWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (ref.current === null || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const fontCSS = await getPretendardFontCSS();
      const dataUrl = await toJpeg(ref.current, {
        quality: 0.9,
        pixelRatio: 2,
        fontEmbedCSS: fontCSS,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
      });
      saveAs(dataUrl, `horoscope_${themeId}.jpg`);
    } catch (err) {
      console.error('Failed to save image', err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      alert('이미지 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <div ref={ref} className="w-full bg-white">
        {children}
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-6 mb-10 flex w-[calc(100%-48px)] items-center justify-center gap-2 rounded-xl bg-[#111111] py-4 font-bold text-white transition-colors hover:bg-black/90 disabled:opacity-50"
      >
        {isSaving ? (
          '저장 중...'
        ) : (
          <>
            <Download className="h-5 w-5" />
            <span>결과 이미지 저장하기</span>
          </>
        )}
      </button>
    </div>
  );
}
