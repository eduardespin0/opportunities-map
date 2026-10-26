"""
OpportunitiesMap — Script de ingesta con IA (Gemini API)

Recibe texto en bruto de una convocatoria (pegado o desde archivo)
y genera:
  1. Un JSON estructurado compatible con el schema Opportunity del sitio.
  2. Un bloque de copy para Instagram con hashtags.

Uso:
  pip install google-genai
  export GEMINI_API_KEY="tu-clave"
  python scripts/ingest.py                        # modo interactivo
  python scripts/ingest.py --file convocatoria.txt # desde archivo
  python scripts/ingest.py --url https://...       # desde URL (experimental)
"""

import argparse
import json
import os
import sys
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: instala el SDK de Gemini con: pip install google-genai")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Schema de la oportunidad (coincide con src/lib/types.ts)
# ---------------------------------------------------------------------------
OPPORTUNITY_SCHEMA = {
    "type": "OBJECT",
    "required": [
        "title", "shortTitle", "category", "institution", "country",
        "countryCode", "countryFlag", "degreeLevel", "fundingType",
        "duration", "deadline", "tags", "summary", "about",
        "financialBenefits", "eligibility", "requiredDocuments",
        "howToApply", "officialLink",
    ],
    "properties": {
        "title": {"type": "STRING", "description": "Título completo de la convocatoria"},
        "shortTitle": {"type": "STRING", "description": "Título corto (máx 60 caracteres)"},
        "category": {
            "type": "STRING",
            "description": "Categoría",
            "enum": ["scholarships", "internships", "fellowships", "courses", "exchanges", "others"],
        },
        "institution": {"type": "STRING", "description": "Nombre de la institución que convoca"},
        "institutionLogoText": {"type": "STRING", "description": "Texto corto para el logo (ej. 'ETH Zurich')"},
        "country": {"type": "STRING", "description": "País(es) de destino"},
        "countryCode": {"type": "STRING", "description": "Código ISO alpha-2 del país, o GL si es multi-país"},
        "countryFlag": {"type": "STRING", "description": "Emoji de bandera del país"},
        "city": {"type": "STRING", "description": "Ciudad, si aplica"},
        "degreeLevel": {
            "type": "ARRAY", "items": {"type": "STRING"},
            "description": "Niveles académicos: Bachelor, Master, PhD, Postdoc, Professional, Any",
        },
        "fundingType": {
            "type": "STRING",
            "description": "Tipo de financiamiento",
            "enum": ["Fully Funded", "Partially Funded", "Tuition Free", "Free Certificate"],
        },
        "duration": {"type": "STRING", "description": "Duración del programa (ej. '2 años', '10 semanas')"},
        "deadline": {"type": "STRING", "description": "Fecha límite en formato YYYY-MM-DD"},
        "tags": {
            "type": "ARRAY", "items": {"type": "STRING"},
            "description": "Etiquetas relevantes (5-10 tags)",
        },
        "summary": {"type": "STRING", "description": "Resumen de 2-3 oraciones"},
        "about": {
            "type": "ARRAY", "items": {"type": "STRING"},
            "description": "Párrafos descriptivos sobre el programa (3-4 párrafos)",
        },
        "financialBenefits": {
            "type": "ARRAY", "items": {"type": "STRING"},
            "description": "Lista de beneficios financieros",
        },
        "eligibility": {
            "type": "ARRAY", "items": {"type": "STRING"},
            "description": "Requisitos de elegibilidad",
        },
        "requiredDocuments": {
            "type": "ARRAY", "items": {"type": "STRING"},
            "description": "Documentos requeridos para postular",
        },
        "howToApply": {
            "type": "ARRAY", "items": {"type": "STRING"},
            "description": "Pasos para postularse",
        },
        "officialLink": {"type": "STRING", "description": "URL del portal oficial de postulación"},
    },
}

