import { Link } from 'react-router-dom';
import { trpc } from '@nhs-portal/client-api';
import { format } from 'date-fns';
import { Button } from '@your-props/client/ui';

export default function AppointmentsList() {
  const { data, isLoading } = trpc.appointments.list.useQuery({
    limit: 50,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p style={{ color: 'var(--primary-color4)' }}>Loading appointments...</p>
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color2)' }}>
          My appointments
        </h1>
        <Button asChild variant="default" size="sm">
          <Link to="/appointments/book">Add appointment</Link>
        </Button>
      </div>
      {items.length === 0 ? (
        <div
          className="rounded-[10px] border p-8 text-center"
          style={{
            borderColor: 'rgba(138,138,160,0.3)',
            backgroundColor: 'var(--bg-section)',
            color: 'var(--primary-color4)',
          }}
        >
          <p>You have no appointments.</p>
          <Link
            to="/appointments/book"
            className="mt-2 inline-block underline"
            style={{ color: 'var(--primary-color3)' }}
          >
            Add an appointment
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((apt: any) => (
            <li
              key={apt.id}
              className="flex flex-wrap items-center justify-between rounded-[10px] border p-4"
              style={{
                borderColor: 'rgba(138,138,160,0.3)',
                backgroundColor: 'var(--bg-section)',
              }}
            >
              <div>
                <p className="font-medium" style={{ color: 'var(--primary-color2)' }}>
                  {apt.practitioner?.user?.name ?? 'Practitioner'}
                </p>
                <p className="text-sm" style={{ color: 'var(--primary-color4)' }}>
                  {apt.slot?.location?.name} · {apt.slot && format(new Date(apt.slot.startAt), 'PPp')}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--primary-color4)' }}>
                  Status: {apt.status}
                </p>
              </div>
              <span
                className="rounded-[4px] px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: apt.status === 'SCHEDULED' ? '#eeecff' : apt.status === 'COMPLETED' ? '#d4edda' : 'var(--primary-color5)',
                  color: apt.status === 'SCHEDULED' ? '#5142fc' : apt.status === 'COMPLETED' ? '#155724' : 'var(--primary-color4)',
                }}
              >
                {apt.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
