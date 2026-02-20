import React from 'react';

const WhiteBox = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[20px] border border-white bg-[rgba(255,255,255,0.8)] p-6 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

export default WhiteBox;

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-4 text-xl font-bold text-[#111111]">{children}</h3>
);

export const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-2 text-lg font-semibold text-[#111111]">{children}</h4>
);

export const PointList = ({ points }: { points: string[] }) => (
  <ul className="space-y-2">
    {points?.map((point, idx) => (
      <li
        key={idx}
        className="text-sm leading-relaxed font-medium text-[#696969]"
      >
        • {point}
      </li>
    ))}
  </ul>
);
