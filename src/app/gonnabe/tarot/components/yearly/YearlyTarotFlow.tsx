'use client';

import { fetchTarotCards } from '@/app/gonnabe/tarot/actions';
import { generateTarotAnalysis } from '@/app/gonnabe/tarot/api/analysis';
import type { GenerateTarotAnalysisParams } from '@/app/gonnabe/tarot/api/analysis';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import type { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';
import type { TarotCard } from '@/app/gonnabe/tarot/types/theme';
import { cn } from '@sglara/cn';
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
import type { TarotAnalysisResponse } from './types';
import { useYearlyTarotStorage } from './useYearlyTarotStorage';

type FlowStep = 'question' | 'select' | 'result';

export default function YearlyTarotFlow() {
  const router = useRouter();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [step, setStep] = useState<FlowStep>('question');
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<TarotAnalysisResponse | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [reportId, setReportId] = useState<string | null>(null);

  const {
    saveChapter,
    getChapterData,
    hasChapterData,
    isLoaded,
    progress: savedProgress,
  } = useYearlyTarotStorage();

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

  // Restore state from local storage on load
  useEffect(() => {
    if (!isLoaded) return;

    if (savedProgress?.reportId) {
      setReportId(savedProgress.reportId);
    }

    // Find the first incomplete flow chapter to resume
    // Skip intro(0) and preview(1) for checking completion, start from 2
    let resumeIndex = 0;
    for (let i = 0; i < YEARLY_CHAPTERS.length; i++) {
      const chapter = YEARLY_CHAPTERS[i];
      if (chapter.type === 'flow') {
        if (!hasChapterData(i)) {
          resumeIndex = i;
          break;
        }
      }
    }

    // If all flow chapters are complete (resumeIndex is still 0 loop finished, or logic needs refinement)
    // Actually if loop finishes without break, it means all flow chapters are done?
    // Let's refine:
    // If hasChapterData(2) is false, resumeIndex = 2.
    // If hasChapterData(2) is true, check 3...
    // If all done, resumeIndex should be the last chapter or result page.
    const lastFlowIndex = YEARLY_CHAPTERS.length - 1;
    if (
      resumeIndex === 0 &&
      hasChapterData(2) // At least first flow chapter is done
    ) {
      // If we didn't find an incomplete chapter, it means all are done?
      // Check the last one
      if (hasChapterData(lastFlowIndex)) {
        resumeIndex = lastFlowIndex;
      }
    }

    // Only auto-jump if we have some progress
    // if (savedProgress && Object.keys(savedProgress.chapters).length > 0) {
    //   if (hasChapterData(resumeIndex)) {
    //     // If the resume point is a completed chapter (e.g. all done), show result
    //     setCurrentChapterIndex(resumeIndex);
    //     setAnalysisResult(getChapterData(resumeIndex)!.data);
    //     setStep('result');
    //   } else {
    //     // Resume at incomplete chapter
    //     setCurrentChapterIndex(resumeIndex);
    //     setStep('question');
    //   }
    // }
  }, [isLoaded, hasChapterData, getChapterData, savedProgress]);

  // Load cards when entering a new chapter (if flow type and not showing result from storage)
  useEffect(() => {
    if (
      currentChapter.type === 'flow' &&
      cards.length === 0 &&
      step !== 'result'
    ) {
      loadCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapterIndex, currentChapter.type, step]);

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

      // 1장일 때는 String, 여러 장일 때는 List로 전달
      const cardId = selectedIds.length === 1 ? selectedIds[0] : selectedIds;

      const payload: GenerateTarotAnalysisParams = reportId
        ? {
            cardId,
            reportId,
            analysisType: 'premium',
            cardReversedInfo:
              Object.keys(cardReversedInfo).length > 0
                ? cardReversedInfo
                : null,
          }
        : {
            cardId,
            analysisType: 'premium',
            cardReversedInfo:
              Object.keys(cardReversedInfo).length > 0
                ? cardReversedInfo
                : null,
          };

      const result = await generateTarotAnalysis(payload);

      const nextReportId =
        typeof result === 'object' && result !== null
          ? String((result as { reportId?: unknown }).reportId ?? '').trim()
          : '';

      if (nextReportId) {
        setReportId(nextReportId);
      }

      // Save progress
      saveChapter(
        currentChapterIndex,
        result as TarotAnalysisResponse,
        selectedIds,
        nextReportId || reportId,
      );

      setAnalysisResult(result as TarotAnalysisResponse);
      setStep('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Determine the furthest chapter the user is allowed to visit
  const getMaxReachableIndex = () => {
    for (let i = 0; i < YEARLY_CHAPTERS.length; i++) {
      const chapter = YEARLY_CHAPTERS[i];
      if (chapter.type === 'flow' && !hasChapterData(i)) {
        return i;
      }
    }
    return YEARLY_CHAPTERS.length - 1;
  };

  const maxReachableIndex = getMaxReachableIndex();

  const handleNextChapter = () => {
    if (currentChapterIndex < YEARLY_CHAPTERS.length - 1) {
      navigateToChapter(currentChapterIndex + 1);
    } else {
      alert('모든 챕터가 완료되었습니다.');
      router.push('/gonnabe/tarot');
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      navigateToChapter(currentChapterIndex - 1);
    }
  };

  const handleJumpToChapter = (index: number) => {
    if (
      index >= 0 &&
      index < YEARLY_CHAPTERS.length &&
      index <= maxReachableIndex
    ) {
      navigateToChapter(index);
    }
  };

  const handleClose = () => {
    router.push('/gonnabe/tarot');
  };

  const canNavigateNext = true;
  // const canNavigateNext = currentChapter.type == 'flow' || step == 'result';

  // Calculate total pages: intro(1) + preview(1) + (5 flow chapters * 2 pages each = 10)
  const TOTAL_PAGES = 12;

  // Helper to determine how many pages a chapter occupies
  const getChapterPageCount = (index: number) => {
    const chapter = YEARLY_CHAPTERS[index];
    if (chapter.type !== 'flow') return 1;
    // If we have data, it's 1 page (Result). Otherwise 2 (Question + Select).
    return hasChapterData(index) ? 1 : 2;
  };

  // Calculate total pages dynamically based on completion status
  const totalPages = YEARLY_CHAPTERS.reduce(
    (acc, _, idx) => acc + getChapterPageCount(idx),
    0,
  );

  // Calculate current page index (0-based)
  const calculatePageIndex = () => {
    let pageIndex = 0;

    // Add up pages of previous chapters
    for (let i = 0; i < currentChapterIndex; i++) {
      pageIndex += getChapterPageCount(i);
    }

    // Add offset for current chapter
    // If completed (1 page), offset is always 0 (Result)
    // If incomplete (2 pages): Question=0, Select=1
    if (
      currentChapter.type === 'flow' &&
      !hasChapterData(currentChapterIndex) &&
      step === 'select'
    ) {
      pageIndex += 1;
    }

    return pageIndex;
  };

  const currentPageIndex = calculatePageIndex();

  const handleStepTransition = () => {
    if (hasChapterData(currentChapterIndex)) {
      setAnalysisResult(getChapterData(currentChapterIndex)!.data);
      setStep('result');
    } else {
      setStep('select');
    }
  };

  const navigateToChapter = (index: number) => {
    setCurrentChapterIndex(index);
    if (hasChapterData(index)) {
      // Completed: Go straight to result
      setAnalysisResult(getChapterData(index)!.data);
      setStep('result');
    } else {
      // Incomplete: Go to question
      setStep('question');
      setCards([]); // Clear cards to trigger reload
      setAnalysisResult(null);
    }
  };

  const content = (() => {
    if (currentChapter.type === 'intro') {
      return (
        <YearlyIntro
          onStart={() => navigateToChapter(currentChapterIndex + 1)}
        />
      );
    }

    if (currentChapter.type === 'preview') {
      return (
        <YearlyPreview
          onNext={() => navigateToChapter(currentChapterIndex + 1)}
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
            onStartSelection={handleStepTransition}
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
            data={analysisResult!}
            resultType={currentChapter.resultType as 'single' | 'dual'}
            tabs={currentChapter.tabs}
            onNext={handleNextChapter}
            onPrev={() => {
              // If completed, 'Prev' goes to previous chapter (since this chapter is 1 page)
              if (hasChapterData(currentChapterIndex)) {
                handlePrevChapter();
              } else {
                setStep('question');
              }
            }}
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
          maxReachableIndex={maxReachableIndex}
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
          index={currentPageIndex + 1}
          total={totalPages}
          onPrev={() => {
            if (currentChapterIndex === 0) {
              handleClose();
            } else if (
              currentChapter.type === 'flow' &&
              !hasChapterData(currentChapterIndex) && // Only if incomplete
              step === 'select'
            ) {
              // Go back to question page in same chapter
              setStep('question');
            } else {
              handlePrevChapter();
            }
          }}
          onNext={() => {
            if (!canNavigateNext) return;

            if (
              currentChapter.type === 'flow' &&
              step === 'question' &&
              !hasChapterData(currentChapterIndex)
            ) {
              // Move to select page in same chapter
              setStep('select');
            } else {
              handleNextChapter();
            }
          }}
          onClose={handleClose}
          backgroundColor="white"
        />
      </div>

      <div
        className={cn(
          'fixed inset-0 z-[100] flex size-full items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-300',
          isAnalyzing ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <p className="text-lg font-semibold text-white">타로 분석중...</p>
      </div>
    </div>
  );
}
