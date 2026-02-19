'use client';

import { fetchTarotCards } from '@/app/gonnabe/tarot/actions';
import { generateThemeTarotAnalysis } from '@/app/gonnabe/tarot/api/analysis';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import type { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import type { TarotCard } from '@/app/gonnabe/tarot/types/theme';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { YEARLY_CHAPTERS } from './constants';
import ReportHeaderSection from './ReportHeaderSection';
import ReportNavControl from './ReportNavControl';
import YearlyIntro from './YearlyIntro';
import YearlyPreview from './YearlyPreview';
import YearlyQuestion from './YearlyQuestion';
import YearlyResult from './YearlyResult';
import YearlyTarotCardSelection from './YearlyTarotCardSelection';

type FlowStep = 'question' | 'select' | 'result';

export default function YearlyTarotFlow() {
  const router = useRouter();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [step, setStep] = useState<FlowStep>('question');
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showControls, setShowControls] = useState(true);

  const currentChapter = YEARLY_CHAPTERS[currentChapterIndex];
  const chapterTitles = useMemo(
    () =>
      YEARLY_CHAPTERS.map((chapter) =>
        chapter.type === 'flow' && chapter.question
          ? `${chapter.question.number}. ${chapter.question.title}`
          : chapter.title,
      ),
    [],
  );
  const currentChapterTitle =
    chapterTitles[currentChapterIndex] ?? currentChapter.title;

  // Load cards when entering a new chapter (if flow type)
  useEffect(() => {
    if (currentChapter.type === 'flow' && cards.length === 0) {
      loadCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapterIndex, currentChapter.type]);

  const loadCards = async () => {
    if (isLoadingCards) return;
    setIsLoadingCards(true);
    try {
      const rawCards = await fetchTarotCards('bubble', 'premium');
      const mappedCards: TarotCard[] = rawCards.map(
        (item: TarotCardsApiItem) => ({
          id: item._id,
          frontImage: `${TAROT_S3_BASE_URL}/${item.cardThumbnail}.png`,
          reversed: item.reversed,
        }),
      );
      setCards(mappedCards);
    } catch (error) {
      console.error('Failed to load tarot cards:', error);
    } finally {
      setIsLoadingCards(false);
    }
  };

  const handleSelectionComplete = async (selectedIds: string[]) => {
    setIsAnalyzing(true);
    try {
      const cardReversedInfo = selectedIds.reduce<Record<string, boolean>>(
        (acc, id) => {
          acc[id] = true;
          return acc;
        },
        {},
      );

      setAnalysisResult(result);
      setStep('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('분석에 실패했습니다. 다시 시도해주세요.');
      // Reset selection if failed?
      // For now, let user retry or get stuck (alert shows error)
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < YEARLY_CHAPTERS.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setStep('question');
      setCards([]); // Clear cards to trigger reload for next chapter
      setAnalysisResult(null);
    } else {
      alert('모든 챕터가 완료되었습니다.');
      router.push('/gonnabe/tarot');
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
      setStep('question');
      setCards([]);
      setAnalysisResult(null);
    }
  };

  const handleJumpToChapter = (index: number) => {
    if (index >= 0 && index < YEARLY_CHAPTERS.length) {
      setCurrentChapterIndex(index);
      setStep('question');
      setCards([]);
      setAnalysisResult(null);
    }
  };

  const handleClose = () => {
    router.push('/gonnabe/tarot');
  };

  const canNavigateNext = currentChapter.type !== 'flow' || step === 'result';

  const content = (() => {
    if (currentChapter.type === 'intro') {
      return (
        <YearlyIntro
          onStart={() => setCurrentChapterIndex((prev) => prev + 1)}
        />
      );
    }

    if (currentChapter.type === 'preview') {
      return (
        <YearlyPreview
          onNext={() => setCurrentChapterIndex((prev) => prev + 1)}
        />
      );
    }

    if (currentChapter.type === 'flow') {
      if (step === 'question') {
        return (
          <YearlyQuestion
            number={currentChapter.question?.number || ''}
            title={currentChapter.question?.title || ''}
            description={currentChapter.question?.description || ''}
            onStartSelection={() => setStep('select')}
          />
        );
      }

      if (step === 'select') {
        if (cards.length === 0) {
          return (
            <div className="flex size-full items-center justify-center bg-black text-white">
              <p>카드 준비중...</p>
            </div>
          );
        }
        return (
          <YearlyTarotCardSelection
            initialCards={cards}
            maxSelectableCards={currentChapter.maxCards || 1}
            onComplete={handleSelectionComplete}
            isLoading={isAnalyzing}
          />
        );
      }

      if (step === 'result') {
        return (
          <YearlyResult
            data={analysisResult}
            resultType={currentChapter.resultType as 'single' | 'dual'}
            tabs={currentChapter.tabs}
            onNext={handleNextChapter}
            onPrev={handlePrevChapter}
            isLastChapter={currentChapterIndex === YEARLY_CHAPTERS.length - 1}
          />
        );
      }
    }

    return null;
  })();

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white">
      <div
        className={`absolute inset-x-0 top-0 z-30 transition-all duration-300 ${
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ReportHeaderSection
          title={currentChapterTitle}
          chapterTitles={chapterTitles}
          currentPage={currentChapterIndex}
          onPageSelected={handleJumpToChapter}
          backgroundColor="transparent"
        />
      </div>

      <div
        className="no-scrollbar z-10 flex flex-1 cursor-pointer flex-col overflow-y-auto"
        onClick={() => setShowControls(!showControls)}
      >
        {content}
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 z-30 transition-all duration-300 ${
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ReportNavControl
          index={currentChapterIndex + 1}
          total={YEARLY_CHAPTERS.length}
          onPrev={() => {
            if (currentChapterIndex === 0) {
              handleClose();
            } else {
              handlePrevChapter();
            }
          }}
          onNext={() => {
            if (!canNavigateNext) return;
            handleNextChapter();
          }}
          onClose={handleClose}
          backgroundColor="white"
        />
      </div>
    </div>
  );
}
