'use client';

import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { ScrollProgress } from './ScrollProgress';

/**
 * PageEffects convenience component:
 * Mounts ScrollProgress bar and ScrollReveal intersection observer.
 * Must be rendered at the top of marketing pages, NOT in layout.tsx.
 */
export function PageEffects() {
  return (
    <>
      <ScrollProgress />
      <ScrollReveal />
    </>
  );
}
