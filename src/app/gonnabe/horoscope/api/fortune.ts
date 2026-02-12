import type {
  FortuneData,
  FortuneResult,
  FortuneTheme,
} from '@/app/gonnabe/horoscope/types/fortune';
import type { ValueOf } from 'next/dist/shared/lib/constants';

/**
 * 오늘의 운세 데이터 로드
 * @param userId - 사용자 ID
 * @returns 운세 데이터와 행운의 숫자
 */
export async function loadFortune(
  userId: string,
  theme: ValueOf<typeof FortuneTheme>,
): Promise<FortuneResult> {
  if (!userId) {
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
        userId,
        theme,
      }),
    });

    if (response.status !== 200) {
      throw new Error(
        `운세 생성에 실패했습니다. 상태 코드: ${response.status}`,
      );
    }

    const fortuneData: FortuneData = await response.json();
    console.log('fortuneData:', fortuneData);

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
