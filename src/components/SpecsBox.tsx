import React from 'react';
import { 
  MapPin, 
  Building2, 
  GraduationCap, 
  Clock, 
  Coins, 
  CalendarCheck, 
  ShieldCheck 
} from 'lucide-react';
import { Opportunity } from '../lib/types';

interface SpecsBoxProps {
  opportunity: Opportunity;
}

export default function SpecsBox({ opportunity }: SpecsBoxProps) {
  const {
    country,
    countryFlag,
    city,
    institution,
    category,
    degreeLevel,
    duration,
    fundingType,
    deadline,
  } = opportunity;

  const formattedDeadline = new Date(deadline).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="specs-box">
      <div className="specs-title">
        <ShieldCheck size={20} style={{ color: 'var(--brand-primary)' }} />
        <span>Ficha Técnica y Datos Rápidos</span>
      </div>

      <div className="specs-grid">
        <div className="spec-item">
          <MapPin size={18} className="spec-icon" />
          <div>
            <div className="spec-label">País y Ciudad de Destino</div>
            <div className="spec-value">
              {countryFlag} {country}{city ? `, ${city}` : ''}
            </div>
          </div>
        </div>

        <div className="spec-item">
          <Building2 size={18} className="spec-icon" />
          <div>
            <div className="spec-label">Institución Anfitriona</div>
            <div className="spec-value">{institution}</div>
          </div>
        </div>

        <div className="spec-item">
          <GraduationCap size={18} className="spec-icon" />
          <div>
            <div className="spec-label">Nivel Académico / Tipo</div>
            <div className="spec-value">
              {degreeLevel.join(', ')} ({category})
            </div>
          </div>
        </div>

        <div className="spec-item">
          <Clock size={18} className="spec-icon" />
          <div>
            <div className="spec-label">Duración del Programa</div>
            <div className="spec-value">{duration}</div>
          </div>
        </div>

        <div className="spec-item">
          <Coins size={18} className="spec-icon" />
          <div>
            <div className="spec-label">Cobertura Financiera</div>
            <div className="spec-value" style={{ color: '#10b981', fontWeight: 700 }}>
              {fundingType}
            </div>
          </div>
        </div>

        <div className="spec-item">
          <CalendarCheck size={18} className="spec-icon" />
          <div>
            <div className="spec-label">Fecha Límite de Postulación</div>
            <div className="spec-value">{formattedDeadline}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
