'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  X, 
  GraduationCap, 
  Globe2, 
  Building2, 
  SlidersHorizontal,
  Search,
  Loader2
} from 'lucide-react';
import { Opportunity } from '../../lib/types';
import OpportunityCard from '../../components/OpportunityCard';

function OpportunitiesExplorer() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialCountry = searchParams.get('country') || 'all';

  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllOpportunities(data.filter((opp: Opportunity) => opp.status !== 'draft'));
        }
      })
      .catch((err) => console.error('Error cargando convocatorias de Firestore:', err))
      .finally(() => setLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFunding, setSelectedFunding] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedDegree, setSelectedDegree] = useState('all');

  // Extract unique countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(allOpportunities.map((o) => o.country)));
    return list.sort();
  }, [allOpportunities]);

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter((opp) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          opp.title.toLowerCase().includes(q) ||
          opp.institution.toLowerCase().includes(q) ||
          opp.country.toLowerCase().includes(q) ||
          opp.tags.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'all' && opp.category !== selectedCategory) {
        return false;
      }

      // Funding
      if (selectedFunding !== 'all' && opp.fundingType !== selectedFunding) {
        return false;
      }

      // Country
      if (selectedCountry !== 'all' && opp.country.toLowerCase() !== selectedCountry.toLowerCase()) {
        return false;
      }

      // Degree
      if (selectedDegree !== 'all' && !opp.degreeLevel.includes(selectedDegree)) {
        return false;
      }

      return true;
    });
  }, [allOpportunities, searchQuery, selectedCategory, selectedFunding, selectedCountry, selectedDegree]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFunding('all');
    setSelectedCountry('all');
    setSelectedDegree('all');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategory !== 'all' || 
    selectedFunding !== 'all' || 
    selectedCountry !== 'all' || 
    selectedDegree !== 'all';

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          Explorar Convocatorias Globales
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
          Filtra entre becas universitarias, estancias científicas y cursos certificados de acuerdo a tus metas académicas.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div 
        style={{ 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '24px', 
          marginBottom: '36px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Search Input Row */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por palabra clave, institución, título..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Dropdown Filters Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '14px',
            alignItems: 'center'
          }}
        >
          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              <option value="all">Todas las categorías</option>
              <option value="scholarships">Becas (Scholarships)</option>
              <option value="internships">Internships</option>
              <option value="fellowships">Fellowships y Liderazgo</option>
              <option value="courses">Cursos con Certificado</option>
              <option value="others">Otros</option>
            </select>
          </div>

          {/* Funding */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Financiamiento
            </label>
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              <option value="all">Todos los financiamientos</option>
              <option value="Fully Funded">Totalmente Financiada (Fully Funded)</option>
              <option value="Partially Funded">Parcialmente Financiada</option>
              <option value="Free Certificate">Certificado Gratuito</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              País de Destino
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              <option value="all">Todos los países</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Degree Level */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Nivel de Estudios
            </label>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              <option value="all">Todos los niveles</option>
              <option value="Undergraduate">Pregrado / Licenciatura</option>
              <option value="Master">Maestría (Master)</option>
              <option value="PhD">Doctorado (PhD)</option>
              <option value="All Levels">Abierto a Todo Público</option>
            </select>
          </div>
        </div>

        {/* Status Bar */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginTop: '20px', 
            paddingTop: '16px', 
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div>
            Mostrando <strong>{filteredOpportunities.length}</strong> {filteredOpportunities.length === 1 ? 'convocatoria' : 'convocatorias'}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <X size={14} />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Loader2 size={36} className="spinner" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p>Cargando convocatorias desde Firebase...</p>
        </div>
      ) : filteredOpportunities.length > 0 ? (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px' 
          }}
        >
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: 'var(--bg-surface)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px dashed var(--border-subtle)' 
          }}
        >
          <GraduationCap size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
            No se encontraron convocatorias con estos criterios
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Prueba a eliminar algunos filtros o buscar términos más generales.
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Restablecer todos los filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px', textAlign: 'center' }}>Cargando catálogo de convocatorias...</div>}>
      <OpportunitiesExplorer />
    </Suspense>
  );
}
