import { trpc } from '@nhs-portal/client-api';

export default function DashboardPatients() {
  const { data, isLoading } = trpc.patients.list.useQuery({ limit: 50 });

  if (isLoading) {
    return (
      <div className="p-8" style={{ color: 'var(--primary-color4)' }}>
        Loading...
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color2)' }}>
        Patients
      </h1>
      {items.length === 0 ? (
        <p className="mt-4" style={{ color: 'var(--primary-color4)' }}>
          No patients. Add via API or registration.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex justify-between rounded-[10px] border px-4 py-3"
              style={{
                borderColor: 'rgba(138,138,160,0.3)',
                backgroundColor: 'var(--bg-section)',
              }}
            >
              <span className="font-medium" style={{ color: 'var(--primary-color2)' }}>
                {p.user?.name ?? p.user?.email ?? '—'}
              </span>
              <span style={{ color: 'var(--primary-color4)' }}>NHS No. {p.nhsNumber}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
