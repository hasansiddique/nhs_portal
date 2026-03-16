import React from 'react';

import { DashboardLayout } from '../Dashboard';

import { OfferedToMe } from './OfferedToMe';
import { OfferedByMe } from './OfferedByMe';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

export const OffersPage = () => {
  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Discover',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: 'Props',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: 'Offers',
      isActive: true,
    },
  ];

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        <div className="flat-tabs themesflat-tabs tabs">
          <Tabs className="lg:mr-[10px]">
            <TabList>
              <Tab>My Offers</Tab>
              <Tab>Offers Recieved</Tab>
            </TabList>

            <TabPanel>
              <OfferedByMe />
            </TabPanel>
            <TabPanel>
              <OfferedToMe />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};
