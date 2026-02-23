import { useState, useCallback, useEffect } from 'react';
import type { TarotAnalysisResponse } from './types';

const STORAGE_KEY = 'YEARLY_TAROT_PROGRESS_V1';

export interface ChapterProgress {
  chapterIndex: number;
  data: TarotAnalysisResponse;
  selectedCardIds: string[] | string;
  timestamp: number;
}

export interface YearlyTarotProgress {
  reportId: string | null;
  chapters: Record<number, ChapterProgress>; // Key is chapterIndex
  lastUpdated: number;
}

export function useYearlyTarotStorage() {
  const [progress, setProgress] = useState<YearlyTarotProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load tarot progress:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveChapter = useCallback(
    (
      chapterIndex: number,
      data: TarotAnalysisResponse,
      selectedCardIds: string[] | string,
      reportId: string | null,
    ) => {
      setProgress((prev) => {
        const newProgress: YearlyTarotProgress = {
          reportId: reportId ?? prev?.reportId ?? null,
          chapters: {
            ...prev?.chapters,
            [chapterIndex]: {
              chapterIndex,
              data,
              selectedCardIds,
              timestamp: Date.now(),
            },
          },
          lastUpdated: Date.now(),
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
        } catch (error) {
          console.error('Failed to save tarot progress:', error);
        }

        return newProgress;
      });
    },
    [],
  );

  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProgress(null);
    } catch (error) {
      console.error('Failed to clear tarot progress:', error);
    }
  }, []);

  const getChapterData = useCallback(
    (chapterIndex: number) => {
      return progress?.chapters[chapterIndex] || null;
    },
    [progress],
  );

  const hasChapterData = useCallback(
    (chapterIndex: number) => {
      return !!progress?.chapters[chapterIndex];
    },
    [progress],
  );

  return {
    progress,
    isLoaded,
    saveChapter,
    clearProgress,
    getChapterData,
    hasChapterData,
  };
}
