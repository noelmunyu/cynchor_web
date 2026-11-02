'use client';

import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEF0123456789<>/_-';

interface DecodeTextProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export function DecodeText({
  text,
  className = '',
  as: Component = 'span',
  ...props
}: DecodeTextProps) {
  // Cap at 40 characters max
  const targetText = text.slice(0, 40);
  const [displayText, setDisplayText] = useState<string>(targetText);
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimatedRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Trigger decoding only once when revealed
    const startScramble = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const duration = 700; // ms
      const interval = 35; // ms
      const totalSteps = duration / interval;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / totalSteps, 1);
        const resolvedCount = Math.floor(progress * targetText.length);

        let result = '';
        for (let i = 0; i < targetText.length; i++) {
          if (targetText[i] === ' ') {
            result += ' ';
          } else if (i < resolvedCount) {
            result += targetText[i];
          } else {
            const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
            result += randomChar;
          }
        }

        setDisplayText(result);

        if (step >= totalSteps) {
          clearInterval(timer);
          setDisplayText(targetText);
        }
      }, interval);
    };

    // Observer to detect when element becomes visible or gets data-cy-in="true"
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startScramble();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [targetText]);

  return (
    <Component
      ref={containerRef as any}
      aria-label={targetText}
      className={`font-mono ${className}`}
      {...props}
    >
      {displayText}
    </Component>
  );
}

