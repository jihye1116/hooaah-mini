import Image from 'next/image';
import BottomButton from '@/components/BottomButton';
import animals from '../constant/animals.json';
import { animalImages, type AnimalKey } from '../constant/animalImages';
import { ArrowLeft } from 'lucide-react';

type ResultSection = {
  title: string;
  description: string;
};

export interface AnimalResultData {
  overall: string;
  analysis: string;
  character: ResultSection;
  personality: ResultSection;
  reason: ResultSection;
  details: ResultSection;
  fortune: ResultSection;
  career: ResultSection;
  relationship: ResultSection;
  matching: ResultSection;
}

interface AnimalResultProps {
  animal: AnimalKey;
  resultImage: string;
  onBack: () => void;
}

export default function AnimalResult({
  animal,
  resultImage: _resultImage,
  onBack,
}: AnimalResultProps) {
  // Map animal data from JSON to the expected result structure
  const animalData = animals[animal];

  const result: AnimalResultData = {
    overall: animalData.main.title,
    analysis: animalData.main.description,
    character: animalData.character,
    personality: animalData.personality,
    reason: animalData.reason,
    details: animalData.details,
    fortune: animalData.fortune,
    career: animalData.career,
    relationship: animalData.relationship,
    matching: animalData.matching,
  };

  const animalImage = animalImages[animal];

  if (!result?.personality?.description) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-32">
      <div className="sticky top-0 z-10">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <button
            onClick={onBack}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5">
        <div className="pt-6 pb-8 text-center">
          <p className="mb-2 text-sm font-semibold text-[#7A8CFF]">
            관상 분석 결과
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            나와 비슷한 동물은?
          </h1>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-white">
            <Image
              src={animalImage}
              alt={animalData.name}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 text-center">
          <p className="text-lg font-bold text-[#313866]">
            당신은 {animalData.name}!
          </p>
          <p className="leading-relaxedtext-gray-700 mt-5 text-sm">
            {result.analysis}
          </p>
        </div>

        {[
          result.character,
          result.personality,
          result.reason,
          result.details,
          result.fortune,
          result.career,
          result.relationship,
          result.matching,
        ].map((section) => (
          <div key={section.title} className="mb-8 rounded-2xl bg-white p-6">
            <h2 className="mb-6 text-center text-lg font-bold text-[#313866]">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
              {section.description}
            </p>
          </div>
        ))}
      </div>

      <BottomButton onClick={onBack} />
    </div>
  );
}
