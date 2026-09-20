import { NextResponse } from 'next/server';
import { OpportunityStore } from '@/lib/opportunity-store';
import { Opportunity } from '@/lib/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const opp = await OpportunityStore.getBySlugOrId(id);

    if (!opp) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json(opp);
  } catch (error) {
    console.error('Error in GET /api/opportunities/[id]:', error);
    return NextResponse.json(
      { error: 'Error al obtener la convocatoria.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await OpportunityStore.getBySlugOrId(id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Convocatoria a actualizar no encontrada.' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updated: Opportunity = {
      ...existing,
      ...body,
      id: existing.id, // Preserve original ID
      slug: body.slug ? OpportunityStore.slugify(body.slug) : existing.slug,
      updatedAt: new Date().toISOString(),
    };

    const saved = await OpportunityStore.save(updated);

    return NextResponse.json({
      success: true,
      message: 'Convocatoria actualizada con éxito.',
      opportunity: saved,
    });
  } catch (error) {
    console.error('Error in PUT /api/opportunities/[id]:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la convocatoria.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await OpportunityStore.getBySlugOrId(id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada.' },
        { status: 404 }
      );
    }

    await OpportunityStore.delete(existing.id);

    return NextResponse.json({
      success: true,
      message: 'Convocatoria eliminada correctamente.',
    });
  } catch (error) {
    console.error('Error in DELETE /api/opportunities/[id]:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la convocatoria.' },
      { status: 500 }
    );
  }
}
