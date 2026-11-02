import React from 'react';
import { splitWords } from '@/lib/motion/splitWords';

interface SplitTextProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  as?: React.ElementType;
  className?: string;
  mode?: 'words' | 'lines';
  delay?: number;
}

/**
 * Server-safe split text renderer.
 * Splitting is deterministic; container carries aria-label, spans are aria-hidden.
 */
export function SplitText({
  text,
  as: Component = 'div',
  className = '',
  mode = 'words',
  delay = 0,
  ...props
}: SplitTextProps) {
  const words = splitWords(text, 12);

  return (
    <Component
      data-cy-reveal="fade"
      data-cy-delay={delay}
      aria-label={text}
      className={className}
      {...props}
    >
      {words.map((word, idx) => (
        <span key={idx} className="cy-split-word-mask" aria-hidden="true">
          <span
            className="cy-split-word"
            style={
              {
                '--cy-word-delay': `${delay + idx * 28}ms`,
              } as React.CSSProperties
            }
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
