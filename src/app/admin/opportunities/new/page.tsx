import React from 'react';
import OpportunityForm from '../../../../components/OpportunityForm';

export const metadata = {
  title: 'Nueva Convocatoria | Admin OpportunitiesMap',
};

export default function NewOpportunityPage() {
  return <OpportunityForm isEditing={false} />;
}
