import type { MetadataRoute } from 'next';
import { OpportunityStore } from '../lib/opportunity-store';

const BASE_URL = 'https://opportunitiesmap.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const opportunities = await OpportunityStore.getAll();

  const opportunityEntries: MetadataRoute.Sitemap = opportunities.map((opp) => ({
    url: `${BASE_URL}/opportunities/${opp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = [
    'scholarships',
    'internships',
    'fellowships',
    'courses',
    'others',
  ].map((cat) => ({
    url: `${BASE_URL}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/opportunities`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  return [...staticPages, ...categoryEntries, ...opportunityEntries];
}
