export const wealthLinePremiumKorean = {
  title: [
    "재물선 분석",
    "성향 분석",
    "시기별 재정 흐름",
    "위험 요소 점검",
    "성장·기회 타이밍",
    "현재 시점 해석"
  ],
  bottom: [
    "성향 분석 보기",
    "시기별 재정 흐름 해석",
    "위험 요소 점검",
    "성장기회 타이밍",
    "현재 시점 해석",
    "다시 보기"
  ],
  location: `새끼손가락 아래에서 시작하여
손바닥 중앙 쪽으로 뻗는 선`,
  character: "나의 재정 관리 성향",
  skill: "나의 경제감각",
  will: "자산 증식 의지",
  sense: "기회 포착력",
  flow: "재정 흐름 해석",
  safety_title: "재정에 대한 안정성",
  safety_description: "높을 수록 재정이 어려울 가능성이 높아져요",
  risk_type: "유형별 위험도 체크",
  advice: "당신을 위한 맞춤 조언",
  chance_flow: "재정 기회 흐름",
  chance_time: "올해 최적의 투자 시기",
  present_title: "나이별 재정 그래프",
  present_description: "높을 수록 수입이 안정적이에요",
  present_analysis: "올해 재정 흐름 분석",
  future_analysis: "향후 3~5년 전망",
  precaution: "가장 주의해야 할 점"
};

export type PremiumData = typeof wealthLinePremiumKorean & {
  nonsense?: string;
};

export const lifeLinePremiumKorean: PremiumData = {
  title: ["생명선 분석", "성향 분석", "나의 건강 흐름", "건강 위험 가능성", "건강 회복 시기", "현재 시점 해석"],
  bottom: [
    "성향 분석 보기",
    "나의 건강 흐름",
    "건강 위험 가능성",
    "건강 회복 시기",
    "현재 시점 해석",
    "다시 보기"
  ],
  location: `엄지와 검지 사이에서 시작해
손바닥을 둥글게 감싸며 손목 쪽으로 뻗는 선`,
  character: "생명선 유형 분석",
  skill: "신체 에너지 지속력",
  will: "질병 저항성",
  sense: "일상 복원력",
  flow: "건강 흐름 분석",
  safety_title: "시기별 위험 가능성",
  safety_description: "높을 수록 건강이 건강에 주의가 필요해요",
  risk_type: "건강을 위협하는 요소",
  advice: "당신을 위한 맞춤 조언",
  chance_flow: "회복 가능성 시기",
  chance_time: "올해 건강운이 오는 시기",
  present_title: "나이별 건강운 그래프",
  present_description: "높을 수록 건강이 좋아질 가능성이 높아요",
  present_analysis: "올해 건강운 분석",
  future_analysis: "향후 3~5년 전망",
  precaution: "가장 주의해야 할 점"
};

export const marriageLinePremiumKorean: PremiumData = {
  title: ["기본 정보 분석", "성향 분석", "연애·결혼 가능성", "위험 요소", "기회가 오는 시기", "현재 시점 해석"],
  bottom: [
    "성향 분석 보기",
    "연애·결혼 가능성",
    "위험 요소",
    "기회가 오는 시기",
    "현재 시점 해석",
    "다시 보기"
  ],
  location: `새끼손가락 아래 측면에서 시작해
손바닥 안쪽으로 짧게 뻗는 선`,
  character: "사랑 유형 분석",
  skill: "정서적 유대력",
  will: "장기적 애정 유지력",
  sense: "잘 맞는 상대 유형",
  // Note: marriage line has an extra field 'nonsense' in the original prompt, but for strict typing based on wealthLinePremiumKorean, 
  // if 'nonsense' is unique to marriage line, it should be optional in the type or handled separately.
  // The user prompt had 'nonsense' for marriage line but not others.
  // wealthLinePremiumKorean does NOT have 'nonsense'.
  // However, I must conform to 'PremiumData' which is based on wealthLinePremiumKorean.
  // If 'nonsense' is needed, I should add it as optional to PremiumData.
  // Let's check if 'nonsense' is used in the components. It was not used in my previous updates.
  // So I will omit it to satisfy the type, or I can add it to the type definition as optional.
  // I will add it as optional to the type definition.
  flow: "연애 및 결혼 가능성",
  safety_title: "시기별 불안정 가능성",
  safety_description: "높을 수록 관계가 불안정할 가능성이 있어요",
  risk_type: "관계 불안정 요소",
  advice: "당신을 위한 맞춤 조언",
  chance_flow: "기회의 흐름",
  chance_time: "올해 새로운 인연을 만날 시기",
  present_title: "나이별 관계 진전 그래프",
  present_description: "높을 수록 긍정적인 관계를 유징할 가능성이 높아요",
  present_analysis: "올해 진전될 가능성 분석",
  future_analysis: "향후 3~5년 전망",
  precaution: "가장 주의해야 할 점"
};

