import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { DashboardLayout } from '../Dashboard';
import { BuyerDisputes } from './buyer/BuyerDisputes';
import { SellerDisputes } from './seller/SellerDisputes';

export const DisputesPage = () => {
  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Dashboard',
      isActive: false,
      redirectUrl: '/dashboard/props',
    },
    {
      label: 'Disputes',
      isActive: true,
    },
  ];

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        <div className="flat-tabs themesflat-tabs tabs">
          <Tabs className="lg:mr-[10px]">
            <TabList>
              <Tab>Seller Disputes</Tab>
              <Tab>Buyer Disputes</Tab>
            </TabList>

            <TabPanel>
              <SellerDisputes/>
            </TabPanel>
            <TabPanel>
              <BuyerDisputes/>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};
