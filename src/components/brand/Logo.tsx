'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  href?: string | null;
}

export function LogoMark({ size = 34, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/cynchor-mark.png"
        alt="Cynchor Mark"
        width={size}
        height={size}
        priority
        className="w-full h-full object-contain select-none"
      />
    </div>
  );
}

export function Logo({
  className = '',
  size = 'md',
  showWordmark = true,
  href = '/',
}: LogoProps) {
  const sizeMap = {
    sm: { markSize: 26, height: 26, width: 95 },
    md: { markSize: 32, height: 32, width: 120 },
    lg: { markSize: 42, height: 42, width: 155 },
    xl: { markSize: 56, height: 56, width: 205 },
  };

  const current = sizeMap[size];

  const content = showWordmark ? (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/cynchor-full-logo.png"
        alt="Cynchor"
        width={current.width}
        height={current.height}
        priority
        className="h-auto object-contain select-none max-h-full"
        style={{ height: `${current.height}px`, width: 'auto' }}
      />
    </div>
  ) : (
    <LogoMark size={current.markSize} className={className} />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
