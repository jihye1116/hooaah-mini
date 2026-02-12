import { generateThemeTarotAnalysisOnServer } from '@/app/gonnabe/tarot/api/analysis.server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RequestBody {
  theme?: string;
  cardId?: string;
  cardReversedInfo?: Record<string, boolean>;
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const theme = String(body.theme ?? '').trim();
  const cardId = String(body.cardId ?? '').trim();
  const cardReversedInfo = body.cardReversedInfo ?? {};
  if (!theme) {
    return NextResponse.json({ message: 'theme is required' }, { status: 400 });
  }
  if (!cardId) {
    return NextResponse.json(
      { message: 'cardId is required' },
      { status: 400 },
    );
  }
  if (typeof cardReversedInfo !== 'object' || cardReversedInfo === null) {
    return NextResponse.json(
      { message: 'cardReversedInfo must be an object' },
      { status: 400 },
    );
  }

  try {
    const result = await generateThemeTarotAnalysisOnServer({
      theme,
      cardId,
      cardReversedInfo,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to generate theme-based tarot analysis',
      },
      { status: 500 },
    );
  }
}
