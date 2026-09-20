import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Descargo de Responsabilidad (Disclaimer) | OpportunitiesMap',
  description: 'Descargo de responsabilidad legal y términos informativos de OpportunitiesMap.',
};

export default function DisclaimerPage() {
  return (
    <div className="container" style={{ padding: '60px 20px 100px', maxWidth: '860px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="hero-tagline" style={{ background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' }}>
          <ShieldAlert size={16} />
          <span>Aviso Legal</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
          Descargo de Responsabilidad Legal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Última actualización: Septiembre de 2026
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <section className="content-section">
          <div className="disclaimer-banner" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertTriangle size={24} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <div>
                <strong>Declaración de Propósito Exclusivamente Informativo:</strong>
                <p style={{ marginTop: '6px' }}>
                  OpportunitiesMap es una plataforma de divulgación y agregación de convocatorias educativas públicas. El objetivo de este proyecto es únicamente <strong>informar sobre la existencia de oportunidades académicas</strong> y facilitar los enlaces oficiales correspondientes, <strong>bajo ninguna circunstancia brindamos asesoría personalizada, tramitación ni gestoría</strong>.
                </p>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
            1. Ausencia de Afiliación con las Instituciones Convocantes
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            OpportunitiesMap no representa, no está afiliada, ni actúa en nombre de ninguna universidad, fundación, agencia gubernamental, embajada ni organismo internacional mencionado en nuestro portal (tales como DAAD, MEXT, Fullbright, Fundación Carolina, Unión Europea, CRG, entre otras). Todas las marcas registradas, nombres de programas y logotipos son propiedad exclusiva de sus respectivos titulares.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
            2. Exactitud y Actualización de la Información
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            Aunque realizamos esfuerzos constantes para recopilar datos fidedignos y actualizados, las fechas de cierre, requisitos de elegibilidad, documentación requerida y dotaciones económicas son determinadas soberanamente por los organismos convocantes y están sujetas a cambios sin previo aviso. Es responsabilidad exclusiva de cada usuario verificar las bases vigentes en el portal oficial de la institución antes de postular.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
            3. Enlaces a Sitios Web de Terceros
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            Nuestro sitio web contiene enlaces que dirigen a portales externos que no son operados ni controlados por OpportunitiesMap. No asumimos responsabilidad alguna por el contenido, políticas de privacidad ni prácticas de dichos sitios de terceros.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
            4. Prevención contra Fraudes y Cobros Indebidos
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            OpportunitiesMap jamás solicitará pagos, comisiones ni transferencias bancarias a los estudiantes a cambio de información sobre becas o supuestos cupos garantizados. La postulación a las becas legítimas se realiza siempre de manera directa y gratuita a través de los canales oficiales de cada institución.
          </p>
        </section>
      </div>
    </div>
  );
}
