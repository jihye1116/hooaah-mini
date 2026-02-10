'use client';

import { ArrowLeft, Image as ImageIcon, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function FaceReaderPage() {
  return (
    <div className="flex size-full min-h-screen flex-col overflow-hidden bg-gray-800">
      {/* Top Navigation */}
      <div className="flex h-12 items-center gap-2.5 px-5 py-1.5">
        <button className="flex h-6 w-6 items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-[#E3E3E6]" />
        </button>
        <p className="text-[14px] font-semibold tracking-[-0.336px] text-[#E3E3E6]">
          10년 뒤, 나의 미래는
        </p>
      </div>

      {/* Guide Section */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* Face Guide - Ellipse */}
        <div className="relative h-100 w-100">
          {/* Outer ellipse border */}
          <Image src="/images/imokgubi-guide.svg" alt="Guide" fill />
        </div>

        {/* Guide Message */}
        <div className="flex items-center justify-center rounded-[14px] border border-[#111] bg-black/50 px-5 py-4 backdrop-blur-xs">
          <p className="text-center text-[18px] font-medium tracking-[-0.432px] whitespace-nowrap text-white">
            타원 안으로 얼굴을 찍어주세요
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between px-5 pb-10">
        {/* Image button */}
        <button className="flex h-11 w-11 items-center justify-center rounded-[22px] bg-black/50 p-2.25">
          <ImageIcon className="h-6 w-6 text-white" />
        </button>

        {/* Shutter button */}
        <button className="flex h-19.5 w-19.5 items-center justify-center">
          <div className="flex h-19.5 w-19.5 items-center justify-center rounded-full border-[6px] border-white bg-transparent">
            <div className="h-15 w-15 rounded-full bg-white" />
          </div>
        </button>

        {/* Camera switch button */}
        <button className="flex h-11 w-11 items-center justify-center rounded-[22px] bg-black/50 p-2.25">
          <RefreshCw className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}
