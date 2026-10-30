'use client';

import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export interface LogLine {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  isAnomalous?: boolean;
}

interface LogStreamProps {
  logs: LogLine[];
  title?: string;
  className?: string;
}

export function LogStream({
  logs,
  title = 'TELEMETRY & AUDIT STREAM',
  className = '',
}: LogStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`bg-[#0A0A0D] rounded-xl border border-border p-3.5 flex flex-col font-mono select-none ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#26262C] text-xs">
        <div className="flex items-center gap-2 text-muted">
          <Terminal className="w-3.5 h-3.5 text-teal" />
          <span className="font-semibold text-text uppercase tracking-wider">{title}</span>
        </div>
        <span className="text-[10px] text-teal animate-pulse">● LIVE INGEST</span>
      </div>

      <div
        ref={containerRef}
        className="space-y-1.5 overflow-y-auto max-h-48 text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-[#26262C]"
      >
        {logs.length === 0 ? (
          <div className="text-muted/60 py-4 text-center">Listening on syslog socket 10.0.99.1:514...</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-1 rounded font-mono transition-colors ${
                log.isAnomalous
                  ? 'bg-coral/10 text-coral border-l-2 border-coral pl-2'
                  : 'text-[#A1A1AA] hover:bg-[#15151B]'
              }`}
            >
              <span className="text-muted/70 mr-2 text-[10px]">{log.timestamp}</span>
              <span className="text-[#38BDF8] mr-2">[{log.source}]</span>
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

