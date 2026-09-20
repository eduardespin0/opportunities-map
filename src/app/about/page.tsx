import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Target, Code, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'Acerca de OpportunitiesMap | Nuestra Misión Informativa',
  description: 'Conoce la visión detrás de OpportunitiesMap: democratizar la información sobre becas y programas internacionales.',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 20px 100px', maxWidth: '860px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="hero-tagline">
          <Compass size={16} />
          <span>Nuestra Misión</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
          Acerca de OpportunitiesMap
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Conectando mentes ambiciosas con oportunidades académicas, de investigación y liderazgo en todo el planeta.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section className="content-section">
          <h2 className="content-heading">
            <Target size={22} style={{ color: 'var(--brand-primary)' }} />
            <span>¿Qué es OpportunitiesMap?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            <strong>OpportunitiesMap</strong> es una iniciativa digital independiente concebida para mapear, estructurar y difundir convocatorias oficiales de becas universitarias de pregrado y posgrado, pasantías en laboratorios científicos, estancias de verano y programas de liderazgo internacional.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Millones de dólares en fondos de financiamiento educativo no se aprovechan cada año simplemente porque los estudiantes desconocen su existencia o encuentran la información dispersa en sitios web gubernamentales poco accesibles. Nuestra labor consiste en sintetizar los requisitos, fechas clave y beneficios en un formato transparente y fácil de entender.
          </p>
        </section>

        <section className="content-section">
          <h2 className="content-heading">
            <ShieldCheck size={22} style={{ color: '#ef4444' }} />
            <span>Alcance: Difusión Informativa, No Asesoría</span>
          </h2>
          <div className="disclaimer-banner" style={{ marginBottom: '16px' }}>
            <strong>Compromiso Ético Fundamental:</strong> OpportunitiesMap es estrictamente un canal de difusión e información académica.
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            Es fundamental aclarar a toda nuestra comunidad que:
          </p>
          <ul className="check-list">
            <li className="check-item">
              <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
              <span><strong>No brindamos asesoría personalizada</strong> de postulación ni servicios de consultoría migratoria o visados.</span>
            </li>
            <li className="check-item">
              <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
              <span><strong>No formamos parte de los comités de selección</strong> ni influimos en las decisiones de admisión de ninguna universidad o gobierno.</span>
            </li>
            <li className="check-item">
              <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
              <span><strong>Nunca cobramos tarifas</strong> a los estudiantes por acceder a la información ni solicitamos datos financieros confidenciales.</span>
            </li>
          </ul>
        </section>

        <section className="content-section">
          <h2 className="content-heading">
            <Code size={22} style={{ color: '#8b5cf6' }} />
            <span>Ingeniería y Tecnología detrás del Proyecto</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            OpportunitiesMap está desarrollado como una aplicación de ingeniería de software moderna utilizando <strong>Next.js (App Router)</strong>, <strong>TypeScript</strong> y un sistema de diseño con <strong>CSS nativo modular</strong>, priorizando tiempos de carga instantáneos (SSG), accesibilidad universal y compatibilidad con lectores de pantalla.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Asimismo, incorporamos pipelines asistidos por Inteligencia Artificial para acelerar la ingesta y estructuración de convocatorias públicas, manteniendo siempre la validación y el enlace directo al portal oficial de cada organismo convocante.
          </p>
        </section>
      </div>
    </div>
  );
}
