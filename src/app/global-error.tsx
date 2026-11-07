'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090B] text-[#E5E6E6] min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#111114] border border-[#26262C] rounded-2xl p-8 text-center space-y-6">
          <h1 className="font-bold text-2xl text-[#E5E6E6]">
            System Interruption
          </h1>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            A critical application error occurred. No diagnostic details or internal routes were exposed.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-[#17ABA9] text-[#09090B] font-semibold text-xs hover:bg-[#17ABA9]/90 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-[#17171B] border border-[#26262C] text-[#E5E6E6] font-semibold text-xs hover:border-[#17ABA9]/50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

