import React from 'react';
import { notFound } from 'next/navigation';
import { OpportunityStore } from '../../../../../lib/opportunity-store';
import OpportunityForm from '../../../../../components/OpportunityForm';

interface EditOpportunityPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Editar Convocatoria | Admin OpportunitiesMap',
};

export default async function EditOpportunityPage({ params }: EditOpportunityPageProps) {
  const { id } = await params;
  const opp = await OpportunityStore.getBySlugOrId(id);

  if (!opp) {
    notFound();
  }

  return <OpportunityForm initialData={opp} isEditing={true} />;
}
