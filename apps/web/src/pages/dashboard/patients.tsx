import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import type { inferRouterOutputs } from '@trpc/server';
import { trpc, type AppRouter } from '@nhs-portal/client-api';
import { useLocationStore } from '@your-props/client/utils';

const ACCENT_ORANGE = '#ef6b3b';

type PatientRow = inferRouterOutputs<AppRouter>['patients']['list']['items'][number];

export default function DashboardPatients() {
  const selectedLocationId = useLocationStore((s) => s.selectedLocationId);

  const { data, isLoading } = trpc.patients.list.useQuery({
    limit: 250,
    ...(selectedLocationId && selectedLocationId !== 'all' ? { locationId: selectedLocationId } : {}),
  });

  const items = data?.items ?? [];

  const sections = useMemo(() => {
    if (!items.length) return [] as { locationId: string; locationName: string; rows: PatientRow[] }[];

    if (selectedLocationId && selectedLocationId !== 'all') {
      const name = items[0]?.location?.name ?? 'Selected location';
      return [{ locationId: selectedLocationId, locationName: name, rows: items }];
    }

    const map = new Map<string, { locationName: string; rows: PatientRow[] }>();
    for (const p of items) {
      const id = p.location?.id ?? '__none__';
      const locationName = p.location?.name ?? 'No location on file';
      if (!map.has(id)) {
        map.set(id, { locationName, rows: [] });
      }
      map.get(id)!.rows.push(p);
    }
    const entries = [...map.entries()].sort((a, b) => {
      if (a[0] === '__none__') return 1;
      if (b[0] === '__none__') return -1;
      return a[1].locationName.localeCompare(b[1].locationName);
    });
    return entries.map(([locationId, v]) => ({
      locationId,
      locationName: v.locationName,
      rows: v.rows,
    }));
  }, [items, selectedLocationId]);

  if (isLoading) {
    return (
      <div className="px-5 py-8" style={{ color: 'var(--primary-color4)' }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color4)' }}>
          Directory
        </p>
        <h1 className="mt-1 text-xl font-bold text-white">Patients</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--primary-color4)' }}>
          Grouped by registered clinic. Use the sidebar to filter by a single location.
        </p>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--primary-color4)' }}>
          No patients match this filter.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div key={section.locationId} className="w-full">
              <div
                className="mb-2 flex items-center gap-2 border-b border-white/[0.1] pb-2"
                style={{ color: 'var(--primary-color4)' }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Location:</span>
                <span className="text-sm font-semibold text-white">{section.locationName}</span>
              </div>
              <ul className="w-full overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04]">
                {section.rows.map((p) => {
                  const display = p.user?.name ?? p.user?.email ?? '—';
                  const dob = p.dateOfBirth ? format(new Date(p.dateOfBirth), 'd MMM yyyy') : '—';

                  return (
                    <li
                      key={p.id}
                      className="first:border-t border-b border-solid border-[rgba(255,255,255,0.07)] transition-colors hover:border-t hover:border-[rgba(239,107,59,0.65)]"
                    >
                      <Link
                        to={`/dashboard/appointments?patientId=${encodeURIComponent(p.id)}`}
                        className="group flex w-full items-center gap-4 bg-transparent px-4 py-3.5 transition-colors hover:bg-[rgba(239,107,59,0.1)]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-white">{display}</p>
                          <div className="mt-0.5 text-sm" style={{ color: 'var(--primary-color4)' }}>
                            <p>NHS {p.nhsNumber}</p>
                            <p>DOB {dob}</p>
                          </div>
                          <p className="mt-1 text-xs" style={{ color: 'var(--primary-color4)' }}>
                            View booked appointments
                          </p>
                        </div>
                        <ChevronRight
                          className="size-5 shrink-0 opacity-40 transition group-hover:opacity-90"
                          style={{ color: ACCENT_ORANGE }}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
