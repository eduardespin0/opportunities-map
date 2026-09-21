import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Share2,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { OpportunityStore } from '../../../lib/opportunity-store';
import SpecsBox from '../../../components/SpecsBox';
import ShareBar from '../../../components/ShareBar';
import OpportunityCard from '../../../components/OpportunityCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opp = await OpportunityStore.getBySlugOrId(slug);

  if (!opp) {
    return {
      title: 'Convocatoria no encontrada | OpportunitiesMap',
    };
  }

  return {
    title: `${opp.title}`,
    description: opp.summary,
    openGraph: {
      title: `${opp.title} | OpportunitiesMap`,
      description: opp.summary,
      type: 'article',
      publishedTime: opp.publishedAt,
    },
  };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const opp = await OpportunityStore.getBySlugOrId(slug);

  if (!opp) {
    notFound();
  }

  const allOpps = await OpportunityStore.getAll();
  const related = allOpps
    .filter((o) => o.id !== opp.id && (o.category === opp.category || o.fundingType === 'Fully Funded'))
    .slice(0, 3);

  const formattedDate = new Date(opp.publishedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedDeadline = new Date(opp.deadline).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opp.title,
    description: opp.summary,
    datePublished: opp.publishedAt,
    dateModified: opp.updatedAt || opp.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'OpportunitiesMap',
      url: 'https://opportunitiesmap.com',
    },
    about: {
      '@type': 'EducationalOccupationalProgram',
      name: opp.shortTitle,
      provider: {
        '@type': 'EducationalOrganization',
        name: opp.institution,
      },
      educationalCredentialAwarded: opp.degreeLevel.join(', '),
    },
  };

  return (
    <div>
      {/* Script JSON-LD para Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Reading Bar (Inspirado en la 3ª captura de OpportunitiesPedia) */}
      <div className="sticky-reading-bar">
        <div className="container reading-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <Link href="/" className="btn-icon" title="Volver al inicio" aria-label="Volver">
              <ArrowLeft size={16} />
            </Link>
            <div className="reading-title">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', marginRight: '6px', fontWeight: 700 }}>
                LEYENDO:
              </span>
              <span>{opp.title}</span>
            </div>
          </div>

          <div className="reading-actions">
            <ShareBar title={opp.title} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          {/* Main Content Area */}
          <article className="detail-main">
            {/* Header Card */}
            <div className="detail-header-card">
              <div className="detail-badges">
                <span className="badge-funded">{opp.fundingType}</span>
                <span className="badge-funded" style={{ background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', borderColor: 'transparent' }}>
                  {opp.countryFlag} {opp.country}
                </span>
                {opp.isUrgent && <span className="badge-urgent">Cierra Pronto</span>}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Publicado: {formattedDate}
                </span>
              </div>

              <h1 className="detail-title">{opp.title}</h1>

              {/* Imagen de Portada de la Convocatoria */}
              {opp.bannerImageUrl && (
                <div className="detail-cover-wrapper">
                  <img
                    src={opp.bannerImageUrl}
                    alt={`Portada oficial: ${opp.title}`}
                    className="detail-cover-img"
                  />
                </div>
              )}

              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {opp.summary}
              </p>

              {/* Ficha Técnica de Datos Rápidos (Specs Box) */}
              <SpecsBox opportunity={opp} />
            </div>

            {/* About the Program */}
            <section className="content-section">
              <h2 className="content-heading">
                <Info size={22} style={{ color: 'var(--brand-primary)' }} />
                <span>Sobre la Convocatoria ({opp.institution})</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.7 }}>
                {opp.about.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Financial Benefits */}
            <section className="content-section">
              <h2 className="content-heading">
                <Sparkles size={22} style={{ color: '#10b981' }} />
                <span>Beneficios y Cobertura Financiera</span>
              </h2>
              <ul className="check-list">
                {opp.financialBenefits.map((benefit, idx) => (
                  <li key={idx} className="check-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Eligibility Criteria */}
            <section className="content-section">
              <h2 className="content-heading">
                <ShieldCheck size={22} style={{ color: '#f59e0b' }} />
                <span>Requisitos de Elegibilidad</span>
              </h2>
              <ul className="check-list">
                {opp.eligibility.map((item, idx) => (
                  <li key={idx} className="check-item">
                    <CheckCircle2 size={18} className="check-icon" style={{ color: '#f59e0b' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Required Documents */}
            <section className="content-section">
              <h2 className="content-heading">
                <FileText size={22} style={{ color: '#8b5cf6' }} />
                <span>Documentos Necesarios</span>
              </h2>
              <ul className="check-list">
                {opp.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="check-item">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-primary)', marginTop: '8px', flexShrink: 0 }} />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Step-by-Step How to Apply */}
            <section className="content-section">
              <h2 className="content-heading">
                <span>¿Cómo Postular? (Paso a Paso)</span>
              </h2>
              <div className="steps-list">
                {opp.howToApply.map((step, idx) => (
                  <div key={idx} className="step-item">
                    <div className="step-number">{idx + 1}</div>
                    <div className="step-text">{step}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Call to Action: Official Link */}
            <section className="cta-box">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>
                Postulación Oficial en {opp.institution}
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
                Recuerda que OpportunitiesMap no recibe solicitudes ni cobra comisiones. Toda la postulación se realiza de forma directa y transparente en el sitio web de la institución.
              </p>
              <a
                href={opp.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '14px 32px', fontSize: '1.05rem', display: 'inline-flex' }}
              >
                <span>Ir al Portal Oficial de Postulación</span>
                <ExternalLink size={18} />
              </a>
            </section>

            {/* Legal Disclaimer Box */}
            <div className="disclaimer-banner">
              <strong>Descargo de responsabilidad de OpportunitiesMap:</strong> Este artículo ha sido preparado con fines meramente informativos y de difusión educativa. OpportunitiesMap no forma parte de los comités de selección de {opp.institution}. Las fechas, montos y requerimientos son fijados por el organismo emisor y pueden actualizarse; te recomendamos verificar siempre las bases completas en el enlace oficial.
            </div>
          </article>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            {/* Countdown / Summary Card */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Resumen de la Convocatoria</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} style={{ color: 'var(--brand-primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FECHA LÍMITE</div>
                    <div style={{ fontWeight: 700 }}>{formattedDeadline}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} style={{ color: 'var(--brand-primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DURACIÓN</div>
                    <div style={{ fontWeight: 700 }}>{opp.duration}</div>
                  </div>
                </div>

                <a
                  href={opp.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <span>Postular Ahora</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>


            {/* Related Opportunities (Crucial for pageviews & SEO) */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Oportunidades Relacionadas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {related.map((relOpp) => (
                  <OpportunityCard key={relOpp.id} opportunity={relOpp} compact />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
