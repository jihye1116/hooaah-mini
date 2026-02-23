import { loadTarotCards } from '@/app/gonnabe/tarot/api/cards';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { TAROT_S3_BASE_URL } from '@/app/gonnabe/tarot/constants';

interface TarotCardDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TarotCardDetailPage({
  params,
}: TarotCardDetailPageProps) {
  const { id } = await params;
  const cards = await loadTarotCards();
  const card = cards.find((c) => c._id === id);

  if (!card) {
    notFound();
  }

  const cardName = card.informationKo?.cardName || card.cardName || 'Unknown Card';
  const uprightDesc = card.informationKo?.upright || card.informationEn?.upright || '';
  const reversedDesc = card.informationKo?.reversed || card.informationEn?.reversed || '';
  
  const image = card.cardThumbnail || card.image || 'bubble_00_TheFool_upright_thumnail';
  const imageUrl = `${TAROT_S3_BASE_URL}/${image}.png`;

  return (
    <div className="min-h-screen bg-black text-white p-5 pb-20">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-8 mt-4">{cardName}</h1>
        
        <div className="relative w-[200px] h-[320px] mb-8 rounded-lg overflow-hidden shadow-lg border border-white/20">
          <Image
            src={imageUrl}
            alt={cardName}
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold mb-2 text-yellow-400">정방향 (Upright)</h2>
            <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
              {uprightDesc || '설명이 없습니다.'}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold mb-2 text-purple-400">역방향 (Reversed)</h2>
            <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
              {reversedDesc || '설명이 없습니다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
