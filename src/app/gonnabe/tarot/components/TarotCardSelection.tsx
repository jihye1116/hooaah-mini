import { loadTarotCards } from '@/app/gonnabe/tarot/api/cards';
import TarotCardSelectionClient from '@/app/gonnabe/tarot/components/TarotCardSelectionClient';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';

interface TarotCardSelectionProps {
  theme: string;
}

const DEFAULT_TAROT_USER_ID = '695db4f08ac5ab49fb919d71';
const DEFAULT_TAROT_CARD_IMAGE = `bubble_00_TheFool_upright_thumnail`;

export default async function TarotCardSelection({
  theme,
}: TarotCardSelectionProps) {
  const payload = await loadTarotCards(DEFAULT_TAROT_USER_ID);

  const cards = Array.from({ length: 20 }, (_, index) => {
    const item = payload[index];
    return {
      id: item?.cardNumber ?? index + 1,
      frontImage: `${TAROT_S3_BASE_URL}/${item?.cardThumbnail ?? DEFAULT_TAROT_CARD_IMAGE}.png`,
      reversed: item?.reversed ?? false,
    };
  });

  return <TarotCardSelectionClient theme={theme} initialCards={cards} />;
}
