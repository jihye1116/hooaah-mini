import type { TarotCardsApiItem } from '@/app/gonnabe/tarot/types/cards';

const DEFAULT_ANALYSIS_TYPE = 'daily';
const DEFAULT_CARD_DECK = 'bubble';

export async function loadTarotCards() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  if (!backendBase) {
    throw new Error('BACKEND_BASE environment variable is not set');
  }

  const url = `${backendBase}/api/tarot/cards?cardDeck=${DEFAULT_CARD_DECK}&analysisType=${DEFAULT_ANALYSIS_TYPE}`;

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
