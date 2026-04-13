import { DashboardAppointmentsList } from '../../components/dashboard/DashboardAppointmentsList';

export default function DashboardIndex() {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto px-5 py-6 lg:px-8 lg:py-8">
      <DashboardAppointmentsList />
    </div>
  );
}
