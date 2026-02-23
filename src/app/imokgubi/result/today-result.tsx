import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import BottomButton from '@/components/BottomButton';

export interface TodayResultData {
  overall: number;
  condition: {
    skinScore: number;
    skin: string;
    eyeScore: number;
    eye: string;
    faceScore: number;
    face: string;
    overallScore: number;
    overall: string;
  };
  fortune: {
    health: { title: string; description: string };
    relationships: { title: string; description: string };
    finance: { title: string; description: string };
  };
  network: Array<{ title: string; description: string }>;
  timely: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  color: {
    choice: { ko: string; en: string; ja?: string };
    item: string[];
  };
  fortunes: number[];
}

interface TodayResultProps {
  result: TodayResultData;
  resultImage: string;
  onBack: () => void;
}

const fortuneColors: Record<string, string> = {
  Red: '#EF4444',
  Blue: '#3B82F6',
  Green: '#22C55E',
  Yellow: '#EAB308',
  Black: '#000000',
  White: '#FFFFFF',
  Pink: '#EC4899',
  Purple: '#A855F7',
  Orange: '#F97316',
  Brown: '#A52A2A',
  Navy: '#1E3A8A',
  Gray: '#6B7280',
  Silver: '#C0C0C0',
  Gold: '#EAB308',
  Beige: '#F5F5DC',
  Mint: '#4ADE80',
};

const ScoreBar = ({
  score,
  description,
}: {
  score: number;
  description: string;
}) => {
  const [desc1, desc2] = description.split('\\n');
  return (
    <div className="flex-1">
      <div className="mb-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#54575D]">
        <div
          className="h-full rounded-full bg-[#7A8CFF] transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm leading-relaxed text-[#54575D]">{desc1}</p>
      {desc2 && (
        <p className="text-sm leading-relaxed text-[#54575D]">{desc2}</p>
      )}
    </div>
  );
};

