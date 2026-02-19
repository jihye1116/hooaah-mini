import React from 'react';
import Image from 'next/image';
import { LineData } from '../types';
import WhiteBox, { PointList, SectionTitle } from './WhiteBox';
import { LINE_DETAIL_IMAGES } from '../assets';

const FundamentalSection = ({
  data,
  lineName,
  lineKey,
  resultImageUrl,
}: {
  data: LineData['primitive'];
  lineName: string;
  lineKey: string;
  resultImageUrl: string;
}) => {
  const score = Number(data.visibility.score) || 0;

  // Helper to get image
  const getDetailImage = (category: 'type' | 'curve', evaluation: string) => {
    // Evaluation might be "long", "short" etc. directly from API
    // lineKey should be "life", "emotion", etc.
    const images = LINE_DETAIL_IMAGES[lineKey]?.[category];
    if (!images) return null;

    // evaluation key matching
    // API returns "long", "short", etc. which matches our keys
    return images[evaluation] || null;
  };

  return (
    <div className="space-y-6">
      {/* 이미지 및 기본 정보 */}
      <div className="flex flex-col items-center">
        <div className="relative mb-4 h-[200px] w-[170px] overflow-hidden rounded-[20px] border border-black/10">
          {resultImageUrl ? (
            <Image
              src={resultImageUrl}
              alt="Result"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="w-full">
          <WhiteBox>
            <SectionTitle>{lineName}</SectionTitle>
            <div className="flex items-center gap-2 text-sm text-[#424242]">
              <span className="font-semibold">검사일</span>
              <div className="h-3 w-[1px] bg-[#B5B5B5]" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </WhiteBox>
        </div>
      </div>

      {/* Type */}
      <WhiteBox>
        <SectionTitle>{lineName} 유형</SectionTitle>

        {/* Type Image */}
        {getDetailImage('type', data.type.evaluation) && (
          <div className="mb-6 flex justify-center">
            <div className="relative h-[120px] w-[120px]">
              <Image
                src={getDetailImage('type', data.type.evaluation)!}
                alt={`${lineName} Type`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* <div className="mb-4 rounded-xl bg-[#FEF3F1] p-3 text-center text-lg font-bold text-[#883A2E]">
          {data.type.evaluation}
        </div> */}
        <p className="mb-4 text-sm font-medium text-[#111111]">
          {data.type.description}
        </p>
        <PointList points={data.type.point} />
      </WhiteBox>

      {/* Curve */}
      <WhiteBox>
        <SectionTitle>{lineName} 곡선</SectionTitle>

        {/* Curve Image */}
        {getDetailImage('curve', data.curve.evaluation) && (
          <div className="mb-6 flex justify-center">
            <div className="relative h-[120px] w-[120px]">
              <Image
                src={getDetailImage('curve', data.curve.evaluation)!}
                alt={`${lineName} Curve`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* <div className="mb-4 rounded-xl bg-[#FEF3F1] p-3 text-center text-lg font-bold text-[#883A2E]">
          {data.curve.evaluation}
        </div> */}
        <p className="mb-4 text-sm font-medium text-[#111111]">
          {data.curve.description}
        </p>
        <PointList points={data.curve.point} />
      </WhiteBox>

      {/* Visibility */}
      <WhiteBox>
        <SectionTitle>선명도 및 끊김</SectionTitle>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-[#883A2E]">
            {data.visibility.evaluation}
          </span>
          <span className="text-sm font-semibold text-[#696969]">{score}%</span>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[#E3E3E6]">
          <div
            className="h-full rounded-full bg-[#F97B68]"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="mb-4 text-sm text-[#424242]">
          {data.visibility.description}
        </p>
        <PointList points={data.visibility.point} />

        <div className="my-6 h-[1px] w-full bg-[#E3E3E6]" />

        <div className="mb-2 rounded-xl bg-[#FEF3F1] p-3 text-center text-lg font-bold text-[#883A2E]">
          {data.cut.evaluation}
        </div>
        <p className="mb-4 text-sm text-[#424242]">{data.cut.description}</p>
        <PointList points={data.cut.point} />
      </WhiteBox>

      {/* Total */}
      <WhiteBox>
        <SectionTitle>종합 분석</SectionTitle>
        <p className="text-sm leading-relaxed font-medium text-[#696969]">
          {data.total}
        </p>
      </WhiteBox>
    </div>
  );
};

export default FundamentalSection;
