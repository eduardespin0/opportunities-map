'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import AdminLogoutButton from './AdminLogoutButton';

export default function AdminHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <header className="admin-header">
        <div className="container admin-header-content">
          <Link href="/" className="logo-link">
            <img
              src="/logo-oppmaps.png"
              alt="opportunitiesmap."
              className="logo-img"
            />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/"
              className="nav-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <span>← Volver al sitio público</span>
            </Link>

          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="admin-header">
      <div className="container admin-header-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/admin" className="logo-link">
            <img
              src="/logo-oppmaps.png"
              alt="opportunitiesmap."
              className="logo-img"
            />
          </Link>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'rgba(37, 99, 235, 0.1)',
              color: 'var(--brand-primary)',
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldCheck size={12} />
            Admin
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            target="_blank"
            className="nav-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <span>Ver Web Pública</span>
            <ExternalLink size={13} />
          </Link>


          <AdminLogoutButton />
        </div>
      </div>
    </header>
  );
}
