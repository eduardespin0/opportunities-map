import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { OpportunityStore } from '../../../lib/opportunity-store';
import OpportunityCard from '../../../components/OpportunityCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const categoryTitles: Record<string, string> = {
    'scholarships': 'Becas (Scholarships)',
    'internships': 'Internships',
    'fellowships': 'Fellowships y Liderazgo',
    'courses': 'Cursos Online con Certificado',
    'exchanges': 'Intercambios',
    'others': 'Otras Oportunidades'
  };

  const title = categoryTitles[slug];

  if (!title) {
    return {
      title: 'Categoría no encontrada | OpportunitiesMap',
    };
  }

  return {
    title: `${title} | OpportunitiesMap`,
    description: `Explora todas las oportunidades disponibles en la categoría de ${title}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const categoryTitles: Record<string, string> = {
    'scholarships': 'Becas (Scholarships)',
    'internships': 'Internships',
    'fellowships': 'Fellowships y Liderazgo',
    'courses': 'Cursos Online con Certificado',
    'exchanges': 'Intercambios',
    'others': 'Otras Oportunidades'
  };

  const title = categoryTitles[slug];

  if (!title) {
    notFound();
  }

  const allOpportunities = await OpportunityStore.getAll();
  const categoryOpportunities = allOpportunities.filter(opp => opp.category === slug && opp.status === 'published');

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          {title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
          Explora todas las oportunidades disponibles en la categoría de {title}.
        </p>
      </div>

      {categoryOpportunities.length > 0 ? (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', 
            gap: '24px' 
          }}
        >
          {categoryOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: 'var(--bg-surface)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px dashed var(--border-subtle)' 
          }}
        >
          <GraduationCap size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
            No hay convocatorias disponibles
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Actualmente no tenemos oportunidades activas en esta categoría.
          </p>
        </div>
      )}
    </div>
  );
}
