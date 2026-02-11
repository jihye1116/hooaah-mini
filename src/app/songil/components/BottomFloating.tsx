'use client';

import { useRouter } from 'next/navigation';

const BottomFloating = () => {
  const router = useRouter();

  const handleShare = async () => {
    try {
      // localStorage에서 결과 데이터 가져오기
      const savedResult = localStorage.getItem('palmistry_result');
      if (!savedResult) {
        alert('공유할 결과가 없습니다.');
        return;
      }

      const result = JSON.parse(savedResult);
      
      // 공유할 텍스트 생성 (플러터 코드 참고)
      const shareText = `🔮 나의 손금 분석 결과\n\n` +
        `손 타입: ${result.hand}\n\n` +
        `📊 주요 손금 분석\n` +
        `• 생명선: ${result.life.score}점\n` +
        `• 지능선: ${result.intelligence.score}점\n` +
        `• 감정선: ${result.emotion.score}점\n` +
        `• 운명선: ${result.destiny.score}점\n\n` +
        `손길 분석 결과를 확인해보세요!`;

      // Web Share API 지원 확인
      if (navigator.share) {
        await navigator.share({
          title: '나의 손길 분석 결과',
          text: shareText,
        });
      } else {
        // Web Share API 미지원 시 클립보드에 복사
        await navigator.clipboard.writeText(shareText);
        alert('결과가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      // 사용자가 공유를 취소한 경우는 무시
      if (error instanceof Error && error.name !== 'AbortError') {
        alert('공유에 실패했습니다.');
      }
    }
  };

  const handleRetry = () => {
    // localStorage 초기화
    localStorage.removeItem('palmistry_result');
    localStorage.removeItem('palmistry_image');
    
    // 이전 화면으로 이동
    router.push('/songil');
  };

  return (
    <div className="fixed bottom-0 bg-white p-4 pb-8 w-full max-w-[480px]">
      <div className="flex gap-3">
        {/* <button
          onClick={handleShare}
          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold"
        >
          공유하기
        </button> */}
        <button
          onClick={handleRetry}
          className="flex-1 bg-[#F97B68] text-white py-4 rounded-xl font-bold"
        >
          다시하기
        </button>
      </div>
    </div>
  );
};

export default BottomFloating;
