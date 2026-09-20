'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="newsletter-card">
      <h2 className="newsletter-title">Nunca te pierdas una convocatoria global</h2>
      <p className="newsletter-sub">
        Recibe cada semana un resumen curado con becas de financiamiento total, pasantías y cursos universitarios con certificado que están por cerrar postulaciones.
      </p>

      {submitted ? (
        <div 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '16px 28px', 
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(10px)',
            fontSize: '1.05rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={22} style={{ color: '#a7f3d0' }} />
          <span>¡Suscripción confirmada! Te enviaremos las convocatorias más destacadas a {email}.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Escribe tu correo electrónico..."
            required
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-btn">
            Suscribirme
          </button>
        </form>
      )}

      <div style={{ marginTop: '16px', fontSize: '0.82rem', opacity: 0.85 }}>
        Sin spam ni publicidad intrusiva. Puedes cancelar tu suscripción con un solo clic.
      </div>
    </section>
  );
}
