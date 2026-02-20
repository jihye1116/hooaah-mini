'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface ActionButtonGroupProps {
  onSave?: () => Promise<void>;
}

export default function ActionButtonGroup({ onSave }: ActionButtonGroupProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave();
      } else {
        // 기본 저장 로직
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error('Save failed:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAppStore = () => {
    window.open(
      'https://apps.apple.com/app/gonnabe-daily-cosmic-ritual/id6738400368',
      '_blank',
    );
  };

  const handleGalaxyStore = () => {
    window.open('https://galaxystore.samsung.com/', '_blank');
  };

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4">
      {/* 저장 버튼 - 전체 너비 */}
      <button
        onClick={handleSave}
        disabled={isSaving || saveSuccess}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          saveSuccess
            ? 'border border-green-400 bg-transparent text-green-600'
            : 'border border-gray-300 bg-transparent text-gray-600 hover:border-gray-500 hover:bg-gray-50 active:bg-transparent'
        } ${isSaving ? 'opacity-60' : ''}`}
      >
        {isSaving ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent"></div>
            <span>저장 중...</span>
          </>
        ) : saveSuccess ? (
          <>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>저장 완료!</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            <span>이미지로 저장</span>
          </>
        )}
      </button>

      {/* 앱 다운로드 버튼 2개 나란히 */}
      <div className="flex gap-3">
        {/* App Store */}
        <button
          onClick={handleAppStore}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-700 px-3 py-3 text-white transition-all duration-200 hover:bg-purple-800 active:bg-purple-600"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-medium opacity-75">App Store</span>
            <span className="text-sm font-bold">Gonnabe</span>
          </div>
        </button>

        {/* Galaxy Store */}
        <button
          onClick={handleGalaxyStore}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-500 px-3 py-3 text-white transition-all duration-200 hover:bg-purple-600 active:bg-purple-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 15.341a.95.95 0 0 1-.951.951.95.95 0 0 1-.95-.951.95.95 0 0 1 .95-.95.95.95 0 0 1 .951.95m-9.195 0a.95.95 0 0 1-.95.951.95.95 0 0 1-.951-.951.95.95 0 0 1 .951-.95.95.95 0 0 1 .95.95m9.608-4.178l1.695-2.937a.354.354 0 0 0-.129-.483.353.353 0 0 0-.483.128L17.31 10.82A10.252 10.252 0 0 0 12 9.587c-1.88 0-3.644.506-5.155 1.392L5.14 8.021a.354.354 0 0 0-.612.356l1.697 2.939C3.996 12.669 2.5 15.274 2.5 18.22h19c0-2.946-1.496-5.55-3.564-7.057" />
          </svg>
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-medium opacity-75">Galaxy Store</span>
            <span className="text-sm font-bold">Gonnabe</span>
          </div>
        </button>
      </div>
    </div>
  );
}
