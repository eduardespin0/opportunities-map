'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenciales incorrectas.');
        setLoading(false);
        return;
      }

      // Successful login -> Redirect
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      console.error('Error durante el login:', err);
      setError('Error al conectar con el servidor. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-card"
      style={{
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <img
          src="/logo-oppmaps.png"
          alt="opportunitiesmap."
          className="logo-img"
          style={{ margin: '0 auto 16px', height: '28px' }}
        />
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 800,
            marginBottom: '6px',
          }}
        >
          Acceso Administrativo
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Inicia sesión para gestionar las convocatorias
        </p>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            marginBottom: '20px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Usuario
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              placeholder="admin"
              style={{ paddingLeft: '38px' }}
              autoComplete="username"
            />
            <User
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
              style={{ paddingLeft: '38px' }}
              autoComplete="current-password"
            />
            <Lock
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.95rem',
            marginTop: '10px',
          }}
        >
          <span>{loading ? 'Iniciando sesión...' : 'Entrar al Panel'}</span>
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <Suspense fallback={<div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>Cargando acceso...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
