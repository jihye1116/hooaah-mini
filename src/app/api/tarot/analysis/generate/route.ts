import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE;
const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_USER_ID = '67442ba40f22df5c20ec83aa';
const DEFAULT_LANGUAGE = 'ko';

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const incomingJwtRaw = body.jwt;
    const incomingJwt =
      typeof incomingJwtRaw === 'string' ? incomingJwtRaw.trim() : '';
    const analysisTypeRaw = body.analysisType;
    const analysisType =
      typeof analysisTypeRaw === 'string' ? analysisTypeRaw.trim() : '';
    const reportIdRaw = body.reportId;
    const reportId = typeof reportIdRaw === 'string' ? reportIdRaw.trim() : '';
    const languageRaw = body.language;
    const language = typeof languageRaw === 'string' ? languageRaw.trim() : '';
    const userIdRaw = body.userId;
    const userId = typeof userIdRaw === 'string' ? userIdRaw.trim() : '';
    const cardId = body.cardId as string | string[] | undefined;
    const cardReversedInfo =
      (body.cardReversedInfo as Record<string, boolean> | null | undefined) ??
      null;

    console.log('[tarot][generate] incoming body', body);

    if (!BACKEND_BASE) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_BACKEND_BASE is not configured' },
        { status: 500 },
      );
    }

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'JWT_SECRET is not configured' },
        { status: 500 },
      );
    }

    const backendBase = BACKEND_BASE.replace(/\/+$/g, '');
    const url = `${backendBase}/api/tarot/analysis/generate`;

    const hasIncomingJwt = Boolean(incomingJwt);
    const resolvedLanguage = language || DEFAULT_LANGUAGE;
    const resolvedAnalysisType =
      analysisType || (reportId ? 'premium' : 'daily');

    if (!hasIncomingJwt && !cardId) {
      return NextResponse.json(
        { error: 'cardId is required when jwt is not provided' },
        { status: 400 },
      );
    }

    let token = incomingJwt;
    if (!hasIncomingJwt) {
      const payload: Record<string, unknown> = { language: resolvedLanguage };

      if (resolvedAnalysisType === 'premium') {
        if (reportId) {
          payload.reportId = reportId;
          payload.cardId = cardId;
        } else {
          payload.cardId = cardId;
          payload.analysisType = 'premium';
        }
      } else {
        payload.cardId = cardId;
        payload.analysisType = resolvedAnalysisType;
        payload.cardReversedInfo = cardReversedInfo;
        payload.userId = userId || DEFAULT_USER_ID;
      }

      token = jwt.sign(payload, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '5m',
      });
    }

    const outboundBody = { jwt: token };
    console.log('[tarot][generate] outbound body', outboundBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(outboundBody),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || 'Failed to generate tarot analysis' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Tarot analysis generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
