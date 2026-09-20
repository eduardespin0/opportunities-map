'use client';

import React from 'react';
import Link from 'next/link';
import { BellRing } from 'lucide-react';
import { Opportunity } from '../lib/types';

interface UrgentTickerProps {
  opportunities: Opportunity[];
}

export default function UrgentTicker({ opportunities }: UrgentTickerProps) {
  const list = opportunities.length > 0 ? opportunities : [];

  if (list.length === 0) return null;

  // Duplicate for seamless infinite horizontal loop
  const duplicatedList = [...list, ...list];

  return (
    <div className="ticker-bar">
      <div className="ticker-label">
        <BellRing size={13} className="ticker-bell-icon" />
        <span>CIERRA PRONTO</span>
      </div>

      {/* Continuous Horizontal Marquee */}
      <div className="ticker-marquee-window">
        <div className="ticker-marquee-track">
          {duplicatedList.map((opp, idx) => {
            const formattedDate = new Date(opp.deadline).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <Link
                key={`${opp.id}-${idx}`}
                href={`/opportunities/${opp.slug}`}
                className="ticker-marquee-link"
              >
                <span className="ticker-flag">{opp.countryFlag}</span>
                <span className="ticker-institution">{opp.institution}:</span>
                <span className="ticker-title">{opp.title}</span>
                <span className="ticker-deadline-badge">
                  Cierre: {formattedDate}
                </span>
                <span className="ticker-separator">•</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

