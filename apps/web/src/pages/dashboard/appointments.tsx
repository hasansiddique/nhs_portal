import { trpc } from '@nhs-portal/client-api';
import { format } from 'date-fns';

export default function DashboardAppointments() {
  const { data, isLoading } = trpc.appointments.list.useQuery({ limit: 100 });

  if (isLoading) {
    return (
      <div className="p-8" style={{ color: 'var(--primary-color4)' }}>
        Loading...
      </div>
    );
  }

  const items = data?.items ?? [];
  const borderStyle = { borderColor: 'rgba(138,138,160,0.3)' };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color2)' }}>
        Appointments
      </h1>
      {items.length === 0 ? (
        <p className="mt-4" style={{ color: 'var(--primary-color4)' }}>
          No appointments.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border" style={borderStyle}>
            <thead>
              <tr style={{ backgroundColor: 'var(--primary-color5)' }}>
                <th className="border px-4 py-2 text-left" style={{ ...borderStyle, color: 'var(--primary-color2)' }}>Patient</th>
                <th className="border px-4 py-2 text-left" style={{ ...borderStyle, color: 'var(--primary-color2)' }}>Practitioner</th>
                <th className="border px-4 py-2 text-left" style={{ ...borderStyle, color: 'var(--primary-color2)' }}>Date & time</th>
                <th className="border px-4 py-2 text-left" style={{ ...borderStyle, color: 'var(--primary-color2)' }}>Location</th>
                <th className="border px-4 py-2 text-left" style={{ ...borderStyle, color: 'var(--primary-color2)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((apt) => (
                <tr key={apt.id}>
                  <td className="border px-4 py-2" style={{ ...borderStyle, color: 'var(--primary-color2)' }}>
                    {apt.patient?.user?.name ?? apt.patient?.user?.email ?? '—'}
                  </td>
                  <td className="border px-4 py-2" style={{ ...borderStyle, color: 'var(--primary-color2)' }}>
                    {apt.practitioner?.user?.name ?? '—'}
                  </td>
                  <td className="border px-4 py-2" style={{ ...borderStyle, color: 'var(--primary-color4)' }}>
                    {apt.slot?.startAt && format(new Date(apt.slot.startAt), 'PPp')}
                  </td>
                  <td className="border px-4 py-2" style={{ ...borderStyle, color: 'var(--primary-color4)' }}>
                    {apt.slot?.location?.name ?? '—'}
                  </td>
                  <td className="border px-4 py-2" style={{ ...borderStyle, color: 'var(--primary-color4)' }}>{apt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
