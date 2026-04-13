import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight, Search } from 'lucide-react';
import { trpc } from '@nhs-portal/client-api';
import { activeLocationIdsForApi, useLocationStore } from '@your-props/client/utils';

const ACCENT_ORANGE = '#ef6b3b';

export type DashboardAppointmentsUrlFilters = {
  practitionerId?: string;
  patientId?: string;
};

function buildBookedListHref(appointmentId: string, filters?: DashboardAppointmentsUrlFilters) {
  const sp = new URLSearchParams();
  sp.set('appointmentId', appointmentId);
  if (filters?.practitionerId) sp.set('practitionerId', filters.practitionerId);
  if (filters?.patientId) sp.set('patientId', filters.patientId);
  return `/dashboard/appointments?${sp.toString()}`;
}

function patientDisplayName(apt: {
  patient?: { user?: { name?: string | null; email?: string | null } | null } | null;
}): string {
  const u = apt.patient?.user;
  return (u?.name?.trim() || u?.email?.trim() || 'Patient') as string;
}

function practitionerDisplayName(apt: {
  practitioner?: { user?: { name?: string | null } | null } | null;
}): string {
  return apt.practitioner?.user?.name?.trim() || 'Clinician';
}

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

function appointmentStatusLabel(status: string | undefined | null): string {
  if (!status) return 'Unknown';
  return status
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
  SCHEDULED: 'border border-sky-400/40 bg-sky-500/15 text-sky-100',
  COMPLETED: 'border border-emerald-400/40 bg-emerald-500/15 text-emerald-100',
  CANCELLED: 'border border-rose-400/40 bg-rose-500/15 text-rose-100',
  NO_SHOW: 'border border-amber-400/40 bg-amber-500/15 text-amber-100',
};

function appointmentStatusBadgeClass(status: string | undefined | null): string {
  const base =
    'inline-flex max-w-[min(100%,9rem)] shrink-0 items-center justify-center rounded-md px-4 py-2 text-center text-[12px] font-semibold leading-tight tracking-wide';
  if (!status) return `${base} border border-white/20 bg-white/10 text-white/80`;
  return `${base} ${STATUS_BADGE_CLASSES[status] ?? 'border border-violet-400/40 bg-violet-500/15 text-violet-100'}`;
}

type ListMode = 'home' | 'booked';

type DashboardAppointmentsListProps = {
  mode?: ListMode;
  /** When set (booked page), restricts the API list and is preserved in row links. */
  urlFilters?: DashboardAppointmentsUrlFilters;
};

