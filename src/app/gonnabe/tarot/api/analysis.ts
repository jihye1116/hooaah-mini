export interface GenerateTarotAnalysisParams {
  userId?: string;
  cardId?: string | string[];
  analysisType?: string;
  cardReversedInfo?: Record<string, boolean> | null;
  reportId?: string;
  language?: string;
  jwt?: string;
}

export interface GenerateThemeTarotAnalysisParams {
  theme: string;
  cardId: string;
  cardReversedInfo: Record<string, boolean>;
}

export async function generateTarotAnalysis<TResponse = unknown>({
  cardId,
  analysisType = 'daily',
  cardReversedInfo,
  userId,
  reportId,
  language,
  jwt,
}: GenerateTarotAnalysisParams): Promise<TResponse> {
  const url = '/api/tarot/analysis/generate';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      jwt,
      cardId,
      analysisType,
      cardReversedInfo,
      userId,
      reportId,
      language,
    }),
    cache: 'no-store',
  });

  if (response.status !== 200 && response.status !== 201) {
    const text = await response.text();

    let message = 'Failed to generate tarot analysis';
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
    console.log('Error response:', { status: response.status, text }); // Log the raw response for debugging

    throw new Error(`${message} (status: ${response.status})`);
  }

  return (await response.json()) as TResponse;
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
