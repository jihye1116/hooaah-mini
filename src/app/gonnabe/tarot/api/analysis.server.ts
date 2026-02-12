import jwt from 'jsonwebtoken';
import 'server-only';

export interface GenerateThemeTarotAnalysisServerParams {
  theme: string;
  cardId: string;
  cardReversedInfo: Record<string, boolean>;
}

export async function generateThemeTarotAnalysisOnServer<TResponse = unknown>({
  theme,
  cardId,
  cardReversedInfo,
}: GenerateThemeTarotAnalysisServerParams): Promise<TResponse> {
  const backendBaseRaw = process.env.NEXT_PUBLIC_BACKEND_BASE;
  const backendBase = backendBaseRaw?.replace(/\/+$/g, '');

  if (!backendBase) {
    throw new Error('BACKEND_BASE environment variable is not set');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const token = jwt.sign(
    {
      theme,
      cardId,
      cardReversedInfo,
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '5m',
    },
  );

  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ jwt: token }),
    cache: 'no-store',
  };

  const response = await fetch(
    `${backendBase}/api/tarot/analysis/generate/theme`,
    requestInit,
  );

  if (!response) {
    throw new Error('Failed to reach backend tarot analysis endpoint');
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok) {
    if (contentType.includes('application/json')) {
      const errorJson = (await response.json()) as Record<string, unknown>;
      const message =
        (typeof errorJson.message === 'string' && errorJson.message) ||
        (typeof errorJson.error === 'string' && errorJson.error) ||
        `Failed to generate theme-based tarot analysis (${response.status})`;
      throw new Error(message);
    }

    const text = await response.text();
    throw new Error(
      text ||
        `Failed to generate theme-based tarot analysis (${response.status})`,
    );
  }

  if (contentType.includes('application/json')) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}
