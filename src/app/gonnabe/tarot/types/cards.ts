export interface TarotCardLocalizedInfo {
  cardName: string;
  upright: string;
  reversed: string;
}

export interface TarotCardsApiItem {
  _id: string;
  updatedAt: string;
  modify: boolean;
  reversed: boolean;
  cardDeck: string;
  cardDivision: string;
  cardName: string;
  cardNumber: number;
  cardThumbnail: string;
  cardType: string;
  image: string;
  informationEn: TarotCardLocalizedInfo;
  informationJp: TarotCardLocalizedInfo;
  informationKo: TarotCardLocalizedInfo;
}

export type TarotCardsApiPayload = TarotCardsApiItem[];
