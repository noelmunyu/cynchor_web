'use client';

import React from 'react';
import { AlertCircle, Clock, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export interface SOCAlert {
  id: string;
  source: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  age: string;
  status: 'DETECTED' | 'TRIAGED' | 'CONTAINED';
  mitre?: string;
}

interface AlertQueueProps {
  alerts: SOCAlert[];
  mttdSeconds: number;
  onSelectAlert?: (alert: SOCAlert) => void;
  onContain?: (alertId: string) => void;
  className?: string;
}

export function AlertQueue({
  alerts,
  mttdSeconds,
  onSelectAlert,
  onContain,
  className = '',
}: AlertQueueProps) {
  const getSeverityStyle = (severity: SOCAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return { dot: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30' };
      case 'HIGH':
        return { dot: 'bg-coral', text: 'text-coral', border: 'border-coral/30' };
      case 'MEDIUM':
        return { dot: 'bg-amber-400', text: 'text-amber-400', border: 'border-amber-400/30' };
      default:
        return { dot: 'bg-blue-400', text: 'text-blue-400', border: 'border-blue-400/30' };
    }
  };

  const getStatusBadge = (status: SOCAlert['status']) => {
    switch (status) {
      case 'CONTAINED':
        return <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-teal/20 text-teal font-semibold">CONTAINED</span>;
      case 'TRIAGED':
        return <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-blue-500/20 text-blue-400 font-semibold">TRIAGED</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-coral/20 text-coral font-semibold animate-pulse">DETECTED</span>;
    }
  };

  return (
    <div className={`bg-[#0F1014] rounded-xl border border-border p-3.5 select-none ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#26262C] font-mono text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal" />
          <span className="font-semibold text-text">BLUE SOC ALERT QUEUE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal/10 border border-teal/30 text-[11px] text-teal">
          <Clock className="w-3 h-3" />
          <span>MTTD: <strong>{mttdSeconds > 0 ? `${mttdSeconds}s` : '—'}</strong></span>
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 cy-no-anchor">
        {alerts.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted font-mono">
            No active SOC alerts. Baseline nominal.
          </div>
        ) : (
          alerts.map((alert) => {
            const sev = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert?.(alert)}
                className={`p-2 rounded-lg bg-[#14151B] border hover:border-teal/50 transition-all cursor-pointer ${sev.border}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
                    <span className={`w-2 h-2 rounded-full ${sev.dot}`} />
                    <span className="text-text font-medium truncate max-w-[130px]">{alert.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(alert.status)}
                    <span className="text-[10px] text-muted font-mono">{alert.age}</span>
                  </div>
                </div>

                <div className="text-[11.5px] text-[#D1D5DB] font-sans truncate mb-2">
                  {alert.title}
                </div>

                {/* Quick containment button if detected */}
                <div className="flex items-center justify-between pt-1 border-t border-[#26262C]/60 text-[10px] font-mono">
                  <span className="text-muted">{alert.mitre || 'T1059'}</span>
                  {alert.status === 'DETECTED' && onContain ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContain(alert.id);
                      }}
                      className="px-2 py-0.5 rounded bg-teal/20 text-teal hover:bg-teal hover:text-white transition-colors flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3" /> Isolate Host
                    </button>
                  ) : (
                    <span className="text-muted/60">Policy Enforced</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

