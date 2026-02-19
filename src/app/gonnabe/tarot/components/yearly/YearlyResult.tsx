import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import yearlyResultBackground from '@/assets/images/gonnabe/tarot/yearly/yearly_report_result_background.png';
import { cn } from '@sglara/cn';
import Image from 'next/image';
import { useState } from 'react';

interface YearlyResultProps {
  data: any;
  resultType: 'single' | 'dual';
  tabs?: string[];
}

export default function YearlyResult({
  data,
  resultType,
  tabs,
}: YearlyResultProps) {
  const [activeTab, setActiveTab] = useState(0);

  const analysis = data?.analysis || {};
  const selectedCards = data?.selectedCards || [];

  // Helper to get content for current tab/card
  const currentContent = () => {
    if (resultType === 'single') {
      const card = selectedCards[0];
      const interpretation =
        analysis.integratedMessage ||
        analysis.cardsOverview ||
        analysis.individualAnalysis?.[0]?.interpretation ||
        '해석을 불러올 수 없습니다.';

      const keywords = analysis.cardKeywords || analysis.keywords || [];

      return {
        card,
        interpretation,
        keywords,
        title: '종합 분석',
      };
    } else {
      // Dual result (2 cards, 2 tabs)
      const index = activeTab;
      const card = selectedCards[index];
      const individual = analysis.individualAnalysis?.[index];
      const interpretation =
        individual?.interpretation || '해석을 불러올 수 없습니다.';
      // Keywords might be per card or global. Assuming global for simplicity or checking if individual has keywords
      const keywords = individual?.keywords || analysis.keywords || [];

      return {
        card,
        interpretation,
        keywords,
        title: tabs?.[index] || `Card ${index + 1}`,
      };
    }
  };

  const content = currentContent();
  const cardImageUrl = content.card
    ? `${TAROT_S3_BASE_URL}/${content.card.cardThumbnail || content.card.image}.png`
    : '';

  return (
    <div className="relative flex size-full flex-col overflow-hidden bg-black pt-16 pb-28 text-white">
      <Image
        src={yearlyResultBackground}
        alt="Result Background"
        fill
        className="pointer-events-none object-cover opacity-50"
      />

      {/* Scrollable Content */}
      <div className="no-scrollbar z-10 flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-10">
        {/* Tabs for Dual Result */}
        {resultType === 'dual' && tabs && (
          <div className="sticky top-0 z-10 mb-6 flex rounded-xl bg-white/10 p-1 backdrop-blur-md">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'flex-1 rounded-lg py-2.5 text-sm font-bold transition-all',
                  activeTab === index
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/60 hover:text-white',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <div className="flex grow flex-col items-center">
          {/* Card Display */}
          <div className="relative mb-6 flex h-[280px] w-full flex-col items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm">
            {cardImageUrl && (
              <div
                className={cn(
                  'relative h-[200px] w-[120px] transition-transform duration-500',
                  content.card?.reversed && 'rotate-180',
                )}
              >
                <Image
                  src={cardImageUrl}
                  alt={content.card?.cardName || 'Tarot Card'}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className="mt-4 text-sm font-bold text-white">
              {content.card?.cardName}
            </p>
          </div>

          {/* Keywords */}
          {content.keywords.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {content.keywords.map((keyword: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}

          {/* Interpretation */}
          <div className="w-full rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <h3 className="mb-3 text-lg font-bold">{content.title}</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-white/90">
              {content.interpretation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
