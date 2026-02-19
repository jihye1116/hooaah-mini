export const getLineDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    life: '엄지손가락 아래에서 시작해 손목 방향으로 내려가는 선',
    emotion: '새끼손가락 아래에서 시작해 검지 쪽으로 향하는 선',
    destiny: '새끼손가락 아래에서 시작해 손바닥 중앙 쪽으로 뻗는 선',
    intelligence: '엄지와 검지 사이에서 시작해 손바닥 아래 방향으로 향하는 선',
    marriage: '새끼손가락 아래에서 손금을 가로지르는 선',
    sun: '약손가락 아래에서 손목 방향으로 내려가는 선',
    wealth: '엄지손가락 아래에서 시작해 손금을 통과하는 선',
  };
  return descriptions[key] || '손금 분석';
};
