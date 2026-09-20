export type OpportunityCategory = 
  | 'scholarships' 
  | 'internships' 
  | 'fellowships' 
  | 'courses' 
  | 'exchanges'
  | 'others';

export type FundingType = 
  | 'Fully Funded' 
  | 'Partially Funded' 
  | 'Tuition Free' 
  | 'Free Certificate';

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: OpportunityCategory;
  institution: string;
  institutionLogoText?: string;
  institutionLogoUrl?: string;
  bannerImageUrl?: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  city?: string;
  degreeLevel: string[];
  fundingType: FundingType;
  duration: string;
  deadline: string; // ISO format: YYYY-MM-DD
  featured: boolean;
  isUrgent?: boolean;
  status?: 'draft' | 'published';
  bannerTheme?: {
    primaryColor: string;
    accentColor: string;
    badgeText?: string;
  };
  tags: string[];
  summary: string;
  about: string[];
  financialBenefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  howToApply: string[];
  officialLink: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  fundingType: string;
  country: string;
  degreeLevel: string;
}
