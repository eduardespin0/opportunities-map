'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, Printer } from 'lucide-react';

interface ShareBarProps {
  title: string;
  url?: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Mira esta oportunidad en OpportunitiesMap: ${title}\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Oportunidad académica en @OpportunitiesMap: ${title}\n`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={shareWhatsApp}
        className="btn-icon"
        title="Compartir en WhatsApp"
        aria-label="Compartir en WhatsApp"
      >
        <span style={{ fontSize: '1rem', fontWeight: 700 }}>💬</span>
      </button>

      <button
        onClick={shareTwitter}
        className="btn-icon"
        title="Compartir en X / Twitter"
        aria-label="Compartir en X"
      >
        <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>𝕏</span>
      </button>

      <button
        onClick={shareLinkedIn}
        className="btn-icon"
        title="Compartir en LinkedIn"
        aria-label="Compartir en LinkedIn"
      >
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0077b5' }}>in</span>
      </button>

      <button
        onClick={handleCopy}
        className="btn-icon"
        title={copied ? '¡Enlace copiado!' : 'Copiar enlace'}
        aria-label="Copiar enlace"
      >
        {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
      </button>

      <button
        onClick={handlePrint}
        className="btn-icon"
        title="Imprimir o Guardar en PDF"
        aria-label="Imprimir"
      >
        <Printer size={16} />
      </button>
    </div>
  );
}
