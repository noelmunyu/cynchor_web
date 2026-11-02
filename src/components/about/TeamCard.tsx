'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { TeamMember } from '@/content/team';

interface TeamCardProps {
  member: TeamMember;
  photoSrc: string | null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function TeamCard({ member, photoSrc }: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const initials = getInitials(member.name);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:border-teal/50 hover:shadow-[0_0_24px_rgba(23,171,169,0.1)] transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Photo or Fallback Avatar in Uniform 4:5 Frame with Hairline Gradient Ring */}
        <div className="p-[1px] rounded-2xl bg-gradient-to-b from-teal/40 via-border to-coral/40 group-hover:from-teal group-hover:to-coral transition-colors duration-200">
          <div className="aspect-[4/5] relative w-full overflow-hidden rounded-2xl bg-surface-2 flex items-center justify-center">
            {photoSrc ? (
              <>
                <Image
                  src={photoSrc}
                  alt={`Portrait of ${member.name}`}
                  width={640}
                  height={800}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover w-full h-full"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              /* Fallback Avatar with Initials and Faint Concentric Arc Motif */
              <div
                role="img"
                aria-label={`Photo of ${member.name} coming soon`}
                className="w-full h-full relative flex items-center justify-center bg-surface-2 select-none"
              >
                {/* Concentric Arcs Background */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
                  viewBox="0 0 200 250"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="100" cy="125" r="30" stroke="#17ABA9" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="100" cy="125" r="55" stroke="#17ABA9" strokeWidth="1.5" />
                  <circle cx="100" cy="125" r="80" stroke="#EA694B" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="100" cy="125" r="105" stroke="#EA694B" strokeWidth="1.5" />
                </svg>

                <span className="font-heading font-bold text-4xl sm:text-5xl text-text relative z-10 tracking-tight">
                  {initials}
                </span>

                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Member Header: Name & Role Badge */}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-heading font-bold text-lg sm:text-xl text-text tracking-tight">
            {member.name}
          </h3>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/30">
            {member.role}
          </span>
        </div>

        {/* Tagline */}
        <p className="italic text-xs text-muted font-sans font-medium mt-1">
          &ldquo;{member.tagline}&rdquo;
        </p>

        {/* Short Bio */}
        <p className="text-xs sm:text-sm text-text/90 leading-relaxed font-sans mt-3">
          {member.shortBio}
        </p>

        {/* Focus Area Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {member.focusAreas.map((area, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[12px] font-mono bg-surface-2 border border-border text-muted"
            >
              {area}
            </span>
          ))}
        </div>

        {/* Expandable Full Bio */}
        <div
          id={`bio-${member.id}`}
          className={`space-y-2.5 overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${
            isExpanded
              ? 'max-h-[1000px] opacity-100 pt-3 border-t border-border/60 mt-3'
              : 'max-h-0 opacity-0'
          }`}
        >
          {member.fullBio.map((paragraph, idx) => (
            <p key={idx} className="text-xs text-muted leading-relaxed font-sans">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Card Actions: Toggle Button & Optional Links */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={`bio-${member.id}`}
          className="text-xs font-mono font-semibold text-teal hover:text-teal/80 focus-visible:ring-2 focus-visible:ring-teal outline-none rounded py-1 inline-flex items-center gap-1 transition-colors"
        >
          <span>{isExpanded ? 'Show less' : 'Read full bio'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 motion-reduce:transition-none ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Optional Links Row (only if non-empty) */}
        {member.links && member.links.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border mt-2">
            {member.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-teal hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-teal outline-none rounded"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3 text-muted" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