export default function TodayResult({
  result,
  resultImage,
  onBack,
}: TodayResultProps) {
  const timeRange = ['오늘', '내일', '모레', '글피', '그글피'];
  const colorHex = fortuneColors[result.color.choice.en] || '#7A8CFF';

  // Svg Graph Generator
  const renderGraph = () => {
    const w = 300;
    const h = 100;
    const points = result.fortunes;
    const paddingX = 10;
    const gap = (w - paddingX * 2) / (points.length - 1);

    const getX = (i: number) => paddingX + gap * i;
    const getY = (val: number) => h - (val / 100) * h;

    const pathD = points
      .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`)
      .join(' ');

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 -20 ${w} ${h + 40}`}
        preserveAspectRatio="none"
      >
        {/* Guide lines */}
        <line
          x1={paddingX}
          y1={0}
          x2={w - paddingX}
          y2={0}
          stroke="#F5F6F8"
          strokeWidth={1}
        />
        <line
          x1={paddingX}
          y1={h / 2}
          x2={w - paddingX}
          y2={h / 2}
          stroke="#F5F6F8"
          strokeWidth={1}
        />
        <line
          x1={paddingX}
          y1={h}
          x2={w - paddingX}
          y2={h}
          stroke="#F5F6F8"
          strokeWidth={1}
        />

        {/* Graph path */}
        <path d={pathD} fill="none" stroke="#7A8CFF" strokeWidth={2} />

        {/* Points */}
        {points.map((val, i) => (
          <circle key={i} cx={getX(i)} cy={getY(val)} r={4} fill="#7A8CFF" />
        ))}

        {/* First Point Label */}
        {points.length > 0 && (
          <g transform={`translate(${getX(0)}, ${getY(points[0]) - 25})`}>
            <rect
              x={-15}
              y={-10}
              width={30}
              height={20}
              rx={5}
              fill="#E4E8FF"
            />
            <text
              x={0}
              y={4}
              fontSize={12}
              fontWeight={600}
              fill="#7A8CFF"
              textAnchor="middle"
            >
              {points[0]}
            </text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] pb-36">
      <div className="mx-auto w-full max-w-2xl">
        <div className="px-5 pt-8">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-[#54575D]" />
          </button>
        </div>

        <div className="pt-4 pb-6 text-center">
          <p className="text-sm font-semibold text-[#7A8CFF]">관상 분석 결과</p>
          <h1 className="mt-1 text-2xl font-bold text-[#313866]">
            오늘의 운세
          </h1>
        </div>

        <div className="mb-6 px-6">
          <div className="relative aspect-[9/10] w-full overflow-hidden rounded-3xl bg-white">
            {resultImage && (
              <Image
                src={resultImage}
                alt="분석 결과"
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>

        {/* Score section */}
        <div className="mb-6 px-5">
          <div className="flex items-center justify-between rounded-2xl bg-white px-6 py-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-[#54575D]">
                {new Date().getMonth() + 1}월 {new Date().getDate()}일
              </p>
              <p className="mt-1 text-lg font-bold text-[#111111]">
                오늘의 운세 점수
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#7A8CFF]">
                {result.overall}
              </span>
              <span className="text-xl font-bold text-[#54575D]">점</span>
            </div>
          </div>
        </div>

        {/* Condition section */}
        <div className="mb-6 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">
              오늘의 얼굴 상태
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <span className="w-[50px] flex-shrink-0 text-sm font-semibold text-[#54575D]">
                  피부
                </span>
                <ScoreBar
                  score={result.condition.skinScore}
                  description={result.condition.skin}
                />
                <span className="flex-shrink-0 text-xs font-bold text-[#54575D]">
                  {result.condition.skinScore}%
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-[50px] flex-shrink-0 text-sm font-semibold text-[#54575D]">
                  눈
                </span>
                <ScoreBar
                  score={result.condition.eyeScore}
                  description={result.condition.eye}
                />
                <span className="flex-shrink-0 text-xs font-bold text-[#54575D]">
                  {result.condition.eyeScore}%
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-[50px] flex-shrink-0 text-sm font-semibold text-[#54575D]">
                  얼굴형
                </span>
                <ScoreBar
                  score={result.condition.faceScore}
                  description={result.condition.face}
                />
                <span className="flex-shrink-0 text-xs font-bold text-[#54575D]">
                  {result.condition.faceScore}%
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-[50px] flex-shrink-0 text-sm font-semibold text-[#54575D]">
                  기운
                </span>
                <ScoreBar
                  score={result.condition.overallScore}
                  description={result.condition.overall}
                />
                <span className="flex-shrink-0 text-xs font-bold text-[#54575D]">
                  {result.condition.overallScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Fortune section */}
        <div className="mb-6 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">
              오늘의 종합 운세
            </h2>
            <div className="space-y-6">
              <div>
                <div className="mb-2 inline-block rounded-md bg-[#E4E8FF] px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#6270CC]">
                    건강운
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-[#111111]">
                  {result.fortune.health.title}
                </h3>
                <p className="text-sm leading-relaxed font-light text-[#54575D]">
                  {result.fortune.health.description}
                </p>
              </div>
              <div>
                <div className="mb-2 inline-block rounded-md bg-[#E4E8FF] px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#6270CC]">
                    대인관계운
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-[#111111]">
                  {result.fortune.relationships.title}
                </h3>
                <p className="text-sm leading-relaxed font-light text-[#54575D]">
                  {result.fortune.relationships.description}
                </p>
              </div>
              <div>
                <div className="mb-2 inline-block rounded-md bg-[#E4E8FF] px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#6270CC]">
                    재물운
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-[#111111]">
                  {result.fortune.finance.title}
                </h3>
                <p className="text-sm leading-relaxed font-light text-[#54575D]">
                  {result.fortune.finance.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Network section */}
        <div className="mb-6 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">
              오늘의 인연
            </h2>
            <div className="space-y-6">
              {result.network.map((item, idx) => (
                <div key={idx}>
                  <h3 className="mb-2 text-base font-bold text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-light text-[#54575D]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timely section */}
        <div className="mb-6 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">
              시간대별 운세
            </h2>
            <div className="space-y-6">
              <div>
                <div className="mb-2 inline-block rounded-md bg-[#E4E8FF] px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#6270CC]">
                    오전
                  </span>
                </div>
                <p className="mb-2 text-base font-bold text-[#111111]">
                  06:00 ~ 12:00
                </p>
                <p className="text-sm leading-relaxed font-light text-[#54575D]">
                  {result.timely.morning}
                </p>
              </div>
              <div>
                <div className="mb-2 inline-block rounded-md bg-[#E4E8FF] px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#6270CC]">
                    오후
                  </span>
                </div>
                <p className="mb-2 text-base font-bold text-[#111111]">
                  12:00 ~ 18:00
                </p>
                <p className="text-sm leading-relaxed font-light text-[#54575D]">
                  {result.timely.afternoon}
                </p>
              </div>
              <div>
                <div className="mb-2 inline-block rounded-md bg-[#E4E8FF] px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#6270CC]">
                    저녁
                  </span>
                </div>
                <p className="mb-2 text-base font-bold text-[#111111]">
                  18:00 ~ 24:00
                </p>
                <p className="text-sm leading-relaxed font-light text-[#54575D]">
                  {result.timely.evening}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Color / Item section */}
        <div className="mb-6 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">
              오늘의 행운 컬러 & 아이템
            </h2>
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full border border-gray-100 shadow-inner"
                style={{ backgroundColor: colorHex }}
              />
              <span className="text-base font-semibold text-[#111111]">
                {result.color.choice.ko}
              </span>
            </div>
            <div className="my-5 border-t-2 border-[#F5F6F8]" />
            <div className="space-y-1">
              {result.color.item.map((item, idx) => (
                <p key={idx} className="text-sm font-semibold text-[#54575D]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Graph section */}
        <div className="mb-8 px-5">
          <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-[#111111]">운세 흐름</h2>
            <div className="h-32 w-full">{renderGraph()}</div>
            <div className="mt-4 flex justify-between px-1">
              {timeRange.map((time, idx) => (
                <div key={idx} className="text-center">
                  {idx === 0 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4E8FF]">
                      <span className="text-xs font-semibold text-[#54575D]">
                        {time}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#54575D]">
                      {time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-safe fixed inset-x-0 bottom-0 mx-auto max-w-[480px] border-t border-gray-100 bg-white pt-4">
        <BottomButton onClick={onBack} />
      </div>
    </div>
  );
}
