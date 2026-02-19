import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface TopHeaderProps {
  title: string;
  onBack: () => void;
}

export default function TopHeader({ title, onBack }: TopHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <button 
        onClick={onBack} 
        className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-black/5 active:bg-black/10"
      >
        <ChevronLeft className="h-7 w-7 text-[#111111]" />
      </button>
      <h1 className="text-xl font-bold text-[#111111]">{title}</h1>
      <div className="w-9" /> {/* Spacer for centering (matches button width + padding) */}
    </div>
  );
}
