'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Database,
  GraduationCap,
  Image as ImageIcon
} from 'lucide-react';
import { Opportunity } from '../../lib/types';

export default function AdminDashboardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Error cargando oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente:\n"${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
      } else {
        alert('Error al eliminar la convocatoria.');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error de conexión al intentar eliminar.');
    } finally {
      setDeletingId(null);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = opportunities.length;
    const published = opportunities.filter((o) => o.status !== 'draft').length;
    const drafts = opportunities.filter((o) => o.status === 'draft').length;
    const urgent = opportunities.filter((o) => o.isUrgent).length;
    return { total, published, drafts, urgent };
  }, [opportunities]);

  // Filtered list
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchInst = opp.institution.toLowerCase().includes(q);
        const matchCountry = opp.country.toLowerCase().includes(q);
        if (!matchTitle && !matchInst && !matchCountry) return false;
      }

      if (selectedCategory !== 'all' && opp.category !== selectedCategory) {
        return false;
      }

      if (selectedStatus !== 'all') {
        const currentStatus = opp.status || 'published';
        if (currentStatus !== selectedStatus) return false;
      }

      return true;
    });
  }, [opportunities, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="admin-container">
      {/* Top Banner & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '6px',
            }}
          >
            Gestor de Convocatorias
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Crea, edita y organiza las oportunidades académicas públicas
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin/opportunities/new" className="btn-primary" style={{ padding: '10px 18px' }}>
            <Plus size={18} />
            <span>Nueva Convocatoria</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.12)', color: 'var(--brand-primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{stats.total}</div>
            <div className="admin-stat-label">Total Convocatorias</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{stats.published}</div>
            <div className="admin-stat-label">Publicadas (Activas)</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{stats.drafts}</div>
            <div className="admin-stat-label">Borradores</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{stats.urgent}</div>
            <div className="admin-stat-label">Cierran Pronto</div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        {/* Search & Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, institución o país..."
              className="form-input"
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.88rem' }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
              style={{ height: '40px', fontSize: '0.88rem', padding: '0 12px' }}
            >
              <option value="all">Todas las Categorías</option>
              <option value="scholarships">Becas (Scholarships)</option>
              <option value="internships">Internships</option>
              <option value="fellowships">Fellowships y Liderazgo</option>
              <option value="courses">Cursos Online</option>
              <option value="others">Otras Oportunidades</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ height: '40px', fontSize: '0.88rem', padding: '0 12px' }}
            >
              <option value="all">Todos los Estados</option>
              <option value="published">Solo Publicadas</option>
              <option value="draft">Solo Borradores</option>
            </select>
          </div>
        </div>

        {/* Opportunities Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            Cargando convocatorias...
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <GraduationCap size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              No se encontraron convocatorias
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
              {searchQuery ? 'Prueba ajustando los filtros de búsqueda.' : 'Aún no has creado ninguna convocatoria.'}
            </p>
            <Link href="/admin/opportunities/new" className="btn-primary" style={{ padding: '8px 16px', display: 'inline-flex' }}>
              <Plus size={16} />
              <span>Crear la primera</span>
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Portada</th>
                  <th>Convocatoria / Institución</th>
                  <th>Categoría</th>
                  <th>País</th>
                  <th>Cierre</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opp) => {
                  const isDraft = opp.status === 'draft';
                  return (
                    <tr key={opp.id}>
                      <td>
                        {opp.bannerImageUrl ? (
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <img
                              src={opp.bannerImageUrl}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '6px',
                              background: 'var(--bg-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div 
                          style={{ 
                            fontWeight: 700, 
                            color: 'var(--text-primary)', 
                            marginBottom: '3px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={opp.title}
                        >
                          {opp.title}
                        </div>
                        <div 
                          style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-muted)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={opp.institution}
                        >
                          {opp.institution}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {opp.category}
                        </span>
                      </td>
                      <td>
                        <span>{opp.countryFlag} {opp.country}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{opp.deadline}</span>
                      </td>
                      <td>
                        {isDraft ? (
                          <span className="badge-status-draft">Borrador</span>
                        ) : (
                          <span className="badge-status-published">Publicada</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Link
                            href={`/opportunities/${opp.slug}`}
                            target="_blank"
                            className="btn-icon"
                            title="Ver convocatoria pública"
                            aria-label="Ver pública"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <Link
                            href={`/admin/opportunities/${opp.id}/edit`}
                            className="btn-icon"
                            title="Editar convocatoria"
                            aria-label="Editar"
                          >
                            <Edit3 size={15} />
                          </Link>

                          <button
                            onClick={() => handleDelete(opp.id, opp.title)}
                            disabled={deletingId === opp.id}
                            className="btn-icon"
                            title="Eliminar convocatoria"
                            aria-label="Eliminar"
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
