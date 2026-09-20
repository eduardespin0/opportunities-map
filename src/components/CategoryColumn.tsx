import React from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Briefcase, Award, BookOpen } from 'lucide-react';
import { Opportunity, OpportunityCategory } from '../lib/types';
import OpportunityCard from './OpportunityCard';

interface CategoryColumnProps {
  title: string;
  category: OpportunityCategory;
  featuredOpportunity?: Opportunity;
  secondaryOpportunities: Opportunity[];
}

export default function CategoryColumn({
  title,
  category,
  featuredOpportunity,
  secondaryOpportunities,
}: CategoryColumnProps) {
  const getCategoryIcon = () => {
    switch (category) {
      case 'scholarships':
        return <GraduationCap size={20} style={{ color: '#3b82f6' }} />;
      case 'internships':
        return <Briefcase size={20} style={{ color: '#0ea5e9' }} />;
      case 'fellowships':
        return <Award size={20} style={{ color: '#f59e0b' }} />;
      case 'courses':
        return <BookOpen size={20} style={{ color: '#10b981' }} />;
      default:
        return <Award size={20} />;
    }
  };

  return (
    <section className="column-card">
      <div className="column-header">
        <div className="column-title-badge">
          {getCategoryIcon()}
          <span>{title}</span>
        </div>
        <Link
          href={`/category/${category}`}
          className="column-see-all"
        >
          <span>Ver todas</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="column-body">
        {featuredOpportunity && (
          <OpportunityCard opportunity={featuredOpportunity} />
        )}

        {secondaryOpportunities.length > 0 && (
          <div className="compact-items-list">
            {secondaryOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} compact />
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <Link
            href={`/category/${category}`}
            className="btn-primary"
            style={{ width: '100%', padding: '10px 14px', fontSize: '0.88rem' }}
          >
            <span>Explorar {title}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
