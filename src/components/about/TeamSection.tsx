import React from 'react';
import fs from 'fs';
import path from 'path';
import { TEAM_CONTENT } from '@/content/team';
import { TeamCard } from './TeamCard';
import { DecodeText } from '@/components/motion/DecodeText';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';

function resolvePhoto(photoSlug: string): string | null {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  for (const ext of extensions) {
    const filename = `${photoSlug}${ext}`;
    const fullPath = path.join(process.cwd(), 'public', 'team', filename);
    if (fs.existsSync(fullPath)) {
      return `/team/${filename}`;
    }
  }
  return null;
}

export function TeamSection() {
  return (
    <section aria-labelledby="team-heading" className="space-y-6 pt-2">
      {/* Eyebrow & Title Header */}
      <div className="text-center space-y-2">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted">
          <DecodeText text={TEAM_CONTENT.eyebrow} />
        </div>
        <h2
          id="team-heading"
          className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight"
        >
          <SplitText text="Meet the" /> <span className="text-teal">co-founders</span>
        </h2>
        <Reveal variant="fade-up" delay={80}>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed font-sans">
            {TEAM_CONTENT.subtitle}
          </p>
        </Reveal>
      </div>

      {/* 3-Column Co-founder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch" data-cy-stagger="true">
        {TEAM_CONTENT.members.map((member) => {
          const photoSrc = resolvePhoto(member.photoSlug);
          return <TeamCard key={member.id} member={member} photoSrc={photoSrc} />;
        })}
      </div>
    </section>
  );
}
