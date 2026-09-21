import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://opportunitiesmap.com'),
  title: {
    template: '%s | OpportunitiesMap',
    default: 'OpportunitiesMap | Portal Global de Becas, Pasantías y Fellowships',
  },
  description:
    'Encuentra becas internacionales totalmente financiadas, pasantías científicas, intercambios y cursos online gratuitos con certificado oficial.',
  keywords: [
    'becas internacionales',
    'scholarships 2026',
    'pasantias pagadas',
    'internships',
    'fellowships',
    'estudiar en el extranjero',
    'fully funded scholarships',
  ],
  authors: [{ name: 'OpportunitiesMap' }],
  openGraph: {
    title: 'OpportunitiesMap | Portal Global de Oportunidades Académicas',
    description:
      'Descubre becas, pasantías y programas de liderazgo en todo el mundo con financiamiento total.',
    siteName: 'OpportunitiesMap',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OpportunitiesMap - Portal Global de Oportunidades Académicas',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/icon.png?v=2', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: '/icon-192.png?v=2',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#0D306B" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7056389318202994"
     crossOrigin="anonymous"></script>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
