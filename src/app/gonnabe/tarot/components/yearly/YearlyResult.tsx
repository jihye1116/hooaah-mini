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

  // 현재 년도 동적 할당
  const currentYear = new Date().getFullYear();

  // step 기반 단계별 title/subtitle 매핑
  const stepContentMap: Record<
    number,
    Record<number, { title: string; subtitle: string }>
  > = {
    1: {
      0: {
        title: `${currentYear}년 전체 흐름`,
        subtitle: '올해를 관통하는 핵심 키워드와 분위기',
      },
    },
    2: {
      0: {
        title: `${currentYear}년 상반기 흐름`,
        subtitle: '1~6월 사이 집중해야 할 에너지',
      },
      1: {
        title: `${currentYear}년 하반기 흐름`,
        subtitle: '7~12월의 변화와 결과/성장 방향',
      },
    },
    3: {
      0: {
        title: '위험 신호',
        subtitle: '조심해야 할 선택이나 경계해야 할 태도',
      },
      1: {
        title: '기회의 타이밍',
        subtitle: '놓치지 말아야 할 결정적 순간',
      },
    },
    4: {
      0: {
        title: '방향 전환',
        subtitle: '운의 흐름이 바뀌는 터닝 포인트',
      },
      1: {
        title: '조력자',
        subtitle: '올해 나에게 실질적 도움을 줄 사람의 유형',
      },
    },
    5: {
      0: {
        title: '마지막 메세지',
        subtitle: `${currentYear}년을 위한 최종 자기 성상 서사`,
      },
    },
  };

  const step = data.step ?? 2;

  // data.data.first_half / data.data.second_half 같은 구조 처리
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
      const validKeys = analysisKeys.filter(
        (key) =>
          analysis[key as keyof typeof analysis] &&
          typeof analysis[key as keyof typeof analysis] === 'object',
      );

      const singleData =
        validKeys.length > 0
          ? (analysis[validKeys[0] as keyof typeof analysis] as Record<
              string,
              unknown
            >)
          : analysis;

      const card = (
        singleData.cardId ? singleData : selectedCards[0]
      ) as ContentCard;
      const cardAnalysis =
        (singleData as { analysis?: Record<string, unknown> }).analysis ?? {};
      const keywords = (cardAnalysis as { keywords?: string[] }).keywords || [];

      const stepContent = stepContentMap[step]?.[0];
      const title =
        stepContent?.title ||
        (cardAnalysis as { section_title?: string }).section_title ||
        '종합 분석';
      const subtitle =
        stepContent?.subtitle || '한 해를 관통하는 주요 테마입니다.';

      return {
        card,
        keywords,
        title,
        subtitle,
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

    // dual 타입
    const index = activeTab;
    const card = selectedCards[index];
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

    const stepContent = stepContentMap[step]?.[index];
    const title = stepContent?.title || tabs?.[index] || `Card ${index + 1}`;
    const subtitle =
      stepContent?.subtitle ||
      (cardAnalysis as { section_title?: string }).section_title ||
      '선택하신 카드의 상세 해석입니다.';

    return {
      card,
      keywords,
      title,
      subtitle,
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
          content: (cardAnalysis as { closing_advice?: string }).closing_advice,
        },
      ].filter((section): section is ContentSection => !!section.content),
    };
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
            <h2 className="text-center text-[19px] leading-[1.3] font-medium text-white">
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
            <div className="flex w-full flex-col gap-6 text-[14px] leading-[1.7] tracking-[-0.12px] text-white/80">
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
