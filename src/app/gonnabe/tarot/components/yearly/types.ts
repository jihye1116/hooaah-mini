export interface CardInformation {
  cardName: string;
  upright: string;
  reversed: string;
}

export interface CardAnalysis {
  section_title: string;
  card_name: string;
  keywords: string[];
  visual_description: string;
  prediction: string;
  personalized_insight: string;
  risk: string;
  closing_advice: string;
}

export interface CardData {
  cardId: string;
  cardName: string;
  cardThumbnail: string;
  reversed: boolean;
  analysis: CardAnalysis;
  informationKo: CardInformation;
  informationEn: CardInformation;
  informationJp: CardInformation;
}

export interface SelectedCard {
  _id: string;
  cardName: string;
  cardDeck: string;
  cardType: string;
  cardThumbnail: string;
  image: string;
  informationKo: CardInformation;
  informationEn: CardInformation;
  informationJp: CardInformation;
  reversed: boolean;
}

// Union type for cards that can appear in content
export type ContentCard = (CardData | SelectedCard) & {
  cardThumbnail?: string;
  image?: string;
};

export interface TarotAnalysisResponse {
  success: boolean;
  step: number;
  stepName: string;
  reportId: string;
  status: string;
  isCompleted?: boolean;
  data: {
    [key: string]: CardData; // first_half, second_half, yearly_flow, risk_signal, etc.
  };
  selectedCard?: SelectedCard;
  selectedCards?: SelectedCard[];
  nextStep?: {
    step: number;
    name: string;
    cardsRequired: number;
  };
  completedAt?: string;
}

export interface ContentSection {
  title: string;
  content: string;
}

export interface CurrentContent {
  card: ContentCard;
  keywords: string[];
  title: string;
  subtitle: string;
  sections: ContentSection[];
}
