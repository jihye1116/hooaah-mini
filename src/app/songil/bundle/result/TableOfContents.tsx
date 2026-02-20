import React from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import backgroundEffects from '@/assets/images/songil/background-effects.svg';
import checkIcon from '@/assets/images/songil/check-icon.svg';
import wealthIcon from '@/assets/icons/songil/wealth_icon.svg';
import { getLineDescription } from './utils/lineDescriptions';

interface TableOfContentsProps {
  lineKeys: string[];
  lineNames: Record<string, string>;
  bundle?: string;
  onSelect: (idx: number) => void;
  onSave?: () => void;
}

export default function TableOfContents({
  lineKeys,
  lineNames,
  bundle,
  onSelect,
  onSave,
}: TableOfContentsProps) {
  // 번들 타입에 따라 다른 아이콘과 텍스트 설정
  const getPackageInfo = () => {
    switch (bundle) {
      case 'wealth':
        return {
          icon: wealthIcon,
          title: '재물운 패키지',
        };
      default:
        return {
          icon: checkIcon,
          title: '연애운 패키지',
        };
    }
  };

  const packageInfo = getPackageInfo();
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-5 pt-6"
      style={{
        background:
          'linear-gradient(180deg, rgba(54, 128, 255, 1) 0%, rgba(186, 134, 244, 1) 50%, rgba(249, 149, 157, 1) 100%)',
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={backgroundEffects}
          alt=""
          fill
          className="object-cover object-left opacity-100"
          priority
        />
      </div>

      {/* Content Container - Relative to position above background effects */}
      <div className="relative z-10 flex w-full flex-col items-center pt-20">
        {/* Premium Section */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-base font-semibold text-white">
            프리미엄 분석
          </div>
          <div
            className="flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2"
            style={{
              background:
                'linear-gradient(white, white) padding-box, linear-gradient(54deg, rgba(120, 224, 255, 1) 6%, rgba(186, 134, 244, 1) 41%, rgba(249, 149, 157, 1) 88%) border-box',
              border: '2px solid transparent',
              width: '185px',
              height: '48px',
            }}
          >
            <Image
              src={packageInfo.icon}
              alt="package"
              width={20}
              height={17}
              className="flex-shrink-0"
            />
            <span
              className="text-xl leading-[1.3] font-bold tracking-[-0.024em]"
              style={{ color: '#3680FF' }}
            >
              {packageInfo.title}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div
          className="mt-8 flex w-full max-w-xs flex-col items-center gap-3 pb-40"
          style={{
            padding: '0 20px',
          }}
        >
          {lineKeys.map((key, idx) => (
            <button
              key={key}
              onClick={() => onSelect(idx + 1)}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '14px',
                boxShadow: '0px 0px 10px 0px rgba(232, 175, 175, 0.25)',
                height: '186px',
              }}
            >
              {/* Number */}
              <div
                className="text-center text-base font-medium"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(186, 134, 244, 1) 0%, rgba(54, 128, 255, 1) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {idx + 1}
              </div>
              {/* Line Name */}
              <h3
                className="text-center text-4xl font-bold"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(186, 134, 244, 1) 0%, rgba(54, 128, 255, 1) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {lineNames[key] || key}
              </h3>
              {/* Description */}
              <p
                className="text-center text-base font-medium"
                style={{
                  color: '#424242',
                }}
              >
                {getLineDescription(key)}
              </p>
            </button>
          ))}

          {/* Save Button */}
          {onSave && (
            <button
              onClick={onSave}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white p-4 font-bold text-[#3680FF]"
              style={{
                border: '1px solid #3680FF',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              }}
            >
              <Download className="h-5 w-5" />
              전체 결과 이미지로 저장하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
