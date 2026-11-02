import React from 'react';

export type RevealVariant =
  | 'fade-up'
  | 'fade'
  | 'blur-in'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'line';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: RevealVariant;
  delay?: number;
  stagger?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Server-safe thin wrapper that renders data-cy-* attributes.
 * Allows marketing pages to remain React Server Components.
 */
export function Reveal({
  as: Component = 'div',
  variant = 'fade-up',
  delay,
  stagger,
  className = '',
  children,
  ...props
}: RevealProps) {
  return (
    <Component
      data-cy-reveal={variant}
      data-cy-delay={typeof delay === 'number' ? delay : undefined}
      data-cy-stagger={stagger ? 'true' : undefined}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

