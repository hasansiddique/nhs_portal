import React from 'react';

import { Breadcrumbs } from '@your-props/client/ui';

import { ActorsListing } from './Actors';

export const ActorsList = () => {
  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: 'Actors',
      isActive: true,
    },
  ];

  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      <ActorsListing />
    </>
  );
};
