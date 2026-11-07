'use client';

import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Circle } from 'lucide-react';

interface TerminalPaneProps {
  currentCommand?: string;
  history?: string[];
  title?: string;
  className?: string;
}

export function TerminalPane({
  currentCommand = '',
  history = [],
  title = 'RED OPERATOR C2 CONSOLE',
  className = '',
}: TerminalPaneProps) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!currentCommand) {
      setTyped('');
      return;
    }

    let i = 0;
    setTyped('');
    const interval = setInterval(() => {
      setTyped(currentCommand.slice(0, i + 1));
      i++;
      if (i >= currentCommand.length) {
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [currentCommand]);

  return (
    <div className={`bg-[#0A0A0D] rounded-xl border border-border overflow-hidden font-mono select-none flex flex-col ${className}`}>
      {/* Top window bar */}
      <div className="bg-[#121217] px-3.5 py-2 border-b border-[#26262C] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Circle className="w-2.5 h-2.5 fill-coral/80 text-coral/80" />
            <Circle className="w-2.5 h-2.5 fill-amber-500/80 text-amber-500/80" />
            <Circle className="w-2.5 h-2.5 fill-teal/80 text-teal/80" />
          </div>
          <span className="ml-2 text-muted font-medium text-[11px] tracking-wide">{title}</span>
        </div>
        <span className="text-[10px] text-coral font-bold px-1.5 py-0.5 rounded bg-coral/10 border border-coral/20">
          ARMED (SYNTHETIC)
        </span>
      </div>

      {/* Terminal content */}
      <div className="p-3 text-[13px] leading-relaxed flex-1 overflow-y-auto max-h-56 space-y-1 cy-no-anchor">
        <div className="text-muted/60 text-xs"># Session established over synthetic range link 10.0.1.0/24</div>
        <div className="text-muted/60 text-xs mb-2"># Strict compliance mode: RFC 1918 addresses only</div>

        {history.map((line, idx) => (
          <div key={idx} className="text-[#D4D4D8] break-all">
            <span className="text-coral mr-2 font-bold">c2@strike:~$</span>
            <span>{line}</span>
          </div>
        ))}

        {currentCommand && (
          <div className="text-coral break-all">
            <span className="text-coral mr-2 font-bold">c2@strike:~$</span>
            <span>{typed}</span>
            <span className="inline-block w-2 h-4 bg-coral ml-1 animate-pulse align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}

