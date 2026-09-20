# 🧭 OpportunitiesMap

> **Mapping Global Opportunities for Ambitious Minds**  
> Portal digital de alto rendimiento y arquitectura moderna para la difusión de becas universitarias, pasantías científicas, programas de liderazgo y cursos certificados de todo el mundo.

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![SEO Ready](https://img.shields.io/badge/SEO-JSON--LD%20%26%20AdSense-orange?style=for-the-badge)](https://schema.org)

---

## 🌟 Resumen del Proyecto

**OpportunitiesMap** surge para democratizar el acceso a la educación superior y las oportunidades de financiamiento global. Inspirado en la arquitectura funcional de comunidades como *OpportunitiesPedia* y *Opportunities Corners*, eleva el estándar hacia una experiencia de software premium, limpia, de ultra-alta velocidad y orientada al usuario contemporáneo.

### Pilares Fundamentales:
1. **Difusión 100% Informativa:** Centralización de convocatorias legítimas con enlaces directos al portal oficial de cada organismo. No ofrecemos consultorías ni asesorías de trámite.
2. **Sinergia con Instagram y Canva Pro:** Sistema de banners y carruseles estandarizados para publicar simultáneamente en redes sociales y en la web con una sola fuente de datos.
3. **Pipeline de Ingesta con IA (`scripts/ingest.mjs`):** Script potenciado por Google Gemini API que convierte convocatorias en bruto en archivos estructurados y redacta el copy con hashtags para Instagram.
4. **Preparado para Monetización Sostenible:** Arquitectura técnica optimizada para **Google AdSense** (páginas legales de privacidad, descargo de responsabilidad, términos y about us), además de boletín de alertas por correo.
5. **Código de Nivel Académico y Profesional:** Estructura modular y fuertemente tipada en TypeScript diseñada para servir de respaldo en admisiones de posgrado y entrevistas de ingeniería de software.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                       OpportunitiesMap                      │
├──────────────────────────────┬──────────────────────────────┤
│         FRONTEND WEB         │        PIPELINE DE IA        │
│   Next.js (App Router, SSG)  │   Google Gemini 2.5 Flash    │
│   TypeScript + CSS Moderno   │  Extracción de convocatorias │
│   Lighthouse 100 / Subseg    │  Generador de Copy Instagram │
├──────────────────────────────┴──────────────────────────────┤
│                     CAPA DE CONTENIDOS                      │
│       Esquemas tipados + Modelo estructurado en Git         │
│   (Versionado en GitHub, cero costo de BD para arrancar)    │
├─────────────────────────────────────────────────────────────┤
│                 INFRAESTRUCTURA Y MONETIZACIÓN              │
│       Vercel / Cloudflare Pages (Hosting gratuito)          │
│       Google AdSense ready + Newsletter de Alertas          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Características Principales

- ⚡ **Velocidad Extrema (SSG):** Todas las páginas se pre-renderizan a HTML puro en tiempo de compilación para tiempos de carga inferiores a 500 ms.
- 🌓 **Modo Oscuro y Modo Claro:** Sistema de temas nativo mediante variables CSS con persistencia en `localStorage`.
- 🔍 **Buscador y Filtros en Vivo:** Filtrado instantáneo por texto, categoría (*Scholarships, Internships, Fellowships, Online Courses*), financiamiento (*Fully Funded, Partially Funded*) y país de destino.
- 📋 **Ficha Técnica (*SpecsBox*):** Cuadro de datos rápidos en cada convocatoria destacando país, institución, duración, cobertura económica y fecha límite.
- 📌 **Barra de Lectura Fija:** Barra superior con indicador de lectura y botones de compartir con un clic (WhatsApp, X / Twitter, LinkedIn, Copiar enlace).
- 🛡️ **Avisos Legales Transparentes:** Banner permanente y páginas dedicadas de *Disclaimer*, *Privacy Policy* y *Terms of Service* que garantizan el cumplimiento de las directrices de Google AdSense.

---

## 📁 Estructura del Proyecto

```
proyecto-oppmaps/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Shell principal, Navbar, Footer y SEO global
│   │   ├── page.tsx                # Página de inicio con Grid Multicolumna
│   │   ├── globals.css             # Tokens de diseño, Dark/Light mode y estilos
│   │   ├── opportunities/
│   │   │   ├── page.tsx            # Explorador interactivo con filtros en tiempo real
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Página de detalle con Ficha Técnica y Schema SEO
│   │   ├── about/page.tsx          # Acerca de OpportunitiesMap y misión
│   │   ├── disclaimer/page.tsx     # Descargo de responsabilidad legal
│   │   ├── privacy/page.tsx        # Política de privacidad (Google AdSense)
│   │   └── terms/page.tsx          # Términos y condiciones de servicio
│   ├── components/
│   │   ├── Navbar.tsx              # Barra de navegación principal
│   │   ├── Footer.tsx              # Pie de página institucional y enlaces
│   │   ├── OpportunityCard.tsx     # Tarjeta estilo Canva Pro con bandera y badge
│   │   ├── CategoryColumn.tsx      # Columna temática con destacada y lista
│   │   ├── SpecsBox.tsx            # Ficha técnica estructurada
│   │   ├── ShareBar.tsx            # Botones sociales de compartir
│   │   ├── NewsletterBox.tsx       # Caja interactiva de captura de correo
│   │   └── ThemeToggle.tsx         # Switch Dark / Light Mode
│   ├── data/
│   │   └── opportunities.ts        # Base de datos semilla de oportunidades
│   └── lib/
│       ├── types.ts                # Interfaces y tipos de TypeScript
│       └── opportunities.ts        # Funciones de consulta, filtrado y búsqueda
├── scripts/
│   └── ingest.mjs                  # Script CLI de ingesta con IA y generador Instagram
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## 💻 Instalación y Uso Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/opportunity-maps.git
cd opportunity-maps
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la plataforma.

### 4. Compilar para producción (Build estático)
```bash
npm run build
npm run start
```

### 5. Probar el Pipeline de IA para Instagram y Canva
```bash
# Puedes definir tu clave de API de Gemini opcionalmente:
# export GEMINI_API_KEY="tu-api-key"

npm run ingest
```

---

## 📈 Estrategia de Monetización

1. **Google AdSense:** La plataforma cumple con los estándares editoriales de Google: arquitectura de contenido original, páginas de privacidad y cookies, política de navegación clara y carga instantánea.
2. **Newsletter Semanal:** Captura de correos para envío automatizado de alertas, monetizable mediante patrocinios educativos o cursos de idiomas (IELTS/TOEFL).
3. **Marketing de Afiliados Ético:** Integración futura con seguros de viaje estudiantil, plataformas de aprendizaje y herramientas de preparación académica.

---

## ⚖️ Descargo de Responsabilidad (Disclaimer)

OpportunitiesMap es un proyecto de carácter estrictamente informativo. No cobramos comisiones ni garantizamos admisiones. Todas las postulaciones se procesan de forma directa a través de los canales oficiales de las instituciones convocantes.

---

## 👨‍💻 Autor y Licencia

Desarrollado como proyecto de código abierto para demostrar competencias en ingeniería de software, arquitectura web moderna e integración con modelos de lenguaje.

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
