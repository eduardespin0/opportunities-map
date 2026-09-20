import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { Opportunity } from '../lib/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  compact?: boolean;
}

export default function OpportunityCard({ opportunity, compact = false }: OpportunityCardProps) {
  const {
    slug,
    title,
    shortTitle,
    institution,
    institutionLogoText,
    country,
    countryFlag,
    fundingType,
    deadline,
    isUrgent,
    bannerTheme,
    category,
  } = opportunity;

  const formattedDeadline = new Date(deadline).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const bgGradient = bannerTheme
    ? `linear-gradient(135deg, ${bannerTheme.primaryColor} 0%, #0f172a 100%)`
    : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';

  const bannerStyle: React.CSSProperties = opportunity.bannerImageUrl
    ? { 
        backgroundImage: `url(${opportunity.bannerImageUrl})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative'
      }
    : { background: bgGradient, position: 'relative' };

  if (compact) {
    return (
      <Link href={`/opportunities/${slug}`} className="compact-item">
        {opportunity.bannerImageUrl ? (
          <div className="compact-thumbnail" style={{ backgroundImage: `url(${opportunity.bannerImageUrl})` }}>
            <span className="compact-thumbnail-flag">{countryFlag}</span>
          </div>
        ) : (
          <span className="compact-flag">{countryFlag}</span>
        )}
        <div className="compact-details">
          <h4 className="compact-title">{title}</h4>
          <div className="compact-sub">
            <span>{institution}</span>
            <span>•</span>
            <span style={{ color: isUrgent ? '#ef4444' : 'inherit' }}>
              Cierre: {formattedDeadline}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="featured-card">
      <Link href={`/opportunities/${slug}`} style={{ textDecoration: 'none' }}>
        <div className="card-banner" style={bannerStyle}>
          {/* Overlay to ensure text readability if there's an image */}
          {opportunity.bannerImageUrl && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 100%)', zIndex: 0 }} />
          )}

          <div className="card-banner-top" style={{ position: 'relative', zIndex: 1 }}>
            <span className="banner-institution-badge">
              {institutionLogoText || institution}
            </span>
            <span className="banner-country-flag" title={country}>
              {countryFlag}
            </span>
          </div>

          <div className="card-banner-bottom" style={{ position: 'relative', zIndex: 1 }}>
            <h3 className="banner-headline">{shortTitle}</h3>
          </div>
        </div>

        <div className="card-content">
          <div className="card-badges">
            <span className="badge-funded">{fundingType}</span>
            {isUrgent && <span className="badge-urgent">Cierra Pronto</span>}
          </div>

          <h2 className="card-title">{title}</h2>

          <div className="card-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} />
              <span>{country}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} />
              <span>{formattedDeadline}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