INSTAGRAM_SCHEMA = {
    "type": "OBJECT",
    "required": ["slide1_hook", "slide2_benefits", "slide3_requirements", "slide4_apply", "caption"],
    "properties": {
        "slide1_hook": {
            "type": "STRING",
            "description": "Texto para lámina 1 del carrusel: gancho (máx 80 caracteres)",
        },
        "slide2_benefits": {
            "type": "STRING",
            "description": "Texto para lámina 2: beneficios clave (3-4 bullets cortos)",
        },
        "slide3_requirements": {
            "type": "STRING",
            "description": "Texto para lámina 3: requisitos principales (3-4 bullets cortos)",
        },
        "slide4_apply": {
            "type": "STRING",
            "description": "Texto para lámina 4: cómo aplicar y CTA",
        },
        "caption": {
            "type": "STRING",
            "description": "Copy completo para pie de foto de Instagram (máx 2200 chars), con emojis y 20-30 hashtags al final",
        },
    },
}


def slugify(text: str) -> str:
    """Genera un slug URL-friendly a partir de un texto."""
    text = unicodedata.normalize("NFD", text.lower().strip())
    text = re.sub(r"[\u0300-\u036f]", "", text)  # quitar acentos
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def read_input_text(args) -> str:
    """Lee el texto de entrada desde archivo, argumento o stdin interactivo."""
    if args.file:
        path = Path(args.file)
        if not path.exists():
            print(f"Error: archivo no encontrado: {path}")
            sys.exit(1)
        return path.read_text(encoding="utf-8")

    if args.url:
        # Pasa la URL directamente al modelo para que la procese como contexto
        return f"Convocatoria desde la siguiente URL: {args.url}"

    # Modo interactivo
    print("=" * 60)
    print("  OpportunitiesMap — Ingesta con IA")
    print("=" * 60)
    print()
    print("Pega el texto de la convocatoria y presiona Enter dos veces")
    print("(o Ctrl+D / Ctrl+Z para terminar):")
    print()

    lines = []
    empty_count = 0
    try:
        while True:
            line = input()
            if line.strip() == "":
                empty_count += 1
                if empty_count >= 2:
                    break
            else:
                empty_count = 0
            lines.append(line)
    except EOFError:
        pass

    text = "\n".join(lines).strip()
    if not text:
        print("Error: no se recibió texto.")
        sys.exit(1)
    return text


def extract_opportunity(client, raw_text: str) -> dict:
    """Usa Gemini para extraer datos estructurados de la convocatoria."""
    print("\n⏳ Extrayendo datos de la convocatoria con Gemini...")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            "Eres un asistente experto en becas internacionales. "
            "Extrae toda la información relevante del siguiente texto de convocatoria "
            "y devuélvela en formato JSON estructurado. "
            "Redacta en español. Si no encuentras un dato, usa un valor razonable basado en el contexto. "
            "Las fechas deben estar en formato YYYY-MM-DD. "
            "El countryFlag debe ser el emoji de bandera del país. "
            "Si hay múltiples países, usa countryCode 'GL' y countryFlag '🌍'.\n\n"
            f"TEXTO DE LA CONVOCATORIA:\n{raw_text}",
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_json_schema=OPPORTUNITY_SCHEMA,
            temperature=0.2,
        ),
    )

    data = json.loads(response.text)
    return data


def generate_instagram(client, opportunity: dict) -> dict:
    """Usa Gemini para generar el copy de Instagram."""
    print("⏳ Generando copy para Instagram...")

    opp_summary = json.dumps(opportunity, ensure_ascii=False, indent=2)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            "Eres un community manager experto en educación internacional. "
            "Genera el contenido para un carrusel de Instagram (4 láminas) y el caption, "
            "basándote en esta convocatoria. "
            "El tono debe ser motivador pero profesional. "
            "Los textos de las láminas deben ser concisos (para que quepan en un diseño de Canva). "
            "El caption debe incluir emojis relevantes y terminar con 20-30 hashtags populares del nicho "
            "(becas, scholarships, study abroad, etc.).\n\n"
            f"DATOS DE LA CONVOCATORIA:\n{opp_summary}",
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_json_schema=INSTAGRAM_SCHEMA,
            temperature=0.7,
        ),
    )

    data = json.loads(response.text)
    return data


