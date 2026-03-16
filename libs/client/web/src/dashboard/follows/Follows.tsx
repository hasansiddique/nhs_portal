import { DashboardLayout } from '../Dashboard';
import { FollowingsPage } from './Followings';
import { FollowersPage } from './Followers';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
// import * as Tabs from '@radix-ui/react-tabs';

export const FollowsPage = () => {
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
      label: 'Followers',
      isActive: true,
    },
  ];

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        <div className="flat-tabs themesflat-tabs tabs">
          <Tabs className="lg:mr-[10px]">
            <TabList>
              <Tab>Followers</Tab>
              <Tab>Followings</Tab>
            </TabList>

            <TabPanel>
              <FollowersPage/>
            </TabPanel>
            <TabPanel>
              <FollowingsPage/>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};
