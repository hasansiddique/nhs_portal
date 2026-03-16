import * as React from 'react';
import { Outlet } from 'react-router-dom';

import {
  DashboardSidebar,
  NhsNotificationsSidebar,
} from '@your-props/client/web';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen w-full px-4 pb-8 pt-[96px] lg:px-6">
      <div className="flex h-full w-full flex-col gap-4 lg:gap-6">
        <section className="grid h-full w-full gap-4 lg:grid-cols-[260px,minmax(0,1fr),320px]">
          {/* Left sidebar */}
          <aside className="h-full rounded-[16px] border border-[#393939] bg-[#393939] px-4 py-5">
            <DashboardSidebar />
          </aside>

          {/* Center content */}
          <main className="h-full min-h-[480px] overflow-hidden rounded-[16px] border border-[#393939] bg-[#393939]">
            <Outlet />
          </main>

          {/* Right sidebar */}
          <div className="hidden h-full lg:block">
            <NhsNotificationsSidebar />
          </div>
        </section>
      </div>
    </div>
  );
};

