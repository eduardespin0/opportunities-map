import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { OpportunityStore } from '../lib/opportunity-store';
import CategoryColumn from '../components/CategoryColumn';
import UrgentTicker from '../components/UrgentTicker';
import OpportunityCard from '../components/OpportunityCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const allOpps = (await OpportunityStore.getAll()).filter((opp) => opp.status !== 'draft');

  // Category data
  const featuredScholarship = allOpps.find((o) => o.category === 'scholarships' && o.featured) || allOpps.find((o) => o.category === 'scholarships');
  const recentScholarships = allOpps.filter((o) => o.category === 'scholarships' && o.id !== featuredScholarship?.id).slice(0, 3);

  const featuredInternship = allOpps.find((o) => o.category === 'internships' && o.featured) || allOpps.find((o) => o.category === 'internships');
  const recentInternships = allOpps.filter((o) => o.category === 'internships' && o.id !== featuredInternship?.id).slice(0, 3);

  const featuredFellowship = allOpps.find((o) => o.category === 'fellowships' && o.featured) || allOpps.find((o) => o.category === 'fellowships');
  const recentFellowships = allOpps.filter((o) => o.category === 'fellowships' && o.id !== featuredFellowship?.id).slice(0, 3);

  const onlineCourses = allOpps.filter((o) => o.category === 'courses');
  const otherOpportunities = allOpps.filter((o) => o.category === 'others');

  return (
    <div>
      {/* Barra de Cierra Pronto con movimiento vertical continuo */}
      <UrgentTicker opportunities={allOpps} />



      <main className="container">
        {/* Multi-column Grid Section (Inspirado en el esquema de 3 columnas de OpportunitiesPedia) */}
        <div className="category-columns-grid">
          {/* Columna 1: Scholarships */}
          <CategoryColumn
            title="Becas"
            category="scholarships"
            featuredOpportunity={featuredScholarship}
            secondaryOpportunities={recentScholarships}
          />

          {/* Columna 2: Internships */}
          <CategoryColumn
            title="Internships"
            category="internships"
            featuredOpportunity={featuredInternship}
            secondaryOpportunities={recentInternships}
          />

          {/* Columna 3: Fellowships */}
          <CategoryColumn
            title="Fellowships y Liderazgo"
            category="fellowships"
            featuredOpportunity={featuredFellowship}
            secondaryOpportunities={recentFellowships}
          />
        </div>

        {/* Sección: Últimas Convocatorias Publicadas (con diseño de Cursos Online) */}
        <section className="courses-section" style={{ marginTop: '48px', marginBottom: '48px' }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>Últimas Convocatorias Publicadas</span>
              </h2>
            </div>
            <Link href="/opportunities" className="column-see-all">
              <span>Ver todas</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="courses-grid">
            {allOpps.slice(0, 3).map((opp) => {
              const bgGradient = opp.bannerTheme
                ? `linear-gradient(135deg, ${opp.bannerTheme.primaryColor} 0%, #15241e 100%)`
                : 'linear-gradient(135deg, var(--brand-primary) 0%, #15241e 100%)';

              const bannerStyle: React.CSSProperties = opp.bannerImageUrl
                ? { 
                    backgroundImage: `url(${opp.bannerImageUrl})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    position: 'relative'
                  }
                : { background: bgGradient, position: 'relative' };

              return (
                <Link
                  key={opp.id}
                  href={`/opportunities/${opp.slug}`}
                  className="course-card"
                  style={bannerStyle}
                >
                  <div className="card-banner-top" style={{ position: 'relative', zIndex: 1 }}>
                    <span className="banner-institution-badge">
                      {opp.institutionLogoText || opp.institution}
                    </span>
                    <span 
                      className="badge-funded" 
                      style={{ 
                        background: opp.fundingType === 'Fully Funded' ? '#10b981' : 'var(--bg-elevated)', 
                        color: opp.fundingType === 'Fully Funded' ? '#ffffff' : 'var(--text-primary)', 
                        border: 'none' 
                      }}
                    >
                      {opp.fundingType}
                    </span>
                  </div>

                  <div className="course-card-content" style={{ position: 'relative', zIndex: 1 }}>
                    <h3 className="course-card-title">
                      {opp.title}
                    </h3>
                    <p className="course-card-meta">
                      <span>{opp.country}</span>
                      <span>•</span>
                      <span style={{ textTransform: 'capitalize' }}>
                        {opp.category === 'scholarships' ? 'Beca' : 
                         opp.category === 'internships' ? 'Pasantía' : 
                         opp.category === 'fellowships' ? 'Fellowship' : 'Curso'}
                      </span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Sección Especial: Online Courses (Stanford, UNICEF, OpenLearn) */}
        <section className="courses-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>Cursos Gratuitos con Certificación Oficial</span>
              </h2>
            </div>
            <Link href="/category/courses" className="column-see-all">
              <span>Ver catálogo completo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="courses-grid">
            {onlineCourses.slice(0, 3).map((course) => {
              const bgGradient = course.bannerTheme
                ? `linear-gradient(135deg, ${course.bannerTheme.primaryColor} 0%, #15241e 100%)`
                : 'linear-gradient(135deg, #0284c7 0%, #15241e 100%)';

              const bannerStyle: React.CSSProperties = course.bannerImageUrl
                ? { 
                    backgroundImage: `url(${course.bannerImageUrl})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    position: 'relative'
                  }
                : { background: bgGradient, position: 'relative' };

              return (
                <Link
                  key={course.id}
                  href={`/opportunities/${course.slug}`}
                  className="course-card"
                  style={bannerStyle}
                >
                  <div className="card-banner-top" style={{ position: 'relative', zIndex: 1 }}>
                    <span className="banner-institution-badge">
                      {course.institutionLogoText || course.institution}
                    </span>
                    <span className="badge-funded" style={{ background: '#10b981', color: '#ffffff', border: 'none' }}>
                      CERTIFICADO GRATIS
                    </span>
                  </div>

                  <div className="course-card-content" style={{ position: 'relative', zIndex: 1 }}>
                    <h3 className="course-card-title">
                      {course.title}
                    </h3>
                    <p className="course-card-meta">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>Modalidad 100% Online</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Sección Especial: Otros */}
        <section className="courses-section" style={{ marginTop: '48px', marginBottom: '48px' }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>Otras Oportunidades</span>
              </h2>
            </div>
            <Link href="/category/others" className="column-see-all">
              <span>Ver catálogo completo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="courses-grid">
            {otherOpportunities.slice(0, 3).map((opp) => {
              const bgGradient = opp.bannerTheme
                ? `linear-gradient(135deg, ${opp.bannerTheme.primaryColor} 0%, #15241e 100%)`
                : 'linear-gradient(135deg, var(--brand-primary) 0%, #15241e 100%)';

              const bannerStyle: React.CSSProperties = opp.bannerImageUrl
                ? { 
                    backgroundImage: `url(${opp.bannerImageUrl})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    position: 'relative'
                  }
                : { background: bgGradient, position: 'relative' };

              return (
                <Link
                  key={opp.id}
                  href={`/opportunities/${opp.slug}`}
                  className="course-card"
                  style={bannerStyle}
                >
                  <div className="card-banner-top" style={{ position: 'relative', zIndex: 1 }}>
                    <span className="banner-institution-badge">
                      {opp.institutionLogoText || opp.institution}
                    </span>
                    <span 
                      className="badge-funded" 
                      style={{ 
                        background: opp.fundingType === 'Fully Funded' ? '#10b981' : 'var(--bg-elevated)', 
                        color: opp.fundingType === 'Fully Funded' ? '#ffffff' : 'var(--text-primary)', 
                        border: 'none' 
                      }}
                    >
                      {opp.fundingType}
                    </span>
                  </div>

                  <div className="course-card-content" style={{ position: 'relative', zIndex: 1 }}>
                    <h3 className="course-card-title">
                      {opp.title}
                    </h3>
                    <p className="course-card-meta">
                      <span>{opp.country}</span>
                      <span>•</span>
                      <span>Otros</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
