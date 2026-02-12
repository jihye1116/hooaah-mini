export interface GenerateThemeTarotAnalysisParams {
  theme: string;
  cardId: string;
  cardReversedInfo: Record<string, boolean>;
}

export async function generateThemeTarotAnalysis<TResponse = unknown>({
  theme,
  cardId,
  cardReversedInfo,
}: GenerateThemeTarotAnalysisParams): Promise<TResponse> {
  const url = '/api/tarot/analysis/generate/theme';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      theme,
      cardId,
      cardReversedInfo,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();

    let message = 'Failed to generate theme-based tarot analysis';
    try {
      const parsed = JSON.parse(text) as unknown;
      if (typeof parsed === 'object' && parsed !== null) {
        const record = parsed as Record<string, unknown>;
        const candidate = record.message ?? record.error;
        if (typeof candidate === 'string' && candidate.trim()) {
          message = candidate;
        }
      }
    } catch {
      if (text.trim()) message = text.trim();
    }

    throw new Error(`${message} (status: ${response.status})`);
  }

  return (await response.json()) as TResponse;
}
