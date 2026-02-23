import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import yearlyResultBackground from '@/assets/images/gonnabe/tarot/yearly/yearly_report_result_background.png';
import { cn } from '@sglara/cn';
import Image from 'next/image';
import { useState } from 'react';
import ThemeIcon from '@/assets/icons/gonnabe/tarot/theme_icon.svg';
import type {
  TarotAnalysisResponse,
  CurrentContent,
  ContentSection,
  ContentCard,
} from './types';

interface YearlyResultProps {
  data: TarotAnalysisResponse;
  resultType: 'single' | 'dual';
  tabs?: string[];
  onNext: () => void;
  onPrev: () => void;
  isLastChapter: boolean;
}

export default function YearlyResult({
  data,
  resultType,
  tabs,
}: YearlyResultProps) {
  const [activeTab, setActiveTab] = useState(0);

  const normalizePayload = () => {
    if (data && typeof data === 'object') {
      const wrapped = data.data as Record<string, unknown> | undefined;
      if (wrapped && typeof wrapped === 'object') {
        return wrapped as Record<string, unknown>;
      }
      return {} as Record<string, unknown>;
    }
    return {} as Record<string, unknown>;
  };

  const payload = normalizePayload();
  console.log('data:', data);
  const stepName = data.stepName || '';

  // data.data.first_half / data.data.second_half 같은 구조 처리
  const dataWrapper = payload;

  // selectedCard (단수) 또는 selectedCards (복수) 처리
  const selectedCardFromResponse = data.selectedCard;
  const selectedCardsFromResponse = data.selectedCards;
  const selectedCards = Array.isArray(selectedCardsFromResponse)
    ? selectedCardsFromResponse
    : selectedCardFromResponse
      ? [selectedCardFromResponse]
      : [];

  // dual 타입: first_half, second_half 등의 키에서 분석 추출
  const analysisKeys = Object.keys(dataWrapper).filter(
    (key) => typeof dataWrapper[key] === 'object' && dataWrapper[key] !== null,
  );

  const analysis = dataWrapper;

  // 탭 전환 시 부드러운 애니메이션을 위한 Key 처리용
  const tabKey = `tab-content-${activeTab}`;

  const currentContent = (): CurrentContent => {
    if (resultType === 'single') {
      // single 타입: data 내부에서 유효한 분석 키 찾기 (final_message, yearly_flow 등)
      const validKeys = analysisKeys.filter(
        (key) =>
          analysis[key as keyof typeof analysis] &&
          typeof analysis[key as keyof typeof analysis] === 'object',
      );

      // 첫 번째 유효한 키의 데이터 사용 (없으면 전체 analysis)
      const singleData =
        validKeys.length > 0
          ? (analysis[validKeys[0] as keyof typeof analysis] as Record<
              string,
              unknown
            >)
          : analysis;

      // 카드 정보: singleData에서 직접 가져오거나 selectedCards[0] 사용
      const card = (
        singleData.cardId ? singleData : selectedCards[0]
      ) as ContentCard;
      const cardAnalysis =
        (singleData as { analysis?: Record<string, unknown> }).analysis ?? {};
      const keywords = (cardAnalysis as { keywords?: string[] }).keywords || [];

      return {
        card,
        keywords,
        title:
          (cardAnalysis as { section_title?: string }).section_title ||
          '종합 분석',
        subtitle: stepName || '한 해를 관통하는 주요 테마입니다.',
        sections: [
          {
            title: '카드 묘사',
            content: (cardAnalysis as { visual_description?: string })
              .visual_description,
          },
          {
            title: '예측',
            content: (cardAnalysis as { prediction?: string }).prediction,
          },
          {
            title: '개인 인사이트',
            content: (cardAnalysis as { personalized_insight?: string })
              .personalized_insight,
          },
          {
            title: '리스크',
            content: (cardAnalysis as { risk?: string }).risk,
          },
          {
            title: '마무리 조언',
            content: (cardAnalysis as { closing_advice?: string })
              .closing_advice,
          },
        ].filter((section): section is ContentSection => !!section.content),
      };
    } else {
      // dual 타입: data.first_half / data.second_half 같은 구조
      const index = activeTab;
      const card = selectedCards[index];

      // analysis 객체에서 first_half, second_half 등 키를 찾음
      const analysisKeys = Object.keys(analysis).filter(
        (key) =>
          typeof analysis[key as keyof typeof analysis] === 'object' &&
          analysis[key as keyof typeof analysis] !== null,
      );

      const currentKey = analysisKeys[index];
      const individual = currentKey
        ? (analysis[currentKey as keyof typeof analysis] as Record<
            string,
            unknown
          >)
        : {};

      const cardAnalysis =
        (individual as { analysis?: Record<string, unknown> }).analysis ?? {};
      const keywords = (cardAnalysis as { keywords?: string[] }).keywords || [];

      return {
        card,
        keywords,
        title: tabs?.[index] || `Card ${index + 1}`,
        subtitle:
          (cardAnalysis as { section_title?: string }).section_title ||
          '선택하신 카드의 상세 해석입니다.',
        sections: [
          {
            title: '카드 묘사',
            content: (cardAnalysis as { visual_description?: string })
              .visual_description,
          },
          {
            title: '예측',
            content: (cardAnalysis as { prediction?: string }).prediction,
          },
          {
            title: '개인 인사이트',
            content: (cardAnalysis as { personalized_insight?: string })
              .personalized_insight,
          },
          {
            title: '리스크',
            content: (cardAnalysis as { risk?: string }).risk,
          },
          {
            title: '마무리 조언',
            content: (cardAnalysis as { closing_advice?: string })
              .closing_advice,
          },
        ].filter((section): section is ContentSection => !!section.content),
      };
    }
  };

  const content = currentContent();
  const cardImageUrl = content.card
    ? `${TAROT_S3_BASE_URL}/${
        content.card.cardThumbnail || content.card.image
      }.png`
    : '';

  console.log('data:', data);

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-hidden bg-black text-white">
      {/* Background Image */}
      <Image
        src={yearlyResultBackground}
        alt="Result Background"
        fill
        className="pointer-events-none object-cover"
        priority
      />

      {/* Scrollable Area (Dart: padding: EdgeInsets.fromLTRB(20, 60, 20, 80)) */}
      <div className="no-scrollbar z-10 flex h-full flex-col overflow-y-auto px-[20px] pt-[60px] pb-[80px]">
        {/* Glassmorphic Container (Dart: _buildGlassmorphicContainer) */}
        <div className="relative flex w-full flex-col rounded-[24px] border border-white/10 bg-white/10 p-[20px] shadow-lg backdrop-blur-md">
          {/* Tabs for Dual Result (Dart: _buildStyledTabBar) */}
          {resultType === 'dual' && tabs && (
            <div className="mb-6 flex w-full rounded-xl bg-black/20 p-1 backdrop-blur-sm">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-250',
                    activeTab === index
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/60 hover:text-white/80',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Animated Tab Content Wrapper */}
          <div
            key={tabKey}
            className="animate-in fade-in flex flex-col items-center duration-300"
          >
            {/* Theme Icon Mockup (Dart: SvgPicture.asset) */}
            <div className="mb-5 flex h-[11.27px] w-[28px] items-center justify-center">
              <Image
                src={ThemeIcon}
                alt="Theme Icon"
                className="mx-2 h-[11.27px] w-[28px] text-white/60"
              />
            </div>

            {/* Title (Dart: fontSize 19, fontWeight 500) */}
            <h2 className="text-center font-serif text-[19px] leading-[1.3] font-medium text-white">
              {content.title}
            </h2>

            {/* Subtitle (Dart: fontSize 11, color white/80, letterSpacing -0.11) */}
            <p className="mt-1.5 text-center text-[11px] leading-[1.6] tracking-[-0.11px] text-white/80">
              {content.subtitle}
            </p>

            {/* Tarot Card Display */}
            <div className="mt-5 mb-5 flex w-full flex-col items-center justify-center">
              <div className="flex flex-col items-center rounded-lg bg-gray-400 px-2 py-3">
                {cardImageUrl && (
                  <div
                    className={cn(
                      'relative h-[220px] w-[130px] drop-shadow-xl transition-transform duration-500',
                      content.card?.reversed && 'rotate-180',
                    )}
                  >
                    {/* 모서리 둥글기를 처리하는 내부 래퍼 */}
                    <div className="relative size-full overflow-hidden rounded-xl">
                      <Image
                        src={cardImageUrl}
                        alt={content.card?.cardName || 'Tarot Card'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                {content.card?.cardName && (
                  <span className="mt-2 text-xs text-white">
                    {content.card.informationKo?.cardName ||
                      content.card.cardName}
                  </span>
                )}
              </div>
            </div>

            {/* Tags / Keywords */}
            {content.keywords.length > 0 && (
              <div className="mb-5 flex flex-wrap justify-center gap-2">
                {content.keywords.map((keyword: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-full border border-white/5 bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Description Sections (Dart: fontSize 14, color white/80, letterSpacing -0.12, height 1.7) */}
            <div className="flex w-full flex-col gap-6 font-serif text-[14px] leading-[1.7] tracking-[-0.12px] text-white/80">
              {content.sections && content.sections.length > 0 ? (
                content.sections.map((section: ContentSection, idx: number) => (
                  <div key={idx} className="flex flex-col">
                    {/* <h3 className="mb-1.5 font-bold text-white/90">
                      [{section.title}]
                    </h3> */}
                    <p className="whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center whitespace-pre-wrap">
                  해석을 불러올 수 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
