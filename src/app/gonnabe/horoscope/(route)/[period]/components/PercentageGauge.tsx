'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

type PercentageGaugeProps = {
  value: number; // 0-100
  animationDurationMs?: number;
  className?: string;
  labels?: {
    left: string;
    right: string;
  };
  gradientColors?: [string, string];
  backgroundGradientColors?: [string, string];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngleRad: number,
  endAngleRad: number,
) {
  const start = polarToCartesian(cx, cy, r, startAngleRad);
  const end = polarToCartesian(cx, cy, r, endAngleRad);

  const delta = endAngleRad - startAngleRad;
  const largeArcFlag = Math.abs(delta) > Math.PI ? 1 : 0;
  const sweepFlag = delta >= 0 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const next = element.getBoundingClientRect().width;
      setWidth((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(element);

    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

export default function PercentageGauge({
  value,
  animationDurationMs = 1500,
  className,
  labels = { left: '나쁨', right: '좋음' },
  gradientColors = ['rgba(3, 188, 255, 0.08)', 'rgba(77, 47, 242, 0.78)'],
  backgroundGradientColors = [
    'rgba(122, 211, 255, 0.09)',
    'rgba(122, 211, 255, 0.09)',
  ],
}: PercentageGaugeProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const rawGradientId = useId();
  const rawBgGradientId = useId();
  const gradientId = useMemo(
    () => rawGradientId.replace(/[^a-zA-Z0-9_-]/g, '_'),
    [rawGradientId],
  );
  const bgGradientId = useMemo(
    () => rawBgGradientId.replace(/[^a-zA-Z0-9_-]/g, '_'),
    [rawBgGradientId],
  );

  const target = clamp(value, 0, 100);
  const [animatedValue, setAnimatedValue] = useState<number>(0);

  useEffect(() => {
    let raf = 0;
    const startValue = animatedValue;
    const startTs = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTs;
      const t = clamp(elapsed / animationDurationMs, 0, 1);
      const eased = easeInOutCubic(t);
      const next = startValue + (target - startValue) * eased;
      setAnimatedValue(next);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, animationDurationMs]);

  const geometry = useMemo(() => {
    const w = width || 1;
    const h = w * 0.5;

    const center = { x: w / 2, y: h * 0.8 };
    const radius = w * 0.35;
    const strokeWidth = 40;
    const progressStrokeWidth = strokeWidth - 8;

    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;

    const progressAngle = (animatedValue / 100) * Math.PI;
    const progressEndAngle = startAngle + progressAngle;

    return {
      w,
      h,
      center,
      radius,
      strokeWidth,
      progressStrokeWidth,
      startAngle,
      endAngle,
      progressAngle,
      progressEndAngle,
    };
  }, [width, animatedValue]);

  const needle = useMemo(() => {
    const { center, w, progressAngle } = geometry;

    const needleCenter = { x: center.x, y: center.y };
    const originalAngle = Math.PI + progressAngle;

    const needleLength = w * 0.175; // Flutter의 70px(대략 400px 폭 기준)을 비율로 스케일
    const baseRadius = w * 0.0375; // Flutter의 15px을 비율로 스케일
    const halfAngle = 1.4;

    const tip = polarToCartesian(
      needleCenter.x,
      needleCenter.y,
      needleLength,
      originalAngle,
    );
    const p1 = polarToCartesian(
      needleCenter.x,
      needleCenter.y,
      baseRadius,
      originalAngle + halfAngle,
    );
    const p2 = polarToCartesian(
      needleCenter.x,
      needleCenter.y,
      baseRadius,
      originalAngle - halfAngle,
    );

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);

    const cornerRadius = w * 0.015;
    const tipToP1 = dist(tip, p1);
    const tipToP2 = dist(tip, p2);
    const safeCornerRadius = Math.min(
      cornerRadius,
      Math.min(tipToP1, tipToP2) * 0.8,
    );

    const moveTowards = (
      from: { x: number; y: number },
      to: { x: number; y: number },
      amount: number,
    ) => {
      const d = dist(from, to) || 1;
      return {
        x: from.x + ((to.x - from.x) / d) * amount,
        y: from.y + ((to.y - from.y) / d) * amount,
      };
    };

    const tipOffset1 = moveTowards(tip, p1, safeCornerRadius);
    const tipOffset2 = moveTowards(tip, p2, safeCornerRadius);

    // Flutter의 arcToPoint와 유사하게 tip을 제어점으로 둔 quadratic curve로 둥근 팁을 근사
    const path = [
      `M ${p1.x} ${p1.y}`,
      `L ${tipOffset1.x} ${tipOffset1.y}`,
      `Q ${tip.x} ${tip.y} ${tipOffset2.x} ${tipOffset2.y}`,
      `L ${p2.x} ${p2.y}`,
      'Z',
    ].join(' ');

    return {
      path,
      center: needleCenter,
      outerDotR: baseRadius,
      innerDotR: baseRadius * 0.6,
    };
  }, [geometry]);

  if (!width) {
    return <div ref={ref} className={className ?? 'w-full'} />;
  }

  const backgroundArc = describeArc(
    geometry.center.x,
    geometry.center.y,
    geometry.radius,
    geometry.startAngle,
    geometry.endAngle,
  );

  const progressArc = describeArc(
    geometry.center.x,
    geometry.center.y,
    geometry.radius,
    geometry.startAngle,
    geometry.progressEndAngle,
  );

  const progressGradient = (() => {
    const start = polarToCartesian(
      geometry.center.x,
      geometry.center.y,
      geometry.radius,
      geometry.startAngle,
    );
    const end = polarToCartesian(
      geometry.center.x,
      geometry.center.y,
      geometry.radius,
      geometry.progressEndAngle,
    );

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);

    if (len < 0.001) {
      return {
        x1: start.x,
        y1: start.y,
        x2: start.x + 1,
        y2: start.y,
      };
    }

    return {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    };
  })();

  return (
    <div ref={ref} className={className ?? 'w-full'}>
      <div className="flex w-full flex-col">
        <svg
          width={geometry.w}
          height={geometry.h}
          viewBox={`0 0 ${geometry.w} ${geometry.h}`}
          role="img"
          aria-label="에너지 게이지"
        >
          <defs>
            <linearGradient id={bgGradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={backgroundGradientColors[0]} />
              <stop offset="100%" stopColor={backgroundGradientColors[1]} />
            </linearGradient>
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={progressGradient.x1}
              y1={progressGradient.y1}
              x2={progressGradient.x2}
              y2={progressGradient.y2}
            >
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>

          <path
            d={backgroundArc}
            fill="none"
            stroke={`url(#${bgGradientId})`}
            strokeWidth={geometry.strokeWidth}
            strokeLinecap="round"
          />

          {animatedValue > 0 ? (
            <path
              d={progressArc}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={geometry.progressStrokeWidth}
              strokeLinecap="round"
            />
          ) : null}

          <path d={needle.path} fill="#8EA3C5" />
          <circle
            cx={needle.center.x}
            cy={needle.center.y}
            r={needle.outerDotR}
            fill="#8EA3C5"
          />
          <circle
            cx={needle.center.x}
            cy={needle.center.y}
            r={needle.innerDotR}
            fill="#556E96"
          />
        </svg>

        <div
          className="flex w-full items-end justify-between"
          style={{
            paddingLeft: geometry.w * 0.1,
            paddingRight: geometry.w * 0.1,
            marginTop: -4,
          }}
        >
          <span className="text-[11px] font-bold">{labels.left}</span>
          <span className="text-[11px] font-bold">{labels.right}</span>
        </div>
      </div>
    </div>
  );
}
