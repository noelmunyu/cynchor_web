'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { Badge } from './Badge';
import { DisclaimerModal } from '../disclaimer/DisclaimerModal';
import { Menu, X, Terminal, ShieldCheck } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Product', href: '/product' },
    { label: 'Teams', href: '/teams' },
    { label: 'Individuals', href: '/individuals' },
    { label: 'Security', href: '/security' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border">
        {/* Top Status Bar distinguishing V1 vs V2 */}
        <div className="bg-bg/90 border-b border-border py-1 px-4 text-xs text-muted flex items-center justify-between">
          <div className="container mx-auto flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-text text-[11px]">Cynchor Range:</span>
              <span className="hidden sm:inline text-[11px] text-muted">
                Invite-only demo environment. Cloud platform in preview.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge type="v1" size="sm" />
              <Badge type="v2" size="sm" />
            </div>
          </div>
        </div>

        {/* Main Slim Navbar */}
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="md" href="/" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-heading text-xs tracking-wide transition-colors ${
                      isActive ? 'text-teal font-semibold' : 'text-muted hover:text-text'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/demo/login"
              className="text-xs font-heading font-medium text-muted hover:text-text px-3 py-1.5 rounded-xl border border-border hover:border-muted transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-teal" />
              Portal Login
            </Link>

            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="text-xs font-heading font-semibold px-4 py-2 rounded-xl bg-teal text-bg hover:shadow-glow-teal transition-all flex items-center gap-1.5 focus:ring-2 focus:ring-teal focus:outline-none"
            >
              <ShieldCheck className="w-4 h-4" />
              Test Our Product
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="text-[11px] font-heading font-semibold px-3 py-1.5 rounded-xl bg-teal text-bg shadow-sm"
            >
              Test Product
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-text rounded-lg hover:bg-surface-2"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-heading font-medium ${
                  pathname === '/' ? 'bg-surface-2 text-teal font-semibold' : 'text-muted'
                }`}
              >
                Home
              </Link>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-heading font-medium ${
                    pathname === item.href ? 'bg-surface-2 text-teal font-semibold' : 'text-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/demo/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-heading font-medium border border-border rounded-xl text-text hover:bg-surface-2"
              >
                V1 Demo Login
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-heading font-medium border border-border rounded-xl text-muted hover:text-text hover:bg-surface-2"
              >
                Operator Admin Console
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mandatory Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </>
  );
}

export default Header;
