'use client';

import { cn } from '@sglara/cn';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

interface ReportHeaderSectionProps {
  title: string;
  chapterTitles: string[];
  currentPage: number;
  onPageSelected: (index: number) => void;
  onClose?: () => void;
  backgroundColor?: string;
  className?: string;
}

export default function ReportHeaderSection({
  title,
  chapterTitles,
  currentPage,
  onPageSelected,
  onClose,
  backgroundColor = 'black',
  className,
}: ReportHeaderSectionProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const isMoreChapter = title.toLowerCase() === 'keep exploring'; // Example check, adjust as needed

  // Logic to split "Chapter XX." from rest of title
  let splitIndex = 0;
  if (!isMoreChapter) {
    const chapterPattern = /\s+\d+\.|\.+\s/i;
    const match = title.toLowerCase().match(chapterPattern);
    if (match && match.index !== undefined) {
      splitIndex = Math.min(match.index + match[0].length, title.length);
    } else {
      // Fallback: try to split by "Chapter " + number
      const simpleMatch = title.toLowerCase().match(/chapter\s+\d+/i);
      if (simpleMatch && simpleMatch.index !== undefined) {
        splitIndex = simpleMatch.index + simpleMatch[0].length;
      } else {
        // Default split if pattern not found but maybe structured like "Chapter 01 Title"
        // If it starts with Chapter, maybe split after number?
        // For now, if no match, 0 means no bold prefix or entire bold?
        // Dart code: (match?.end ?? 14).clamp(0, widget.title.length);
        // So default is 14 if no match.
        splitIndex = 14 > title.length ? title.length : 14;
      }
    }
  }

  return (
    <div
      className={cn(
        'relative z-50 flex flex-col items-start bg-white/50 pt-[env(safe-area-inset-top)]',
        className,
      )}
    >
      {/* Title Bar */}
      <div
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3"
        style={{ backgroundColor }}
        onClick={toggleMenu}
      >
        <div className="flex flex-1 items-center gap-1.5 overflow-hidden">
          <div className="flex-1 truncate text-base text-white">
            {isMoreChapter ? (
              <span className="font-[family-name:var(--font-plus-jakarta-sans)] font-normal">
                {title.toUpperCase()}
              </span>
            ) : (
              <>
                <span className="font-[family-name:var(--font-plus-jakarta-sans)] font-bold">
                  {title.substring(0, splitIndex).toUpperCase()}
                </span>
                <span className="ml-1 font-[family-name:var(--font-plus-jakarta-sans)] font-bold">
                  {title.substring(splitIndex).toUpperCase()}
                </span>
              </>
            )}
          </div>
          <div className="text-white transition-opacity duration-200">
            {menuVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className={cn(
          'absolute top-12 left-4 w-[60%] min-w-[200px] origin-top-left rounded-xl border border-[#F0F2F5] bg-white shadow-xl transition-all duration-200 ease-in-out',
          menuVisible
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        <div className="flex flex-col py-2">
          {chapterTitles.map((chapterTitle, idx) => {
            const isSelected = idx === currentPage;
            const isMoreItem = chapterTitle.toLowerCase() === 'keep exploring';

            let itemSplitIndex = 0;
            if (!isMoreItem) {
              const chapterPattern = /chapter\s+\d+\./i;
              const match = chapterTitle.toLowerCase().match(chapterPattern);
              if (match && match.index !== undefined) {
                itemSplitIndex = match.index + match[0].length;
              }
            }

            return (
              <div
                key={idx}
                onClick={() => {
                  onPageSelected(idx);
                  setMenuVisible(false);
                }}
                className="cursor-pointer px-4 py-3 hover:bg-gray-50"
              >
                <div
                  className={cn(
                    'font-[family-name:var(--font-plus-jakarta-sans)] text-[13px]',
                    isSelected ? 'text-black' : 'text-[#647183]',
                  )}
                >
                  {isMoreItem ? (
                    <span className="font-normal">{chapterTitle}</span>
                  ) : (
                    <>
                      <span className="font-semibold">
                        {chapterTitle.substring(0, itemSplitIndex)}
                      </span>
                      <span
                        className={cn(
                          'ml-1',
                          isSelected ? 'font-semibold' : 'font-normal',
                        )}
                      >
                        {chapterTitle.substring(itemSplitIndex)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div className="mx-3 my-1 h-px bg-gray-200" />

          <div
            onClick={() => {
              setMenuVisible(false);
              onClose?.();
            }}
            className="flex cursor-pointer items-center px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center justify-center rounded-full border border-gray-300 p-0.5">
              <X size={14} className="text-[#647183]" />
            </div>
            <span className="ml-3 font-[family-name:var(--font-plus-jakarta-sans)] text-[13px] font-bold text-[#647183]">
              닫기
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
