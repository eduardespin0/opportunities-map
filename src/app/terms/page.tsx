import React from 'react';
import { FileCheck } from 'lucide-react';

export const metadata = {
  title: 'Términos de Uso | OpportunitiesMap',
  description: 'Términos y condiciones de uso de la plataforma OpportunitiesMap.',
};

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '60px 20px 100px', maxWidth: '860px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="hero-tagline">
          <FileCheck size={16} />
          <span>Términos y Condiciones</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
          Términos de Servicio
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Última actualización: Septiembre de 2026
        </p>
      </div>

      <div className="content-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          1. Aceptación de los Términos
        </h3>
        <p>
          Al acceder y utilizar <strong>OpportunitiesMap</strong>, usted acepta estar sujeto a estos términos y condiciones de servicio, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          2. Licencia de Uso
        </h3>
        <p>
          Se concede permiso para visualizar y compartir de forma no comercial el material informativo contenido en OpportunitiesMap. Este portal es una iniciativa académica de código abierto diseñada para fomentar el acceso a la educación superior y oportunidades de desarrollo.
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          3. Exactitud de los Materiales
        </h3>
        <p>
          Los materiales que aparecen en el sitio web de OpportunitiesMap pueden incluir errores técnicos, tipográficos o de fechas. OpportunitiesMap no garantiza que ninguno de los materiales en su sitio web sea 100% preciso, completo o actual, ya que las universidades y gobiernos pueden modificar sus convocatorias en cualquier momento.
        </p>
      </div>
    </div>
  );
}
