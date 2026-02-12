import type { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';

const DEFAULT_ANALYSIS_TYPE = 'daily';
const DEFAULT_CARD_DECK = 'bubble';

export async function loadTarotCards(userId: string) {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  if (!backendBase) {
    throw new Error('BACKEND_BASE environment variable is not set');
  }

  if (!userId) {
    throw new Error('userId is required');
  }

  const url = `${backendBase}/api/tarot/cards?userId=${encodeURIComponent(userId)}&cardDeck=${DEFAULT_CARD_DECK}&analysisType=${DEFAULT_ANALYSIS_TYPE}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load tarot cards: ${response.status}`);
  }

  const payload: TarotCardsApiItem[] = await response.json();

  return payload;
}
