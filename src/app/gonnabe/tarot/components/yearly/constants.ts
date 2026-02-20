export const YEARLY_CHAPTERS = [
  {
    id: 1,
    title: 'Chapter 01. 홈',
    type: 'intro',
  },
  {
    id: 2,
    title: 'Chapter 02. 구성 미리보기',
    type: 'preview',
  },
  {
    id: 3,
    title: 'Chapter 03. 2026년도 전체 흐름',
    type: 'flow',
    question: {
      number: 'Chapter 03',
      title: '2026년\n전체 흐름',
      description:
        '올해 나를 이끌어줄 핵심 키워드와\n 전반적인 운의 흐름을 확인해보세요.',
    },
    maxCards: 1,
    resultType: 'single',
    theme: 'yearly_flow',
  },
  {
    id: 4,
    title: 'Chapter 04. 상반기 / 하반기 주요 흐름',
    type: 'flow',
    question: {
      number: 'Chapter 04',
      title: '상반기, 하반기\n주요 흐름',
      description:
        '1월~6월 사이 집중해야 할 에너지와 7월~12월 사이에 나타날 변화, 성과에 대해 알려드릴게요!',
    },
    maxCards: 2,
    resultType: 'dual',
    tabs: ['상반기', '하반기'],
    theme: 'first_second_half',
  },
  {
    id: 5,
    title: 'Chapter 05. 위험 신호 / 기회의 타이밍',
    type: 'flow',
    question: {
      number: 'Chapter 05',
      title: '위험 신호 / 기회의 타이밍',
      description:
        '주의해야 할 위험 신호와\n 놓치지 말아야 할 결정적 기회를 알아봅니다.',
    },
    maxCards: 2,
    resultType: 'dual',
    tabs: ['위험 신호', '기회 타이밍'],
    theme: 'risk_opportunity',
  },
  {
    id: 6,
    title: 'Chapter 06. 방향 전환 / 조력자',
    type: 'flow',
    question: {
      number: 'Chapter 06',
      title: '방향 전환 / 조력자',
      description:
        '나에게 필요한 변화의 방향과\n 도움을 되어줄 귀인을 찾아보세요.',
    },
    maxCards: 2,
    resultType: 'dual',
    tabs: ['변화의 방향', '행운의 조력자'],
    theme: 'direction_helper',
  },
  {
    id: 7,
    title: 'Chapter 07. 마지막 메시지',
    type: 'flow',
    question: {
      number: 'Chapter 07',
      title: '마지막 메시지',
      description:
        '이 모든 흐름 끝에 마주할\n 당신의 2026년 모습을 그려봅니다.',
    },
    maxCards: 1,
    resultType: 'single',
    theme: 'final_message',
  },
];
