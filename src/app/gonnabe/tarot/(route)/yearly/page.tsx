'use client';

import YearlyTarotFlow from '@/app/gonnabe/tarot/components/yearly/YearlyTarotFlow';
import PremiumContentGate from '@/components/PremiumContentGate';
import { isPremiumContent } from '@/utils/premium';

export default function YearlyPage() {
  const contentId = 'tarot:yearly';
  const isPremium = isPremiumContent(contentId);

  if (isPremium) {
    return (
      <PremiumContentGate contentId={contentId} title="연간 타로">
        <YearlyTarotFlow />
      </PremiumContentGate>
    );
  }

  return <YearlyTarotFlow />;
}
