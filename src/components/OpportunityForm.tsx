'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Opportunity, OpportunityCategory, FundingType } from '../lib/types';

interface OpportunityFormProps {
  initialData?: Partial<Opportunity>;
  isEditing?: boolean;
}

export default function OpportunityForm({ initialData, isEditing = false }: OpportunityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [shortTitle, setShortTitle] = useState(initialData?.shortTitle || '');
  const [category, setCategory] = useState<OpportunityCategory>(initialData?.category || 'scholarships');
  const [institution, setInstitution] = useState(initialData?.institution || '');
  const [institutionLogoText, setInstitutionLogoText] = useState(initialData?.institutionLogoText || '');
  const [bannerImageUrl, setBannerImageUrl] = useState(initialData?.bannerImageUrl || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [countryCode, setCountryCode] = useState(initialData?.countryCode || '');
  const [countryFlag, setCountryFlag] = useState(initialData?.countryFlag || '🌍');
  const [city, setCity] = useState(initialData?.city || '');
  const [fundingType, setFundingType] = useState<FundingType>(initialData?.fundingType || 'Fully Funded');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [isUrgent, setIsUrgent] = useState(Boolean(initialData?.isUrgent));
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published');
  const [officialLink, setOfficialLink] = useState(initialData?.officialLink || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');

  // Degree levels (checkboxes)
  const availableDegrees = ['Undergraduate', 'Master', 'PhD', 'Postdoc', 'High School', 'Professional'];
  const [degreeLevels, setDegreeLevels] = useState<string[]>(initialData?.degreeLevel || ['Undergraduate', 'Master']);

  // Dynamic lists
  const [aboutParagraphs, setAboutParagraphs] = useState<string[]>(
    initialData?.about && initialData.about.length > 0 ? initialData.about : ['']
  );
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.financialBenefits && initialData.financialBenefits.length > 0 ? initialData.financialBenefits : ['']
  );
  const [eligibilityList, setEligibilityList] = useState<string[]>(
    initialData?.eligibility && initialData.eligibility.length > 0 ? initialData.eligibility : ['']
  );
  const [documentsList, setDocumentsList] = useState<string[]>(
    initialData?.requiredDocuments && initialData.requiredDocuments.length > 0 ? initialData.requiredDocuments : ['']
  );
  const [stepsList, setStepsList] = useState<string[]>(
    initialData?.howToApply && initialData.howToApply.length > 0 ? initialData.howToApply : ['']
  );

  // Toggle degree level
  const handleToggleDegree = (degree: string) => {
    setDegreeLevels((prev) =>
      prev.includes(degree) ? prev.filter((d) => d !== degree) : [...prev, degree]
    );
  };

  // Generic helpers for dynamic lists
  const updateListItem = (list: string[], setList: (val: string[]) => void, index: number, value: string) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const addListItem = (list: string[], setList: (val: string[]) => void) => {
    setList([...list, '']);
  };

  const removeListItem = (list: string[], setList: (val: string[]) => void, index: number) => {
    if (list.length === 1) {
      setList(['']);
      return;
    }
    setList(list.filter((_, i) => i !== index));
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al subir la imagen.');
        return;
      }

      setBannerImageUrl(data.url);
    } catch (uploadErr) {
      console.error('Error uploading image:', uploadErr);
      setError('Error al conectar con el servicio de subida.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!title.trim() || !institution.trim() || !country.trim() || !deadline) {
      setError('Por favor completa todos los campos requeridos (*).');
      setLoading(false);
      return;
    }

    const payload = {
      title: title.trim(),
      shortTitle: shortTitle.trim() || title.trim(),
      category,
      institution: institution.trim(),
      institutionLogoText: institutionLogoText.trim() || institution.slice(0, 3).toUpperCase(),
      bannerImageUrl: bannerImageUrl.trim(),
      country: country.trim(),
      countryCode: countryCode.trim() || 'GL',
      countryFlag: countryFlag.trim() || '🌍',
      city: city.trim(),
      fundingType,
      degreeLevel: degreeLevels.length > 0 ? degreeLevels : ['All Levels'],
      duration: duration.trim() || 'No especificada',
      deadline,
      featured,
      isUrgent,
      status,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      summary: summary.trim(),
      about: aboutParagraphs.map((p) => p.trim()).filter(Boolean),
      financialBenefits: benefits.map((b) => b.trim()).filter(Boolean),
      eligibility: eligibilityList.map((e) => e.trim()).filter(Boolean),
      requiredDocuments: documentsList.map((d) => d.trim()).filter(Boolean),
      howToApply: stepsList.map((s) => s.trim()).filter(Boolean),
      officialLink: officialLink.trim(),
    };

    try {
      const url = isEditing
        ? `/api/opportunities/${initialData?.id}`
        : '/api/opportunities';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al guardar la convocatoria.');
        setLoading(false);
        return;
      }

      setSuccess('¡Convocatoria guardada exitosamente!');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 800);
    } catch (saveErr) {
      console.error('Error saving opportunity:', saveErr);
      setError('Error al comunicarse con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-icon"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', width: 'auto' }}
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800 }}>
          {isEditing ? 'Editar Convocatoria' : 'Nueva Convocatoria'}
        </h1>

        <div style={{ width: '80px' }} />
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
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            1. Información Principal
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Título Oficial de la Convocatoria *
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Beca Chevening 2027 en el Reino Unido (Fully Funded)"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="shortTitle">
                Nombre Corto / Subtítulo
              </label>
              <input
                id="shortTitle"
                type="text"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                placeholder="Ej: Chevening UK Master Scholarship"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Categoría *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="form-select"
              >
                <option value="scholarships">Scholarships (Becas)</option>
                <option value="internships">Internships</option>
                <option value="fellowships">Fellowships y Liderazgo</option>
                <option value="courses">Cursos con Certificado</option>
                <option value="exchanges">Exchanges (Intercambios)</option>
                <option value="others">Others (Otros)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="institution">
                Institución Convocante *
              </label>
              <input
                id="institution"
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Ej: University of Oxford"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="institutionLogoText">
                Siglas de la Institución
              </label>
              <input
                id="institutionLogoText"
                type="text"
                value={institutionLogoText}
                onChange={(e) => setInstitutionLogoText(e.target.value)}
                placeholder="Ej: OXF"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cover Image */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            2. Imagen de Portada de la Convocatoria
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '18px' }}>
            Esta imagen se mostrará como banner de cabecera entre el título y el resumen.
          </p>

          <div className="form-group">
            <label className="form-label">Subir Archivo de Imagen</label>
            <div className="image-upload-dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                style={{ display: 'none' }}
                id="image-file-input"
                disabled={uploadingImage}
              />
              <label htmlFor="image-file-input" style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}>
                <Upload size={32} style={{ color: 'var(--brand-primary)', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {uploadingImage ? 'Subiendo imagen...' : 'Haz clic para seleccionar o arrastra una imagen'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  PNG, JPG, WEBP recomendada (máx 5MB)
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bannerImageUrl">
              O ingresa la URL directa de la imagen
            </label>
            <input
              id="bannerImageUrl"
              type="text"
              value={bannerImageUrl}
              onChange={(e) => setBannerImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg o /uploads/..."
              className="form-input"
            />
          </div>

          {bannerImageUrl && (
            <div className="image-upload-preview">
              <img src={bannerImageUrl} alt="Vista previa de portada" />
              <button
                type="button"
                onClick={() => setBannerImageUrl('')}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Eliminar imagen"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Location & Financial Details */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            3. Ubicación y Finanzas
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="country">
                País de Destino *
              </label>
              <input
                id="country"
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ej: Reino Unido"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="countryFlag">
                Emoji Bandera
              </label>
              <input
                id="countryFlag"
                type="text"
                value={countryFlag}
                onChange={(e) => setCountryFlag(e.target.value)}
                placeholder="🇬🇧"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">
                Ciudad (Opcional)
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Oxford"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="fundingType">
                Tipo de Cobertura Financiera *
              </label>
              <select
                id="fundingType"
                value={fundingType}
                onChange={(e) => setFundingType(e.target.value as FundingType)}
                className="form-select"
              >
                <option value="Fully Funded">Fully Funded (Totalmente Financiada)</option>
                <option value="Partially Funded">Partially Funded (Parcialmente Financiada)</option>
                <option value="Tuition Free">Tuition Free (Matrícula Gratuita)</option>
                <option value="Free Certificate">Free Certificate (Certificado Gratuito)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="duration">
                Duración del Programa
              </label>
              <input
                id="duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ej: 1 Año (Maestría)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deadline">
                Fecha Límite de Postulación (Deadline) *
              </label>
              <input
                id="deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Academic Level Multi-select */}
          <div className="form-group">
            <label className="form-label">Nivel Académico Elegible</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {availableDegrees.map((deg) => {
                const selected = degreeLevels.includes(deg);
                return (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => handleToggleDegree(deg)}
                    className="filter-pill"
                    style={{
                      borderColor: selected ? 'var(--brand-primary)' : 'var(--border-subtle)',
                      background: selected ? 'var(--brand-primary-light)' : 'var(--bg-surface)',
                      color: selected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      fontWeight: selected ? 700 : 500,
                    }}
                  >
                    {deg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flags / Checkboxes */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#ef4444' }}
              />
              <span style={{ fontWeight: 600 }}>Cierra Pronto (Mostrar en Ticker)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
              />
              <span style={{ fontWeight: 600 }}>Destacada en Página Principal</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600 }}>Estado:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                className="form-select"
                style={{ height: '34px', padding: '0 10px', fontSize: '0.85rem' }}
              >
                <option value="published">Publicada</option>
                <option value="draft">Borrador (Oculta del público)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Section 4: Content & Descriptions */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            4. Contenido y Requisitos
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="summary">
              Resumen Ejecutivo (Aparece en tarjetas y debajo del título)
            </label>
            <textarea
              id="summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Breve párrafo explicativo de qué ofrece esta beca..."
              className="form-textarea"
            />
          </div>

          {/* About Paragraphs */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Sobre la Convocatoria (Párrafos explicativos)
              </label>
              <button
                type="button"
                onClick={() => addListItem(aboutParagraphs, setAboutParagraphs)}
                className="btn-icon"
                style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', gap: '4px' }}
              >
                <Plus size={14} /> <span>Añadir Párrafo</span>
              </button>
            </div>
            {aboutParagraphs.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <textarea
                  rows={2}
                  value={p}
                  onChange={(e) => updateListItem(aboutParagraphs, setAboutParagraphs, idx, e.target.value)}
                  placeholder={`Párrafo ${idx + 1}...`}
                  className="form-textarea"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(aboutParagraphs, setAboutParagraphs, idx)}
                  className="btn-icon"
                  style={{ color: '#ef4444', height: '40px', flexShrink: 0 }}
                  title="Eliminar párrafo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Financial Benefits */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Beneficios Financieros (Lista de ítems con check verde)
              </label>
              <button
                type="button"
                onClick={() => addListItem(benefits, setBenefits)}
                className="btn-icon"
                style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', gap: '4px' }}
              >
                <Plus size={14} /> <span>Añadir Beneficio</span>
              </button>
            </div>
            {benefits.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(benefits, setBenefits, idx, e.target.value)}
                  placeholder="Ej: Estipendio mensual de 1,500 GBP para manutención"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(benefits, setBenefits, idx)}
                  className="btn-icon"
                  style={{ color: '#ef4444', flexShrink: 0 }}
                  title="Eliminar beneficio"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Eligibility Criteria */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Requisitos de Elegibilidad
              </label>
              <button
                type="button"
                onClick={() => addListItem(eligibilityList, setEligibilityList)}
                className="btn-icon"
                style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', gap: '4px' }}
              >
                <Plus size={14} /> <span>Añadir Requisito</span>
              </button>
            </div>
            {eligibilityList.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(eligibilityList, setEligibilityList, idx, e.target.value)}
                  placeholder="Ej: Título universitario de pregrado con promedio sobresaliente"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(eligibilityList, setEligibilityList, idx)}
                  className="btn-icon"
                  style={{ color: '#ef4444', flexShrink: 0 }}
                  title="Eliminar requisito"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Required Documents */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Documentos Requeridos
              </label>
              <button
                type="button"
                onClick={() => addListItem(documentsList, setDocumentsList)}
                className="btn-icon"
                style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', gap: '4px' }}
              >
                <Plus size={14} /> <span>Añadir Documento</span>
              </button>
            </div>
            {documentsList.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(documentsList, setDocumentsList, idx, e.target.value)}
                  placeholder="Ej: Carta de motivación en inglés (máx. 500 palabras)"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(documentsList, setDocumentsList, idx)}
                  className="btn-icon"
                  style={{ color: '#ef4444', flexShrink: 0 }}
                  title="Eliminar documento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Steps / How to Apply */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Pasos para Postular (Paso a paso)
              </label>
              <button
                type="button"
                onClick={() => addListItem(stepsList, setStepsList)}
                className="btn-icon"
                style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', gap: '4px' }}
              >
                <Plus size={14} /> <span>Añadir Paso</span>
              </button>
            </div>
            {stepsList.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(stepsList, setStepsList, idx, e.target.value)}
                  placeholder={`Paso ${idx + 1}: Crear cuenta en el portal oficial...`}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(stepsList, setStepsList, idx)}
                  className="btn-icon"
                  style={{ color: '#ef4444', flexShrink: 0 }}
                  title="Eliminar paso"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Official Link & Tags */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            5. Enlace Oficial y Etiquetas
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="officialLink">
              Enlace Oficial de Postulación (Sitio web de la institución)
            </label>
            <input
              id="officialLink"
              type="url"
              value={officialLink}
              onChange={(e) => setOfficialLink(e.target.value)}
              placeholder="https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarships"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tagsInput">
              Etiquetas / Tags (Separadas por comas)
            </label>
            <input
              id="tagsInput"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Master, Fully Funded, UK, Oxford, Leadership"
              className="form-input"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            style={{ padding: '12px 24px' }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="btn-primary"
            style={{ padding: '12px 32px', fontSize: '1rem' }}
          >
            <Save size={18} />
            <span>{loading ? 'Guardando...' : isEditing ? 'Actualizar Convocatoria' : 'Publicar Convocatoria'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
