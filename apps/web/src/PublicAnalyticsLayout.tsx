import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { LocationSelector } from '@your-props/client/web';

export function PublicAnalyticsLayout() {
  return (
    <div className="min-h-screen w-full px-4 pb-8 pt-[96px] lg:px-6">
      <div className="mx-auto flex h-full w-full min-w-0 max-w-full flex-col gap-4 lg:gap-6 min-[1601px]:max-w-[1440px]">
        <div className="flex flex-col gap-4 rounded-[16px] border border-[#393939] bg-[#393939] px-4 py-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[15px] font-normal leading-[26px] uppercase text-[#C5B6B3]">YourNHS</p>
            <h1 className="truncate text-xl font-semibold text-[#EBEBEB]">Analytics</h1>
          </div>

          <div className="w-full max-w-[420px]">
            <LocationSelector />
          </div>
        </div>

        <main className="h-full min-h-[480px] min-w-0 w-full overflow-hidden rounded-[16px] border border-[#393939] bg-[#393939]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

