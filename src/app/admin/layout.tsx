import React from 'react';
import AdminHeader from '../../components/AdminHeader';

export const metadata = {
  title: 'Panel de Administración | OpportunitiesMap',
  description: 'Gestor interno de convocatorias y oportunidades académicas de OpportunitiesMap.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
      <AdminHeader />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
