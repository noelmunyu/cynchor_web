import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#09090B] text-[#E5E6E6]">
      <div className="max-w-md w-full bg-[#111114] border border-[#26262C] rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-teal/15 border border-teal/30 text-teal flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal font-semibold">
            404 • Resource Not Found
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#E5E6E6] tracking-tight">
            Page Not Located
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            The requested route or technical manifest does not exist or has been relocated to protect system boundaries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-heading text-xs font-semibold">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal text-[#09090B] hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/product"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#17171B] border border-[#26262C] text-[#E5E6E6] hover:border-teal/50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Product
          </Link>
        </div>
      </div>
    </div>
  );
}