export function DashboardAppointmentsList({ mode = 'home', urlFilters }: DashboardAppointmentsListProps) {
  const [query, setQuery] = useState('');
  const isBooked = mode === 'booked';

  const storeLocations = useLocationStore((s) => s.locations);
  const selectedLocationIds = useLocationStore((s) => s.selectedLocationIds);
  const setLocations = useLocationStore((s) => s.setLocations);
  const locationsQuery = trpc.locations.list.useQuery();

  useEffect(() => {
    if (locationsQuery.data && locationsQuery.data.length > 0 && storeLocations.length === 0) {
      setLocations(locationsQuery.data.map((l) => ({ id: l.id, name: l.name })));
    }
  }, [locationsQuery.data, storeLocations.length, setLocations]);

  const allLocationIds = useMemo(
    () =>
      storeLocations.length > 0
        ? storeLocations.map((l) => l.id)
        : (locationsQuery.data ?? []).map((l) => l.id),
    [storeLocations, locationsQuery.data]
  );
  const activeIds = useMemo(
    () => activeLocationIdsForApi(selectedLocationIds, allLocationIds),
    [selectedLocationIds, allLocationIds]
  );

  const { data, isLoading } = trpc.appointments.list.useQuery({
    limit: isBooked ? 200 : 80,
    ...(urlFilters?.practitionerId ? { practitionerId: urlFilters.practitionerId } : {}),
    ...(urlFilters?.patientId ? { patientId: urlFilters.patientId } : {}),
    ...(activeIds?.length ? { locationIds: activeIds } : {}),
  });

  const items = useMemo(() => {
    const raw = data?.items ?? [];
    return [...raw].sort((a, b) => {
      const ta = new Date(a.slot?.startAt ?? 0).getTime();
      const tb = new Date(b.slot?.startAt ?? 0).getTime();
      return tb - ta;
    });
  }, [data?.items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((apt) => {
      const patient = patientDisplayName(apt).toLowerCase();
      const doctor = practitionerDisplayName(apt).toLowerCase();
      const when = apt.slot?.startAt
        ? format(new Date(apt.slot.startAt), 'PPpp').toLowerCase()
        : '';
      const reason = (apt.reason ?? '').toLowerCase();
      const notes = (apt.notes ?? '').toLowerCase();
      const loc = (apt.slot?.location?.name ?? '').toLowerCase();
      const statusText = appointmentStatusLabel(apt.status).toLowerCase();
      return (
        patient.includes(q) ||
        doctor.includes(q) ||
        when.includes(q) ||
        reason.includes(q) ||
        notes.includes(q) ||
        loc.includes(q) ||
        statusText.includes(q)
      );
    });
  }, [items, query]);

  const listTitle = isBooked ? 'Booked appointments' : 'All appointments';
  const persist = isBooked ? urlFilters : undefined;

  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        {!isBooked ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color4)' }}>
              Schedule
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-wide text-white sm:text-xl">Appointments</h2>
          </div>
        ) : (
          <span className="sr-only">Booked appointments list</span>
        )}
        <Link
          to="/appointments/book"
          className="text-sm font-semibold transition hover:opacity-90 sm:ml-auto"
          style={{ color: ACCENT_ORANGE }}
        >
          + Open calendar
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 opacity-50"
            style={{ color: 'var(--primary-color4)' }}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient, doctor, date or reason"
            className="h-10 w-full rounded-full border border-white/[0.1] bg-white/[0.06] py-2 pr-3 pl-10 text-sm text-white outline-none ring-offset-0 placeholder:text-white/40 focus:border-white/20 focus:ring-1 focus:ring-white/15"
            aria-label="Search appointments"
          />
        </div>
      </div>

      <div className="w-full min-w-0">
        <div className="mb-4 flex items-center border-b border-white/[0.07] px-1 py-6">
          <span className="text-sm font-semibold text-white">{listTitle}</span>
          <span className="ml-2 text-xs tabular-nums" style={{ color: 'var(--primary-color4)' }}>
            ({filtered.length} shown)
          </span>
        </div>

        {isLoading ? (
          <p className="px-4 py-8 text-sm" style={{ color: 'var(--primary-color4)' }}>
            Loading appointments…
          </p>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-8 text-sm" style={{ color: 'var(--primary-color4)' }}>
            {items.length === 0 ? 'No appointments yet.' : 'No matches for your search.'}
          </p>
        ) : (
          <ul className="w-full min-w-0">
            {filtered.map((apt) => {
              const patient = patientDisplayName(apt);
              const doctor = practitionerDisplayName(apt);
              const start = apt.slot?.startAt ? new Date(apt.slot.startAt) : null;
              const end = apt.slot?.endAt ? new Date(apt.slot.endAt) : null;
              const dateLine =
                start && end
                  ? `${format(start, 'EEEE, d MMMM yyyy')} · ${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`
                  : 'Date TBC';
              const detailParts: string[] = [];
              if (apt.reason?.trim()) detailParts.push(apt.reason.trim());
              if (apt.notes?.trim()) detailParts.push(apt.notes.trim());
              if (apt.slot?.location?.name) detailParts.push(apt.slot.location.name);
              const detailLine = detailParts.length > 0 ? detailParts.join(' · ') : 'No extra details';
              const statusLabel = appointmentStatusLabel(apt.status);

              return (
                <li
                  key={apt.id}
                  className="first:border-t border-b border-solid border-[rgba(255,255,255,0.07)] transition-colors hover:border-t hover:border-[rgba(239,107,59,0.65)]"
                >
                  <Link
                    to={buildBookedListHref(apt.id, persist)}
                    className="group flex w-full min-w-0 items-center gap-4 bg-transparent px-0 py-3.5 transition-colors hover:bg-[rgba(239,107,59,0.1)]"
                  >
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      aria-hidden
                    >
                      {initials(patient)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-white">{patient}</p>
                      <p className="mt-0.5 truncate text-sm" style={{ color: 'var(--primary-color4)' }}>
                        {dateLine} · {doctor}
                      </p>
                      <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--primary-color4)' }}>
                        {detailLine}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <span className={appointmentStatusBadgeClass(apt.status)} title={statusLabel}>
                        {statusLabel}
                      </span>
                      <ChevronRight
                        className="size-12 ml-2 shrink-0 opacity-40 transition group-hover:opacity-90"
                        style={{ color: ACCENT_ORANGE }}
                        aria-hidden
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
