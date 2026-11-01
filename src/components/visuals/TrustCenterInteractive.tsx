'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Printer, Menu, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { SecurityQuestion } from '@/content/trust-center';

export interface TocItem {
  id: string;
  label: string;
  number: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', number: '2.1', label: 'Posture Overview' },
  { id: 'compliance', number: '2.2', label: 'Compliance Status' },
  { id: 'app-sec', number: '2.3', label: 'Application Security' },
  { id: 'infrastructure', number: '2.4', label: 'Infrastructure Baseline' },
  { id: 'data-collected', number: '2.5', label: 'Data We Collect' },
  { id: 'third-parties', number: '2.6', label: 'Third Parties' },
  { id: 'access-control', number: '2.7', label: 'Access Control & RBAC' },
  { id: 'incident-response', number: '2.8', label: 'Incident Response & VDP' },
  { id: 'architecture', number: '2.9', label: 'Architecture & Zones' },
  { id: 'faq', number: '2.10', label: 'Security Questionnaire' },
  { id: 'documents', number: '2.11', label: 'Documents & Requests' },
  { id: 'honesty', number: '2.12', label: "What We Don't Claim" },
];

export function TrustCenterTOC() {
  const [activeId, setActiveId] = useState<string>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(TOC_ITEMS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(TOC_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Collapsible Contents Menu (Sticky Header Banner) */}
      <div className="lg:hidden sticky top-0 z-30 mb-6 bg-[#0E0F14]/95 backdrop-blur-md border-b border-border p-3 no-print">
        <button
          type="button"
          onClick={() => setIsOpenMobile((prev) => !prev)}
          aria-expanded={isOpenMobile}
          aria-controls="mobile-toc-drawer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-text hover:border-teal/50 focus-visible:ring-2 focus-visible:ring-teal outline-none transition-colors"
        >
          <span className="flex items-center gap-2">
            <Menu className="w-4 h-4 text-teal" />
            <span>Table of Contents</span>
            <span className="text-muted">
              ({TOC_ITEMS.find((t) => t.id === activeId)?.number} {TOC_ITEMS.find((t) => t.id === activeId)?.label})
            </span>
          </span>
          <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpenMobile ? 'rotate-180' : ''}`} />
        </button>

        {isOpenMobile && (
          <div id="mobile-toc-drawer" className="mt-2 p-3 rounded-xl bg-surface border border-border space-y-1">
            {TOC_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpenMobile(false)}
                  className={`block px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-teal/15 text-teal font-semibold'
                      : 'text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  <span className="text-muted/60 mr-2">{item.number}</span>
                  {item.label}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Sticky Left Table of Contents */}
      <nav
        aria-label="Trust Center Table of Contents"
        className="hidden lg:block w-64 shrink-0 sticky top-24 self-start space-y-3 no-print"
      >
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold px-3">
          On This Page
        </div>
        <div className="space-y-0.5 border-l border-border pl-2">
          {TOC_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-sans transition-all focus-visible:ring-2 focus-visible:ring-teal outline-none ${
                  isActive
                    ? 'text-teal font-medium bg-teal/10 border-l-2 border-teal -ml-[9px] pl-3'
                    : 'text-muted hover:text-text hover:bg-white/5'
                }`}
              >
                <span className="font-mono text-[11px] text-muted/60 w-6 shrink-0">{item.number}</span>
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-text hover:border-teal/50 hover:text-teal focus-visible:ring-2 focus-visible:ring-teal outline-none transition-colors no-print"
      title="Print or export Trust Center report"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>Print / PDF</span>
    </button>
  );
}

export function QuickAnswersAccordion({ questions }: { questions: SecurityQuestion[] }) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'q-certifications': true,
    'q-encryption-at-rest': true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-3">
      {questions.map((q) => {
        const isOpen = !!openIds[q.id];
        return (
          <div
            key={q.id}
            className="rounded-2xl border border-border bg-[#0E0F14] overflow-hidden transition-all hover:border-[#383842]"
          >
            <button
              type="button"
              onClick={() => toggle(q.id)}
              aria-expanded={isOpen}
              aria-controls={`panel-${q.id}`}
              className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 focus-visible:ring-2 focus-visible:ring-teal outline-none"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                  {q.isInPlace ? (
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted" />
                  )}
                </span>
                <div>
                  <h4 className="font-heading font-semibold text-sm sm:text-base text-text">
                    {q.question}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                        q.isInPlace
                          ? 'bg-teal/15 text-teal border border-teal/30'
                          : 'bg-[#181820] text-muted border border-border'
                      }`}
                    >
                      {q.isInPlace ? 'In place' : 'On roadmap'}
                    </span>
                    {q.controlId && (
                      <span className="text-[10px] font-mono text-muted/60">
                        Ref: {q.controlId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 mt-1 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={`panel-${q.id}`}
                className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-muted font-sans leading-relaxed border-t border-[#1C1C24] mt-1"
              >
                <div className="pt-3">{q.answer}</div>
                {q.controlId && (
                  <div className="mt-2 text-[11px] font-mono text-teal/80">
                    Evidence ID: <code className="text-text">{q.controlId}</code>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