def build_full_opportunity(extracted: dict) -> dict:
    """Completa los campos faltantes (id, slug, fechas, etc.)."""
    now = datetime.now(timezone.utc).isoformat()
    slug = slugify(extracted["title"])

    return {
        "id": slug,
        "slug": slug,
        "featured": False,
        "isUrgent": False,
        "status": "draft",
        "bannerImageUrl": "",
        "institutionLogoUrl": "",
        "bannerTheme": {
            "primaryColor": "#0284c7",
            "accentColor": "#fbbf24",
            "badgeText": extracted.get("category", "scholarships").upper(),
        },
        "publishedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "createdAt": now,
        "updatedAt": now,
        **extracted,
    }


def save_outputs(opportunity: dict, instagram: dict, output_dir: Path):
    """Guarda los resultados en archivos JSON."""
    output_dir.mkdir(parents=True, exist_ok=True)

    slug = opportunity["slug"]

    opp_path = output_dir / f"{slug}.json"
    opp_path.write_text(
        json.dumps(opportunity, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    ig_path = output_dir / f"{slug}_instagram.json"
    ig_path.write_text(
        json.dumps(instagram, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return opp_path, ig_path


def append_to_data_file(opportunity: dict, data_file: Path):
    """Agrega la oportunidad al archivo de datos del sitio."""
    if data_file.exists():
        existing = json.loads(data_file.read_text(encoding="utf-8"))
    else:
        existing = []

    # Evitar duplicados por slug
    existing = [o for o in existing if o.get("slug") != opportunity["slug"]]
    existing.insert(0, opportunity)

    data_file.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser(
        description="OpportunitiesMap — Ingesta de convocatorias con Gemini AI",
    )
    parser.add_argument("--file", "-f", help="Ruta a un archivo .txt con la convocatoria")
    parser.add_argument("--url", "-u", help="URL de la convocatoria (experimental)")
    parser.add_argument(
        "--output", "-o",
        default="scripts/output",
        help="Directorio de salida (default: scripts/output)",
    )
    parser.add_argument(
        "--add-to-site",
        action="store_true",
        help="Agregar automáticamente al archivo src/data/opportunities.json",
    )
    args = parser.parse_args()

    # Verificar API key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: define la variable de entorno GEMINI_API_KEY")
        print("  export GEMINI_API_KEY='tu-clave'   # Linux/Mac")
        print("  set GEMINI_API_KEY=tu-clave         # Windows CMD")
        print("  $env:GEMINI_API_KEY='tu-clave'      # PowerShell")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    # Leer texto de entrada
    raw_text = read_input_text(args)

    # Extraer datos estructurados
    extracted = extract_opportunity(client, raw_text)
    opportunity = build_full_opportunity(extracted)

    # Generar copy de Instagram
    instagram = generate_instagram(client, opportunity)

    # Guardar resultados
    project_root = Path(__file__).resolve().parent.parent
    output_dir = project_root / args.output
    opp_path, ig_path = save_outputs(opportunity, instagram, output_dir)

    # Mostrar resumen
    print()
    print("=" * 60)
    print("  ✅ Ingesta completada")
    print("=" * 60)
    print()
    print(f"  Título:      {opportunity['title']}")
    print(f"  Categoría:   {opportunity['category']}")
    print(f"  Institución: {opportunity['institution']}")
    print(f"  País:        {opportunity['country']} {opportunity['countryFlag']}")
    print(f"  Deadline:    {opportunity['deadline']}")
    print(f"  Funding:     {opportunity['fundingType']}")
    print()
    print(f"  📄 JSON:      {opp_path}")
    print(f"  📸 Instagram: {ig_path}")

    # Agregar al sitio si se solicita
    if args.add_to_site:
        data_file = project_root / "src" / "data" / "opportunities.json"
        append_to_data_file(opportunity, data_file)
        print(f"  🌐 Agregado a: {data_file}")

    print()

    # Mostrar preview del caption
    print("-" * 60)
    print("  Preview del caption de Instagram:")
    print("-" * 60)
    print(instagram.get("caption", "(sin caption)"))
    print("-" * 60)


if __name__ == "__main__":
    main()
