import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - var(--header-height) - 200px)',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '6rem',
          fontWeight: 800,
          color: 'var(--brand-primary)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: '16px 0 8px',
        }}
      >
        Página no encontrada
      </h2>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          maxWidth: '460px',
          marginBottom: '32px',
        }}
      >
        La página que buscas no existe o fue movida. Pero no te preocupes, hay
        muchas oportunidades esperándote.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'var(--brand-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'background 0.2s ease',
          }}
        >
          ← Volver al inicio
        </Link>
        <Link
          href="/opportunities"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'border-color 0.2s ease',
          }}
        >
          Explorar oportunidades
        </Link>
      </div>
    </div>
  );
}
