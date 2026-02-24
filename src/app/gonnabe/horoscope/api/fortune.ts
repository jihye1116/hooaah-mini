import type {
  FortuneData,
  FortunePeriod,
  FortuneTheme,
  MonthlyFortuneResult,
  PeriodScores,
  ThemeFortuneResult,
  WeeklyFortuneResult,
} from '@/app/gonnabe/horoscope/types/fortune';
import type { ValueOf } from 'next/dist/shared/lib/constants';

/**
 * 오늘의 운세 데이터 로드
 * @param userId - 사용자 ID
 * @returns 운세 데이터와 행운의 숫자
 */
export async function loadFortune(
  birthday: string,
  theme: ValueOf<typeof FortuneTheme>,
): Promise<ThemeFortuneResult> {
  if (!birthday) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE;

    if (!baseUrl) {
      throw new Error('백엔드 URL이 설정되지 않았습니다.');
    }

    const response = await fetch(`${baseUrl}/openai/themeFreeFortune`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthday,
        theme,
      }),
    });

    if (response.status !== 201) {
      throw new Error(
        `운세 생성에 실패했습니다. 상태 코드: ${response.status}`,
      );
    }

    const fortuneData: FortuneData = await response.json();

    // 행운의 숫자 생성 (1~20)
    const luckyNumber = Math.floor(Math.random() * 20) + 1;

    return {
      fortuneData,
      luckyNumber,
    };
  } catch (error) {
    console.error('운세 로드 실패:', error);
    throw new Error(`운세 생성에 실패했습니다: ${error}`);
  }
}

// 기간별 에너지(운세) 데이터를 불러오는 공통 함수
export async function loadPeriodEnergy<
  TResponse extends WeeklyFortuneResult | MonthlyFortuneResult,
>(period: ValueOf<typeof FortunePeriod>): Promise<TResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE;

  if (!baseUrl) {
    throw new Error('백엔드 URL이 설정되지 않았습니다.');
  }

  // language는 ko로 고정
  const lang = 'ko';

  // scores가 전달되지 않으면 30~100 범위의 랜덤 점수로 채웁니다.
  const finalScores: PeriodScores = {
    careerScore: Math.floor(Math.random() * 71) + 30,
    interpersonalScore: Math.floor(Math.random() * 71) + 30,
    romanticScore: Math.floor(Math.random() * 71) + 30,
    emotionalScore: Math.floor(Math.random() * 71) + 30,
    healthScore: Math.floor(Math.random() * 71) + 30,
    financialScore: Math.floor(Math.random() * 71) + 30,
    socialScore: Math.floor(Math.random() * 71) + 30,
    totalMonthlyEnergy: Math.floor(Math.random() * 71) + 30,
  };

  const response = await fetch(`${baseUrl}/api/fortune/${period}/ai-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ scores: finalScores, language: lang }),
  });

  if (!response.ok) {
    throw new Error(
      `에너지 데이터 로드에 실패했습니다. 상태 코드: ${response.status}`,
    );
  }

  const json = await response.json();

  return json as TResponse;
}
