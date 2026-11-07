'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error message without exposing to public render
    console.error('Application error occurred:', error?.digest || 'unspecified');
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#09090B] text-[#E5E6E6]">
      <div className="max-w-md w-full bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-coral/15 border border-coral/30 text-coral flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-coral font-semibold">
            System Notice
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#E5E6E6] tracking-tight">
            An unexpected error occurred
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            The platform encountered a transient issue processing your request.
            No internal details were exposed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-heading text-xs font-semibold">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal text-[#09090B] hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#17171B] border border-[#26262C] text-[#E5E6E6] hover:border-teal/50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

