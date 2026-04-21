import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { DashboardSidebar, NhsNotificationsSidebar } from '@your-props/client/web';

import { DashboardAppointmentDetailSidebar } from './components/dashboard/DashboardAppointmentDetailSidebar';

export const DashboardLayout = () => {
  const location = useLocation();
  const appointmentId = new URLSearchParams(location.search).get('appointmentId');
  const isBookedAppointmentsRoute = location.pathname === '/dashboard/appointments';
  const showAppointmentDetail = Boolean(isBookedAppointmentsRoute && appointmentId);
  const isDataInsightsRoute = location.pathname === '/dashboard/data-insights';
  const showRightSidebar = !isDataInsightsRoute;

  return (
    <div className="min-h-screen w-full px-4 pb-8 pt-[100px] lg:px-6">
      <div className="mx-auto flex h-full w-full min-w-0 max-w-full min-[1601px]:max-w-[1440px] flex-col gap-4 lg:gap-6">
        <section
          className={`grid h-full min-h-0 w-full gap-4 ${
            showRightSidebar ? 'lg:grid-cols-[260px,minmax(0,1fr),320px]' : 'lg:grid-cols-[260px,minmax(0,1fr)]'
          }`}
        >
          {/* Left sidebar */}
          <aside className="h-full rounded-[16px] border border-[#393939] bg-[#393939] px-4 py-5">
            <DashboardSidebar />
          </aside>

          {/* Center content */}
          <main className="h-full min-h-[480px] min-w-0 w-full overflow-hidden rounded-[16px] border border-[#393939] bg-[#393939]">
            <Outlet />
          </main>

          {/* Right sidebar: appointment detail on booked page, else notifications (hidden on analytics) */}
          {showRightSidebar ? (
            <div className="hidden h-full min-h-0 lg:block">
              {showAppointmentDetail && appointmentId ? (
                <DashboardAppointmentDetailSidebar appointmentId={appointmentId} />
              ) : (
                <NhsNotificationsSidebar />
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

