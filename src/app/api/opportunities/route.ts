import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { OpportunityStore } from '@/lib/opportunity-store';
import { Opportunity } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await OpportunityStore.getAll();
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error in GET /api/opportunities:', error);
    return NextResponse.json(
      { error: 'Error al obtener las oportunidades.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.category || !body.institution || !body.country || !body.deadline) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: título, categoría, institución, país o fecha de cierre.' },
        { status: 400 }
      );
    }

    const slug = body.slug ? OpportunityStore.slugify(body.slug) : OpportunityStore.slugify(body.title);
    const id = body.id || slug;

    const newOpportunity: Opportunity = {
      id,
      slug,
      title: body.title,
      shortTitle: body.shortTitle || body.title,
      category: body.category,
      institution: body.institution,
      institutionLogoText: body.institutionLogoText || '',
      institutionLogoUrl: body.institutionLogoUrl || '',
      bannerImageUrl: body.bannerImageUrl || '',
      country: body.country,
      countryCode: body.countryCode || 'GL',
      countryFlag: body.countryFlag || '🌍',
      city: body.city || '',
      degreeLevel: Array.isArray(body.degreeLevel) ? body.degreeLevel : ['All Levels'],
      fundingType: body.fundingType || 'Fully Funded',
      duration: body.duration || 'Variable',
      deadline: body.deadline,
      featured: Boolean(body.featured),
      isUrgent: Boolean(body.isUrgent),
      status: body.status || 'published',
      bannerTheme: body.bannerTheme || {
        primaryColor: '#0284c7',
        accentColor: '#fbbf24',
        badgeText: body.category.toUpperCase(),
      },
      tags: Array.isArray(body.tags) ? body.tags : [],
      summary: body.summary || '',
      about: Array.isArray(body.about) ? body.about : (body.about ? [body.about] : []),
      financialBenefits: Array.isArray(body.financialBenefits) ? body.financialBenefits : [],
      eligibility: Array.isArray(body.eligibility) ? body.eligibility : [],
      requiredDocuments: Array.isArray(body.requiredDocuments) ? body.requiredDocuments : [],
      howToApply: Array.isArray(body.howToApply) ? body.howToApply : [],
      officialLink: body.officialLink || '',
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const saved = await OpportunityStore.save(newOpportunity);

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath error:', e);
    }

    return NextResponse.json(
      { success: true, message: 'Oportunidad creada exitosamente.', opportunity: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/opportunities:', error);
    return NextResponse.json(
      { error: 'Error al procesar la creación de la oportunidad.' },
      { status: 500 }
    );
  }
}
