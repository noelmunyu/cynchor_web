'use client';

import { useEffect } from 'react';
import '@/styles/motion.css';

// Module-level set ensuring reveal is strictly one-way and idempotent across re-renders
const revealedSet = new WeakSet<HTMLElement>();

export function ScrollReveal() {
  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-cy-reveal]'));
    if (revealElements.length === 0) return;

    // Apply stagger to children of data-cy-stagger parents
    const staggerContainers = document.querySelectorAll<HTMLElement>('[data-cy-stagger]');
    staggerContainers.forEach((container) => {
      const items = Array.from(container.querySelectorAll<HTMLElement>('[data-cy-reveal]'));
      items.forEach((item, idx) => {
        const staggerDelay = Math.min(idx * 80, 640);
        item.style.setProperty('--cy-d', `${staggerDelay}ms`);
      });
    });

    // Check existing explicit delays
    revealElements.forEach((el) => {
      const explicitDelay = el.getAttribute('data-cy-delay');
      if (explicitDelay && !el.style.getPropertyValue('--cy-d')) {
        el.style.setProperty('--cy-d', `${explicitDelay}ms`);
      }
    });

    // Progressive enhancement viewport check:
    // Elements already above or within viewport are revealed immediately without flash.
    // Reveal is strictly one-way: revealed elements are never re-hidden.
    const windowHeight = window.innerHeight;
    const belowFoldElements: HTMLElement[] = [];

    revealElements.forEach((el) => {
      if (revealedSet.has(el) || el.getAttribute('data-cy-in') === 'true') {
        revealedSet.add(el);
        el.setAttribute('data-cy-in', 'true');
        el.removeAttribute('data-cy-state');
        return;
      }

      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < windowHeight && rect.bottom > 0;

      if (isInViewport) {
        revealedSet.add(el);
        el.setAttribute('data-cy-in', 'true');
        el.removeAttribute('data-cy-state');
      } else {
        el.setAttribute('data-cy-state', 'ready');
        belowFoldElements.push(el);
      }
    });

    // Single IntersectionObserver for scroll reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            revealedSet.add(target);
            target.setAttribute('data-cy-in', 'true');
            target.removeAttribute('data-cy-state');
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    belowFoldElements.forEach((el) => observer.observe(el));

    // Handle hash anchor jumps (e.g. /security#compliance)
    const handleAnchorJump = () => {
      if (window.location.hash) {
        try {
          const target = document.querySelector(window.location.hash);
          if (target) {
            target.querySelectorAll<HTMLElement>('[data-cy-reveal]').forEach((child) => {
              revealedSet.add(child);
              child.setAttribute('data-cy-in', 'true');
              child.removeAttribute('data-cy-state');
            });
            if (target.hasAttribute('data-cy-reveal')) {
              const htmlTarget = target as HTMLElement;
              revealedSet.add(htmlTarget);
              htmlTarget.setAttribute('data-cy-in', 'true');
              htmlTarget.removeAttribute('data-cy-state');
            }
          }
        } catch {
          // ignore invalid selectors
        }
      }
    };

    window.addEventListener('hashchange', handleAnchorJump, { passive: true });
    handleAnchorJump();

    // Desktop-only cursor glow on .cy-glow-host (rAF throttled, >1024px)
    let rafId: number | null = null;
    const handlePointerMove = (e: PointerEvent) => {
      if (window.innerWidth < 1024) return;
      if (rafId !== null) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const glowHosts = document.querySelectorAll<HTMLElement>('.cy-glow-host');
        glowHosts.forEach((host) => {
          const rect = host.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          host.style.setProperty('--cy-x', `${x}px`);
          host.style.setProperty('--cy-y', `${y}px`);
        });
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleAnchorJump);
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}

