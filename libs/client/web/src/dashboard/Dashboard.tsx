import React, { ReactNode } from 'react';

import { Breadcrumbs } from '@your-props/client/ui';

import { DashboardSidebar } from './DashboardSidebar';

export const DashboardLayout = ({
  breadCrumbs,
  children,
}: {
  children: ReactNode;
  breadCrumbs: { label: string; isActive: boolean; redirectUrl?: string }[];
}) => {
  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      <section className="featured-props-section">
        <div className="themesflat-container pb-[40px]">
          <div className="flex flex-col lg:flex-row items-start">
            <div className="w-full lg:w-1/4 bg-[#3939394D] px-[40px] py-[50px] rounded-[10px] mt-[20px] lg:mt-0">
              <DashboardSidebar/>
            </div>

            <div className="w-full lg:w-3/4 lg:pl-[40px] mt-[20px] lg:mt-0">
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
);
};
