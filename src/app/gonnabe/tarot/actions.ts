'use server';

import { loadTarotCards } from '@/app/gonnabe/tarot/api/cards';

export async function fetchTarotCards(cardDeck?: string, analysisType?: string) {
  return loadTarotCards(cardDeck, analysisType);
}
