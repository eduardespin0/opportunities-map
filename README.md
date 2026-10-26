# OpportunitiesMap

Portal web para difundir becas, pasantías, fellowships y cursos gratuitos de todo el mundo.
Centraliza convocatorias legítimas con enlaces directos al portal oficial de cada institución.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 7 |
| Base de datos | Cloud Firestore (con respaldo local JSON) |
| Auth admin | JWT con `jose` (credenciales vía env vars) |
| Iconos | Lucide React |
| Estilos | CSS vanilla (variables, dark/light mode) |
| Hosting | Firebase Hosting (configurado) |

---

## Estructura del proyecto

```
opportunities-map/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Shell principal, Navbar, Footer, SEO
│   │   ├── page.tsx                # Home — grid por categorías
│   │   ├── globals.css             # Tokens de diseño, dark/light mode
│   │   ├── opportunities/
│   │   │   ├── page.tsx            # Explorador con filtros
│   │   │   └── [slug]/page.tsx     # Detalle de convocatoria
│   │   ├── category/[cat]/page.tsx # Vista filtrada por categoría
│   │   ├── admin/
│   │   │   ├── page.tsx            # Dashboard admin (CRUD)
│   │   │   ├── login/page.tsx      # Login admin
│   │   │   └── opportunities/      # Formulario de creación/edición
│   │   ├── api/
│   │   │   ├── auth/               # Login / logout / me
│   │   │   ├── opportunities/      # CRUD REST
│   │   │   └── upload/             # Subida de imágenes
│   │   ├── about/page.tsx
│   │   ├── disclaimer/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── OpportunityCard.tsx
│   │   ├── CategoryColumn.tsx
│   │   ├── SpecsBox.tsx            # Ficha técnica de la convocatoria
│   │   ├── ShareBar.tsx            # Compartir en redes
│   │   ├── NewsletterBox.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── UrgentTicker.tsx
│   │   ├── OpportunityForm.tsx     # Formulario admin
│   │   ├── AdminHeader.tsx
│   │   └── AdminLogoutButton.tsx
│   ├── data/
│   │   └── opportunities.json      # Datos semilla / cache local
│   ├── lib/
│   │   ├── types.ts                # Interfaces TypeScript
│   │   ├── opportunities.ts        # Queries sobre el JSON local
│   │   ├── opportunity-store.ts    # CRUD Firestore + fallback JSON
│   │   ├── firebase.ts             # Config Firebase client
│   │   └── auth.ts                 # JWT helpers
│   └── middleware.ts               # Protección de rutas /admin y API
├── scripts/
│   └── ingest.py                   # Script de ingesta con Gemini API
├── public/
│   ├── manifest.json
│   ├── ads.txt
│   └── uploads/                    # Imágenes subidas desde el admin
├── firebase.json
├── firestore.rules
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## Funcionalidades implementadas

- **Home con grid por categorías:** Scholarships, Internships, Fellowships, Online Courses.
- **Explorador con filtros:** búsqueda por texto, categoría, financiamiento, país y nivel académico.
- **Página de detalle:** ficha técnica (SpecsBox), secciones de elegibilidad, beneficios, documentos requeridos, enlace oficial y oportunidades relacionadas.
- **Panel de administración:** login con JWT, CRUD completo de oportunidades vía Firestore, subida de imágenes.
- **Dark / Light mode:** toggle con persistencia en `localStorage`.
- **Compartir:** botones de WhatsApp, X, LinkedIn y copiar enlace.
- **SEO:** `sitemap.ts`, `robots.ts`, metadatos dinámicos por página.
- **Páginas legales:** About, Disclaimer, Privacy Policy, Terms.
- **Ticker de urgencia:** banner animado para convocatorias próximas a cerrar.
- **Script de ingesta (Python):** recibe texto o URL de una convocatoria, usa Gemini API para extraer campos estructurados y genera el copy de Instagram con hashtags.

---

## Instalación

```bash
git clone https://github.com/eduardespin0/opportunities-map.git
cd opportunities-map
npm install
```

### Variables de entorno

Crea un archivo `.env.local`:

```env
# Firebase (obligatorio — o el código usa los valores por defecto del proyecto)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD=       # cámbiala en producción
JWT_SECRET=           # clave segura para firmar tokens
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Producción

```bash
npm run build
npm run start
```

### Ingesta con IA

```bash
pip install google-genai
export GEMINI_API_KEY="tu-api-key"       # o set en Windows
python scripts/ingest.py
```

---

## Qué hice yo y qué hizo la IA

Sección de transparencia para entrevistas técnicas.

### Lo que hice yo (Eduardo)

- **Concepto y diseño del producto:** definí qué problema resuelve, el público objetivo (estudiantes salvadoreños y de cualquier parte buscando becas internacionales) y la estrategia de contenidos web + Instagram.
- **Arquitectura de datos:** diseñé el esquema `Opportunity` (los 20+ campos, categorías, tipos de financiamiento) basándome en lo que necesita alguien evaluando una beca.
- **Curación de contenido real:** investigué y redacté las convocatorias reales (Erasmus Mundus, ETH Zurich ESOP) con datos verificados de los portales oficiales.
- **Decisiones de stack:** elegí Next.js + Firestore + JWT por la relación costo/funcionalidad. Elegí CSS vanilla en lugar de Tailwind por control directo.
- **Admin y flujo de publicación:** diseñé el flujo completo: login → formulario → Firestore → respaldo JSON → sitio público.
- **Configuración de Firebase:** creé el proyecto en Firebase Console, configuré Firestore y el hosting.
- **QA manual y responsive:** probé en móvil y escritorio, corregí errores de diseño responsive iterativamente (visible en los commits).
- **Iteración y dirección:** revisé cada resultado de la IA, pedí correcciones y decidí qué quedaba y qué se descartaba.

### Lo que hizo la IA (asistente de código)

- **Generación de boilerplate:** componentes React (Navbar, Footer, Cards, SpecsBox, ShareBar), CSS global, layout de Next.js.
- **CRUD Firestore:** el módulo `opportunity-store.ts` con operaciones de lectura/escritura y fallback a JSON local.
- **Auth con JWT:** implementación del middleware, rutas de login/logout y verificación de token con `jose`.
- **Formulario admin:** el componente `OpportunityForm.tsx` con validación de todos los campos.
- **API routes:** endpoints REST para opportunities y upload de imágenes.
- **SEO dinámico:** generación de sitemap.ts, robots.ts y metadatos OpenGraph.
- **Script de ingesta:** el script Python que conecta con Gemini API para procesar convocatorias.
- **Páginas legales:** contenido base de About, Disclaimer, Privacy y Terms.

### En resumen

Yo definí **qué** construir y **por qué**. La IA fue mi herramienta para el **cómo** — escribió código que yo revisé, corregí y decidí mantener. Es como usar un IDE avanzado: la herramienta no toma decisiones de producto.

---

## Descargo de responsabilidad

OpportunitiesMap es un proyecto informativo. No cobramos comisiones ni garantizamos admisiones. Todas las postulaciones se procesan directamente en los portales oficiales de cada institución.

---

## Licencia

MIT — ver [LICENSE](LICENSE).
