'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo-link">
              <img
                src="/logo-oppmaps.png"
                alt="opportunitiesmap."
                className="logo-img"
              />
            </Link>
            <p>
              Mapeando oportunidades académicas, científicas y profesionales alrededor del mundo. Convocatorias verificadas, enlaces oficiales y financiamiento total.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>Plataforma 100% informativa e independiente</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Categorías</h4>
            <ul className="footer-links">
              <li><Link href="/opportunities?category=scholarships">Becas Universitarias</Link></li>
              <li><Link href="/opportunities?category=internships">Internships</Link></li>
              <li><Link href="/opportunities?category=fellowships">Fellowships y Liderazgo</Link></li>
              <li><Link href="/opportunities?category=courses">Cursos con Certificado</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Institucional</h4>
            <ul className="footer-links">
              <li><Link href="/about">Acerca de OpportunitiesMap</Link></li>
              <li><Link href="/disclaimer">Descargo de Responsabilidad</Link></li>
              <li><Link href="/privacy">Política de Privacidad</Link></li>
              <li><Link href="/terms">Términos de Uso</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Destinos Populares</h4>
            <ul className="footer-links">
              <li><Link href="/opportunities?country=Spain">Estudiar en España 🇪🇸</Link></li>
              <li><Link href="/opportunities?country=United Kingdom">Estudiar en Reino Unido 🇬🇧</Link></li>
              <li><Link href="/opportunities?country=United States">Estudiar en Estados Unidos 🇺🇸</Link></li>
              <li><Link href="/opportunities?country=Germany">Estudiar en Alemania 🇩🇪</Link></li>
            </ul>
          </div>
        </div>

        <div className="disclaimer-banner" style={{ marginBottom: '24px' }}>
          <strong>Aviso Legal Importante:</strong> OpportunitiesMap es un portal de carácter estrictamente informativo. No tenemos afiliación directa ni cobramos comisión por las convocatorias listadas. No brindamos asesoría migratoria ni tramitamos visas; los postulantes deben verificar siempre los requisitos y postular únicamente en las plataformas oficiales de las instituciones correspondientes.
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} OpportunitiesMap. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Hecho con dedicación académica</span>
            <Link 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
