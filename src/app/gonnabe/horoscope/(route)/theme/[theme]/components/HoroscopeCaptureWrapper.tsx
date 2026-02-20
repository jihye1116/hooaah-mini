'use client';

import React, { useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { getPretendardFontCSS } from '@/app/gonnabe/tarot/utils/fontUtils';
import ActionButtonGroup from './ActionButtonGroup';

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
    <div className="flex min-h-screen flex-col items-center bg-white">
      <div ref={ref} className="w-full bg-white">
        {children}
      </div>
      <div className="w-full px-6 pb-10">
        <ActionButtonGroup onSave={handleSave} />
      </div>
    </div>
  );
}
