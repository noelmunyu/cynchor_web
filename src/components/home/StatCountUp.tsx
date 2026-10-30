'use client';

import React, { useState, useEffect, useRef } from 'react';

interface StatItemProps {
  endValue: number;
  suffix?: string;
  label: string;
  duration?: number;
}

function StatItem({ endValue, suffix = '', label, duration = 1200 }: StatItemProps) {
  // Always initialize with final value so SSR and resting HTML are never 0
  const [count, setCount] = useState<number>(endValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Under prefers-reduced-motion, keep final value immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (!containerRef.current || hasAnimatedRef.current) return;

    let animationFrameId: number;

    const startAnimation = () => {
      hasAnimatedRef.current = true;
      setCount(0); // Start animation from 0

      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic: 1 - (1 - t)^3
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(eased * endValue);
        setCount(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [endValue, duration]);

  return (
    <div ref={containerRef} className="space-y-0.5">
      <div className="font-heading font-black text-2xl sm:text-3xl text-text tracking-tight flex items-baseline">
        <span>{count}</span>
        {suffix && <span className="text-teal font-bold text-lg sm:text-xl ml-0.5">{suffix}</span>}
      </div>
      <div className="text-[11px] sm:text-xs text-muted leading-tight font-sans">
        {label}
      </div>
    </div>
  );
}

export function StatRow() {
  return (
    <div className="pt-4 border-t border-border/80 grid grid-cols-3 gap-3 sm:gap-6">
      <StatItem endValue={2} label="Combat disciplines (Red & Blue)" />
      <StatItem endValue={3} suffix="+" label="Players per squad quorum" />
      <StatItem endValue={100} suffix="%" label="Synthetic isolated data" />
    </div>
  );
}

export default StatRow;
