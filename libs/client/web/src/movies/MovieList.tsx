import React from 'react';

import { MoviesListing } from './Movies';
import { Breadcrumbs } from '@your-props/client/ui';

export const MovieList = () => {
  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: 'Movies',
      isActive: true,
    },
  ];

  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      <MoviesListing />
    </>
  );
};
