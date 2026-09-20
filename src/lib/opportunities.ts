import rawOpportunities from '../data/opportunities.json';
import { Opportunity, OpportunityCategory, FilterState } from './types';

// Cast JSON data and filter only published opportunities for public consumption
const OPPORTUNITIES: Opportunity[] = (rawOpportunities as Opportunity[]).filter(
  (opp) => opp.status !== 'draft'
);

export function getAllOpportunities(includeDrafts = false): Opportunity[] {
  if (includeDrafts) {
    return rawOpportunities as Opportunity[];
  }
  return OPPORTUNITIES;
}

export function getOpportunityBySlug(slug: string): Opportunity | undefined {
  return OPPORTUNITIES.find((opp) => opp.slug === slug || opp.id === slug);
}

export function getOpportunitiesByCategory(category: OpportunityCategory): Opportunity[] {
  return OPPORTUNITIES.filter((opp) => opp.category === category);
}

export function getFeaturedByCategory(category: OpportunityCategory): Opportunity | undefined {
  return OPPORTUNITIES.find((opp) => opp.category === category && opp.featured) || 
         OPPORTUNITIES.find((opp) => opp.category === category);
}

export function getRecentByCategory(category: OpportunityCategory, limit = 3): Opportunity[] {
  const featured = getFeaturedByCategory(category);
  return OPPORTUNITIES
    .filter((opp) => opp.category === category && opp.id !== featured?.id)
    .slice(0, limit);
}

export function getUrgentOpportunities(): Opportunity[] {
  return OPPORTUNITIES.filter((opp) => opp.isUrgent);
}

export function getRelatedOpportunities(currentId: string, category: OpportunityCategory, limit = 3): Opportunity[] {
  return OPPORTUNITIES
    .filter((opp) => opp.id !== currentId && (opp.category === category || opp.fundingType === 'Fully Funded'))
    .slice(0, limit);
}

export function filterOpportunities(opportunities: Opportunity[], filters: Partial<FilterState>): Opportunity[] {
  return opportunities.filter((opp) => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        opp.title.toLowerCase().includes(q) ||
        opp.institution.toLowerCase().includes(q) ||
        opp.country.toLowerCase().includes(q) ||
        opp.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (filters.category && filters.category !== 'all') {
      if (opp.category !== filters.category) return false;
    }

    if (filters.fundingType && filters.fundingType !== 'all') {
      if (opp.fundingType !== filters.fundingType) return false;
    }

    if (filters.country && filters.country !== 'all') {
      if (opp.country.toLowerCase() !== filters.country.toLowerCase()) return false;
    }

    if (filters.degreeLevel && filters.degreeLevel !== 'all') {
      if (!opp.degreeLevel.includes(filters.degreeLevel)) return false;
    }

    return true;
  });
}
