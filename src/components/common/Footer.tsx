import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { Badge } from './Badge';
import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand info & Slogan Lockup */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Logo size="md" href="/" />
              <div className="pt-0.5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted font-medium">
                  Simulating reality to secure the future
                </p>
                <div 
                  className="mt-1.5 h-[2px] w-48 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #17ABA9 0%, #EA694B 100%)' }}
                />
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed max-w-sm pt-1">
              Adversarial cybersecurity training platform. Live Proxmox-based lab available today;
              scalable cloud-hosted range previewed for upcoming release.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge type="v1" size="sm" />
              <Badge type="v2" size="sm" />
            </div>
          </div>

          {/* V2 Marketing Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widestlabel text-text flex items-center gap-1.5">
              <span>Platform</span>
              <Badge type="v2" size="sm" />
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/product" className="hover:text-teal transition-colors">
                  Phishing Architecture
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-teal transition-colors">
                  Red vs Blue Exercises
                </Link>
              </li>
              <li>
                <Link href="/individuals" className="hover:text-teal transition-colors">
                  Solo Progression
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-teal transition-colors">
                  Security Posture
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal transition-colors">
                  About Cynchor
                </Link>
              </li>
            </ul>
          </div>

          {/* V1 Live Demo Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widestlabel text-text flex items-center gap-1.5">
              <span>Live Range</span>
              <Badge type="v1" size="sm" />
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/demo/login" className="hover:text-teal transition-colors">
                  Portal Login
                </Link>
              </li>
              <li>
                <Link href="/demo/profile" className="hover:text-teal transition-colors">
                  Profile Making
                </Link>
              </li>
              <li>
                <Link href="/demo/dashboard" className="hover:text-teal transition-colors">
                  Lab Dashboard
                </Link>
              </li>
              <li>
                <Link href="/demo/team" className="hover:text-teal transition-colors">
                  Team Formation
                </Link>
              </li>
              <li>
                <Link href="/demo/architecture" className="hover:text-teal transition-colors">
                  System Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widestlabel text-text">
              Governance
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/admin" className="hover:text-teal transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" /> Operator Console
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-muted/70 block font-mono">
                  Proxmox SDN Isolation
                </span>
              </li>
              <li>
                <span className="text-[11px] text-muted/70 block font-mono">
                  100% Synthetic Range Data
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} Cynchor. All rights reserved. Strictly non-production training simulation.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Domain: <code className="text-text">fintechcorp.local</code></span>
            <span className="text-border">|</span>
            <span>Hypervisor: <code className="text-teal">Proxmox VE 8.x</code></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