export const sunLinePremiumKorean: PremiumData = {
  title: ["기본 정보 분석", "성향 분석", "시기별 성공 흐름", "위험 요소", "성과 상승 타이밍", "현재 시점 해석"],
  bottom: [
    "성향 분석 보기",
    "시기별 성공 흐름",
    "위험 요소",
    "성과 상승 타이밍",
    "현재 시점 해석",
    "다시 보기"
  ],
  location: `약지 아래에서 시작해
손바닥 아래 방향으로 뻗는 선`,
  character: "태양선 유형 분석",
  skill: "창조성 발현력",
  will: "대중적 어필력",
  sense: "사회적 인정 욕구",
  flow: "성공 유형 분석",
  safety_title: "시기별 위험 가능성",
  safety_description: "높을 수록 위기를 맞을 가능성이 높아요",
  risk_type: "위험 요소",
  advice: "당신을 위한 맞춤 조언",
  chance_flow: "성과 발생 시기",
  chance_time: "올해 명예운이 오는 시기",
  present_title: "나이별 명예운 그래프",
  present_description: "높을 수록 명예운을 가지고 있어요",
  present_analysis: "올해 명예운 분석",
  future_analysis: "향후 3~5년 전망",
  precaution: "가장 주의해야 할 점"
};

export const emotionLinePremiumKorean: PremiumData = {
  title: [
    "기본 정보 분석",
    "성향 분석",
    "시기별 감정 흐름",
    "정서적 위험 요소",
    "감정 전환 분석",
    "현재 시점 해석"
  ],
  bottom: [
    "성향 분석 보기",
    "시기별 감정 흐름",
    "정서적 위험 요소",
    "감정 전환 분석",
    "현재 시점 해석",
    "다시 보기"
  ],
  location: `새끼손가락 아래에서 시작해
손바닥 윗부분을 가로질러 검지 방향으로 뻗는 선`,
  character: "감정 유형 분석",
  skill: "정서적 공감력",
  will: "관계 유지 능력",
  sense: "감정 기복 민감도",
  flow: "감정 흐름 해석",
  safety_title: "시기별 불안 지수",
  safety_description: "높을 수록 정서적으로 불안할 가능성이 높아요",
  risk_type: "정서적 위험 요소",
  advice: "당신을 위한 맞춤 조언",
  chance_flow: "시기별 감정 전환",
  chance_time: "올해 행복이 찾아올 시기",
  present_title: "나이별 인간관계 그래프",
  present_description: "높을 수록 긍정적인 관계 형성을 의미해요",
  present_analysis: "올해 인간관계 흐름 분석",
  future_analysis: "향후 3~5년 전망",
  precaution: "가장 주의해야 할 점"
};

export const intelligenceLinePremiumKorean: PremiumData = {
  title: [
    "기본 정보 분석",
    "성향 분석",
    "시기별 사고력 흐름",
    "위험 요소 점검",
    "집중력 흐름 분석",
    "현재 시점 해석"
  ],
  bottom: [
    "성향 분석 보기",
    "시기별 사고력 흐름",
    "위험 요소 점검",
    "집중력 흐름 분석",
    "현재 시점 해석",
    "다시 보기"
  ],
  location: `엄지와 검지 사이 아래에서 시작해
손바닥을 가로질러 수평 방향으로 뻗는 선`,
  character: "두뇌선 사고 유형",
  skill: "논리적 사고력",
  will: "자기 주도력",
  sense: "집중 유지력",
  flow: "사고력 흐름 해석",
  safety_title: "시기별 판단력 약화 가능성",
  safety_description: "높을 수록 판단력이 약해질 가능성이 높아요",
  risk_type: "판단력으로 인한 위험 요소",
  advice: "당신을 위한 맞춤 조언",
  chance_flow: "시기별 집중력 변화",
  chance_time: "올해 집중력이 좋은 시기",
  present_title: "나이별 사고력 그래프",
  present_description: "높을 수록 더 좋은 사고력을 의미해요",
  present_analysis: "올해 사고력 흐름 분석",
  future_analysis: "향후 3~5년 전망",
  precaution: "가장 주의해야 할 점"
};

export const destinyLinePremiumKorean: PremiumData = {
  title: [
    "기본 정보 분석",
    "성향 분석",
    "시기별 운명 흐름",
    "위험 요소 점검",
    "성장·기회 타이밍",
    "현재 시점 해석"
  ],
  bottom: [
    "성향 분석 보기",
    "시기별 운명 흐름",
    "위험 요소 점검",
    "성장·기회 타이밍",
    "현재 시점 해석",
    "다시 보기"
  ],
  location: `손바닥 아래 중앙에서 시작해
중지 아래 방향으로 뻗는 선`,
  character: "운명선 커리어 성장 유형",
  skill: "목표 지향성",
  will: "자기 주도력",
  sense: "외부 의존도",
  flow: "운명 흐름 해석",
  safety_title: "위험한 흐름을 가진 시기",
  safety_description: "높을 수록 위험한 흐름의 가능성이 높아요",
  risk_type: "위험한 흐름 유형",
  advice: "당신을 위한 맞춤 조언",
  chance_flow: "기회가 오는 시기",
  chance_time: "올해 좋은 운명을 가진 시기",
  present_title: "나이별 커리어 안정성 그래프",
  present_description: "높을 수록 더 안정된 상태를 의미해요",
  present_analysis: "올해 운명 흐름 분석",
  future_analysis: "향후 3~5년 전망",
  precaution: "가장 주의해야 할 점"
};

export const palmistryPremiumKorean: Record<string, PremiumData> = {
  wealth: wealthLinePremiumKorean,
  life: lifeLinePremiumKorean,
  marriage: marriageLinePremiumKorean,
  sun: sunLinePremiumKorean,
  emotion: emotionLinePremiumKorean,
  intelligence: intelligenceLinePremiumKorean,
  destiny: destinyLinePremiumKorean,
};
