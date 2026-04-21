import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { inferRouterOutputs } from '@trpc/server';
import { ChevronRight } from 'lucide-react';
import { trpc, type AppRouter } from '@nhs-portal/client-api';
import { activeLocationIdsForApi, useLocationStore } from '@your-props/client/utils';
import { useFetchNextPageNearScrollEnd } from '../../hooks/useFetchNextPageNearScrollEnd';

const ACCENT_ORANGE = '#ef6b3b';
const PAGE_SIZE = 20;

type DoctorRow = inferRouterOutputs<AppRouter>['practitioners']['list']['items'][number];
type PractitionerLocationRow = NonNullable<DoctorRow['practitionerLocations']>[number];

function initials(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0];
    const b = parts[parts.length - 1]?.[0];
    if (a && b) return `${a}${b}`.toUpperCase();
  }
  if (parts[0]?.length >= 2) return parts[0].slice(0, 2).toUpperCase();
  if (parts[0]?.length === 1) return `${parts[0]}`.toUpperCase();
  return '—';
}

export default function DashboardDoctors() {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const storeLocations = useLocationStore((s) => s.locations);
  const selectedLocationIds = useLocationStore((s) => s.selectedLocationIds);

  const { data: locationsData } = trpc.locations.list.useQuery();
  const locations = useMemo(
    () => [...(locationsData ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [locationsData]
  );
  const allLocationIds = useMemo(
    () => (storeLocations.length > 0 ? storeLocations : locations).map((l) => l.id),
    [storeLocations, locations]
  );
  const activeIds = useMemo(
    () => activeLocationIdsForApi(selectedLocationIds, allLocationIds),
    [selectedLocationIds, allLocationIds]
  );

  const listInput = useMemo(
    () => ({
      limit: PAGE_SIZE,
      ...(activeIds?.length ? { locationIds: activeIds } : {}),
    }),
    [activeIds]
  );

  const {
    data,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = trpc.practitioners.list.useInfiniteQuery(listInput, {
    getNextPageParam: (last) => last.nextCursor,
  });

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data?.pages]);

  useFetchNextPageNearScrollEnd({
    scrollRootRef,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
  });

  const sections = useMemo(() => {
    if (!items.length) return [] as { locationId: string; locationName: string; rows: DoctorRow[] }[];

    if (activeIds?.length === 1) {
      const id = activeIds[0]!;
      const loc = locations.find((l) => l.id === id);
      return [
        {
          locationId: id,
          locationName: loc?.name ?? 'Selected location',
          rows: items,
        },
      ];
    }

    const locsToGroup =
      activeIds && activeIds.length > 0 ? locations.filter((l) => activeIds.includes(l.id)) : locations;

    const out: { locationId: string; locationName: string; rows: DoctorRow[] }[] = [];
    for (const loc of locsToGroup) {
      const rows = items.filter((row) =>
        row.practitionerLocations?.some((pl: PractitionerLocationRow) => pl.locationId === loc.id)
      );
      if (rows.length > 0) {
        out.push({ locationId: loc.id, locationName: loc.name, rows });
      }
    }
    return out;
  }, [items, locations, activeIds]);

  if (isPending) {
    return (
      <div className="px-5 py-8" style={{ color: 'var(--primary-color4)' }}>
        Loading…
      </div>
    );
  }

  return (
    <div
      ref={scrollRootRef}
      className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto px-5 py-6 lg:px-8 lg:py-8"
    >
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color4)' }}>
          Directory
        </p>
        <h1 className="mt-1 text-xl font-bold text-white">Doctors & clinicians</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--primary-color4)' }}>
          Grouped by clinic. Use the sidebar location filter to narrow the list. Click a doctor to see their
          appointments.
        </p>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--primary-color4)' }}>
          No clinicians match this filter.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div key={section.locationId} className="w-full">
              <div
                className="mb-2 flex items-center gap-2 border-b border-white/[0.1] pb-2"
                style={{ color: 'var(--primary-color4)' }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Location</span>
                <span className="text-sm font-semibold text-white">{section.locationName}</span>
              </div>
              <ul className="w-full overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04]">
                {section.rows.map((row) => {
                  const name = row.user?.name ?? row.user?.email ?? 'Clinician';
                  const locs =
                    row.practitionerLocations?.map((pl: PractitionerLocationRow) => pl.location?.name).filter(Boolean) ??
                    [];
                  const locLine =
                    activeIds?.length === 1
                      ? section.locationName
                      : locs.length > 0
                        ? locs.join(' · ')
                        : 'No linked locations';

                  return (
                    <li
                      key={`${section.locationId}-${row.id}`}
                      className="first:border-t border-b border-solid border-[rgba(255,255,255,0.07)] transition-colors hover:border-t hover:border-[rgba(239,107,59,0.65)]"
                    >
                      <Link
                        to={`/dashboard/appointments?practitionerId=${encodeURIComponent(row.id)}`}
                        className="group flex w-full items-center gap-4 bg-transparent px-4 py-3.5 transition-colors hover:bg-[rgba(239,107,59,0.1)]"
                      >
                        <div
                          className="flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                          aria-hidden
                        >
                          {initials(name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-white">{name}</p>
                          <p className="text-sm" style={{ color: 'var(--primary-color4)' }}>
                            {[row.title, row.speciality].filter(Boolean).join(' · ') || 'Clinician'}
                          </p>
                          <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--primary-color4)' }}>
                            {locLine}
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

      {isFetchingNextPage ? (
        <p className="py-6 text-center text-sm" style={{ color: 'var(--primary-color4)' }}>
          Loading more…
        </p>
      ) : null}
    </div>
  );
}
