import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, analysisType, cardReversedInfo } = body;

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

    const token = jwt.sign(
      {
        cardId,
        analysisType,
        cardReversedInfo,
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '5m',
      },
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ jwt: token }),
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
