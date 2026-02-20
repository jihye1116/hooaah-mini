import { loadTarotCards } from '@/app/gonnabe/tarot/api/cards';
import TarotCardSelectionClient from '@/app/gonnabe/tarot/components/TarotCardSelectionClient';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';
import { TarotPeriod } from '@/app/gonnabe/tarot/types/period';

interface TarotCardSelectionProps {
  theme: string;
}

const DEFAULT_TAROT_CARD_IMAGE = `bubble_00_TheFool_upright_thumnail`;

export default async function TarotCardSelection({
  theme,
}: TarotCardSelectionProps) {
  const payload = await loadTarotCards();

  const cards = Array.from({ length: 20 }, (_, index) => {
    const item = payload[index];
    return {
      id: item._id,
      frontImage: `${TAROT_S3_BASE_URL}/${item.cardThumbnail ?? DEFAULT_TAROT_CARD_IMAGE}.png`,
      reversed: item?.reversed ?? false,
    };
  });

  let maxSelectableCards = 1;
  let instruction =
    '마음을 편히 하여, 선택한 질문을 떠올린 뒤\n눈길이 가는 카드 한 장을 선택하세요.';
  let resultPath = `/gonnabe/tarot/theme/${encodeURIComponent(theme)}/result`;

  switch (theme) {
    case TarotPeriod.DAILY:
      maxSelectableCards = 1;
      instruction = '오늘의 운세를 위한\n카드 한 장을 선택하세요.';
      resultPath = `/gonnabe/tarot/${theme}/result`;
      break;
    case TarotPeriod.WEEKLY:
      maxSelectableCards = 3;
      instruction = '이번 주 흐름을 읽기 위해\n카드 세 장을 선택하세요.';
      resultPath = `/gonnabe/tarot/${theme}/result`;
      break;
    case TarotPeriod.MONTHLY:
      maxSelectableCards = 5;
      instruction = '이번 달 흐름을 읽기 위해\n카드 다섯 장을 선택하세요.';
      resultPath = `/gonnabe/tarot/${theme}/result`;
      break;
  }

  return (
    <TarotCardSelectionClient
      theme={theme}
      initialCards={cards}
      maxSelectableCards={maxSelectableCards}
      instruction={instruction}
      resultPath={resultPath}
    />
  );
}
