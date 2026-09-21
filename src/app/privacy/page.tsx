import React from 'react';
import { Lock } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad | OpportunitiesMap',
  description: 'Política de privacidad y protección de datos personales de OpportunitiesMap.',
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '60px 20px 100px', maxWidth: '860px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="hero-tagline">
          <Lock size={16} />
          <span>Privacidad y Protección</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
          Política de Privacidad
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Última actualización: Septiembre de 2026
        </p>
      </div>

      <div className="content-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <p>
          En <strong>OpportunitiesMap</strong> (accesible desde nuestro portal web), la privacidad de nuestros visitantes es de suma importancia. Este documento describe los tipos de información que son recopilados y registrados por OpportunitiesMap y cómo los utilizamos.
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          1. Archivos de Registro (Log Files)
        </h3>
        <p>
          OpportunitiesMap sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), fecha y hora, páginas de referencia/salida y posiblemente la cantidad de clics. Esto no está vinculado a ninguna información que sea personalmente identificable.
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          2. Cookies y Balizas Web (Cookies & Web Beacons)
        </h3>
        <p>
          Como cualquier otro sitio web, OpportunitiesMap utiliza &apos;cookies&apos;. Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes (como la elección de modo oscuro o claro) y las páginas del sitio web a las que el visitante accedió o visitó.
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          3. Proveedores Externos y Anuncios (Google AdSense)
        </h3>
        <p>
          En OpportunitiesMap utilizamos Google AdSense para la monetización del sitio. Los proveedores de terceros, incluido Google, utilizan cookies para publicar anuncios basándose en las visitas anteriores que el usuario haya hecho a nuestro sitio web u otros sitios web de Internet.
        </p>
        <p>
          El uso de cookies de publicidad permite a Google y a sus socios mostrar anuncios a nuestros usuarios basándose en sus visitas a nuestros sitios y/o a otros sitios de Internet. 
        </p>
        <p>
          Usted (el usuario) puede inhabilitar la publicidad personalizada. Para ello, deberá acceder a la <strong>Configuración de anuncios de Google</strong> en: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>https://www.google.com/settings/ads</a>. (También puede inhabilitar el uso de cookies para publicidad personalizada por parte de proveedores de terceros accediendo a www.aboutads.info).
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          4. Boletín Electrónico (Newsletter)
        </h3>
        <p>
          Si decide voluntariamente suscribirse a nuestro boletín semanal de becas, únicamente utilizaremos su dirección de correo electrónico para remitirle alertas sobre convocatorias de su interés. Nunca venderemos, alquilaremos ni compartiremos su dirección de correo electrónico con terceros con fines comerciales. Puede cancelar su suscripción en cualquier momento.
        </p>
      </div>
    </div>
  );
}
