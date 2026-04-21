import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { trpc } from '@nhs-portal/client-api';
import { activeLocationIdsForApi, useLocationStore } from '@your-props/client/utils';

type SessionUser = {
  role?: string;
  practitionerId?: string;
};

function readSessionUser(): SessionUser {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}') as SessionUser;
  } catch {
    return {};
  }
}

function minutesToTimeValue(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function timeValueToMinutes(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 24 || mm < 0 || mm > 59) return null;
  if (hh === 24 && mm !== 0) return null;
  return hh * 60 + mm;
}

/** Every 30 minutes from 00:00 through 23:30 (start of a slot). */
const HALF_HOUR_START_MINUTES: number[] = (() => {
  const out: number[] = [];
  for (let m = 0; m < 24 * 60; m += 30) {
    out.push(m);
  }
  return out;
})();

const END_OF_DAY_MIN = 24 * 60;

/** Snap stored minutes to the nearest 30-minute boundary for the form. */
function snapStartMinutesForForm(m: number): number {
  const clamped = Math.max(0, Math.min(END_OF_DAY_MIN, m));
  const snapped = Math.round(clamped / 30) * 30;
  return Math.min(23 * 60 + 30, snapped);
}

function snapEndMinutesForForm(m: number): number {
  const clamped = Math.max(0, Math.min(END_OF_DAY_MIN, m));
  return Math.min(END_OF_DAY_MIN, Math.round(clamped / 30) * 30);
}

const DAY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

const SLOT_DURATION_OPTIONS = [10, 15, 20, 30, 45, 60];

type LocationOpt = { id: string; name: string };

type FormMode = 'add' | 'edit';

export default function DashboardAvailability() {
  const session = useMemo(() => readSessionUser(), []);
  const isAdmin = session.role === 'ADMIN';
  const selfPractitionerId = session.practitionerId;

  const storeLocations = useLocationStore((s) => s.locations);
  const setLocations = useLocationStore((s) => s.setLocations);
  const selectedLocationIds = useLocationStore((s) => s.selectedLocationIds);

  const locationsQuery = trpc.locations.list.useQuery();

  const locationsSorted = useMemo(
    () => [...(locationsQuery.data ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [locationsQuery.data]
  );
  const allLocationIds = useMemo(
    () => (storeLocations.length > 0 ? storeLocations : locationsSorted).map((l) => l.id),
    [storeLocations, locationsSorted]
  );
  const activeLocationIds = useMemo(
    () => activeLocationIdsForApi(selectedLocationIds, allLocationIds),
    [selectedLocationIds, allLocationIds]
  );

  useEffect(() => {
    if (locationsQuery.data && locationsQuery.data.length > 0 && storeLocations.length === 0) {
      setLocations(locationsQuery.data.map((l) => ({ id: l.id, name: l.name })));
    }
  }, [locationsQuery.data, storeLocations.length, setLocations]);

  /** All clinicians (admin): used for form target + clinic links, not for filtering the list. */
  const practitionersQuery = trpc.practitioners.list.useQuery({ limit: 500 }, { enabled: isAdmin });

  const selfPractitionerQuery = trpc.practitioners.byId.useQuery(
    { id: selfPractitionerId ?? '' },
    { enabled: !isAdmin && Boolean(selfPractitionerId) }
  );

  /** Admin only: clinician chosen in the add/edit form (upsert `practitionerId`). */
  const [adminFormPractitionerId, setAdminFormPractitionerId] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');

  const upsertPractitionerId = isAdmin ? adminFormPractitionerId : selfPractitionerId ?? '';

  const utils = trpc.useUtils();

  const listQueryInput = useMemo(
    () => ({
      ...(isAdmin ? { search: doctorSearch.trim() || undefined } : {}),
      ...(activeLocationIds?.length ? { locationIds: activeLocationIds } : {}),
    }),
    [isAdmin, doctorSearch, activeLocationIds]
  );

  const listQuery = trpc.availability.list.useQuery(listQueryInput, {
    enabled: isAdmin || Boolean(selfPractitionerId),
  });

  const upsert = trpc.availability.upsert.useMutation({
    onError: (e) => toast.error(e.message),
  });

  const remove = trpc.availability.delete.useMutation({
    onSuccess: async () => {
      toast.success('Availability removed');
      setFormOpen(false);
      setEditingWindowId(null);
      await Promise.all([listQuery.refetch(), utils.slots.available.invalidate()]);
    },
    onError: (e) => toast.error(e.message),
  });

  const formTargetPractitioner = useMemo(() => {
    if (!isAdmin || !adminFormPractitionerId) return null;
    const items = practitionersQuery.data?.items ?? [];
    return items.find((p) => p.id === adminFormPractitionerId) ?? null;
  }, [isAdmin, adminFormPractitionerId, practitionersQuery.data?.items]);

  const locationOptions: LocationOpt[] = useMemo(() => {
    if (isAdmin && formTargetPractitioner?.practitionerLocations?.length) {
      return formTargetPractitioner.practitionerLocations.map((pl) => ({
        id: pl.location.id,
        name: pl.location.name,
      }));
    }
    if (!isAdmin && selfPractitionerQuery.data?.practitionerLocations?.length) {
      return selfPractitionerQuery.data.practitionerLocations.map((pl) => ({
        id: pl.location.id,
        name: pl.location.name,
      }));
    }
    return [];
  }, [isAdmin, formTargetPractitioner, selfPractitionerQuery.data]);

  const practitionerHasNoClinics =
    !isAdmin &&
    !selfPractitionerQuery.isLoading &&
    Boolean(selfPractitionerId) &&
    locationOptions.length === 0;

  const canUseAvailability = !practitionerHasNoClinics && locationOptions.length > 0;

  const adminHasClinicians = (practitionersQuery.data?.items?.length ?? 0) > 0;
  const showAddAvailabilityButton = isAdmin ? adminHasClinicians : canUseAvailability;
  const showRowEditButton = isAdmin || canUseAvailability;

  /** Single shared form (add or edit), shown only when `formOpen` */
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [editingWindowId, setEditingWindowId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [slotDurationMin, setSlotDurationMin] = useState(30);

  const pickDefaultLocation = useCallback(
    (current: string, setter: (id: string) => void) => {
      if (locationOptions.length === 0) {
        setter('');
        return;
      }
      if (current && locationOptions.some((l) => l.id === current)) return;
      setter(locationOptions[0]!.id);
    },
    [locationOptions]
  );

  useEffect(() => {
    if (!formOpen) return;
    pickDefaultLocation(locationId, setLocationId);
  }, [formOpen, locationId, pickDefaultLocation, locationOptions]);

  const closeForm = () => {
    setFormOpen(false);
    setFormMode('add');
    setEditingWindowId(null);
    setDayOfWeek(1);
    setStartTime('09:00');
    setEndTime('12:00');
    setSlotDurationMin(30);
    if (isAdmin) {
      const items = practitionersQuery.data?.items ?? [];
      const pid = items[0]?.id ?? '';
      setAdminFormPractitionerId(pid);
      const firstLoc = items.find((x) => x.id === pid)?.practitionerLocations?.[0]?.location.id;
      setLocationId(firstLoc ?? '');
    } else if (locationOptions[0]?.id) {
      setLocationId(locationOptions[0].id);
    } else {
      setLocationId('');
    }
  };

  const openAddForm = () => {
    setFormMode('add');
    setEditingWindowId(null);
    setDayOfWeek(1);
    setStartTime('09:00');
    setEndTime('12:00');
    setSlotDurationMin(30);
    if (isAdmin) {
      const items = practitionersQuery.data?.items ?? [];
      const pid = adminFormPractitionerId || items[0]?.id || '';
      setAdminFormPractitionerId(pid);
      const firstLoc = items.find((x) => x.id === pid)?.practitionerLocations?.[0]?.location.id;
      setLocationId(firstLoc ?? '');
    } else if (locationOptions[0]?.id) {
      setLocationId(locationOptions[0].id);
    } else {
      setLocationId('');
    }
    setFormOpen(true);
  };

  const rows = listQuery.data ?? [];

  const openEditForm = (row: (typeof rows)[number]) => {
    setFormMode('edit');
    setEditingWindowId(row.id);
    if (isAdmin) {
      setAdminFormPractitionerId(row.practitionerId);
    }
    setLocationId(row.locationId);
    setDayOfWeek(row.dayOfWeek);
    const sm = snapStartMinutesForForm(row.windowStartMin);
    let em = snapEndMinutesForForm(row.windowEndMin);
    if (em <= sm) {
      em = Math.min(END_OF_DAY_MIN, sm + 30);
    }
    setStartTime(minutesToTimeValue(sm));
    setEndTime(minutesToTimeValue(em));
    setSlotDurationMin(row.slotDurationMin);
    setFormOpen(true);
  };

  const invalidateAfterSave = async () => {
    await Promise.all([listQuery.refetch(), utils.slots.available.invalidate()]);
  };

  const endTimeSelectOptions = useMemo(() => {
    const s = timeValueToMinutes(startTime) ?? 0;
    const opts: number[] = HALF_HOUR_START_MINUTES.filter((m) => m > s);
    if (END_OF_DAY_MIN > s) {
      opts.push(END_OF_DAY_MIN);
    }
    return opts;
  }, [startTime]);

  useEffect(() => {
    if (!formOpen) return;
    const valid = new Set(endTimeSelectOptions.map((m) => minutesToTimeValue(m)));
    if (!valid.has(endTime) && endTimeSelectOptions.length > 0) {
      setEndTime(minutesToTimeValue(endTimeSelectOptions[0]!));
    }
  }, [formOpen, endTime, endTimeSelectOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upsertPractitionerId) {
      toast.error(isAdmin ? 'Select a clinician' : 'Your account is not linked to a clinician profile');
      return;
    }
    const startMin = timeValueToMinutes(startTime);
    const endMin = timeValueToMinutes(endTime);
    if (startMin == null || endMin == null) {
      toast.error('Invalid start or end time');
      return;
    }
    if (endMin <= startMin) {
      toast.error('End time must be after start time');
      return;
    }
    try {
      await upsert.mutateAsync({
        ...(editingWindowId ? { id: editingWindowId } : {}),
        ...(isAdmin ? { practitionerId: upsertPractitionerId } : {}),
        locationId,
        dayOfWeek,
        windowStartMin: startMin,
        windowEndMin: endMin,
        slotDurationMin,
      });
      toast.success(formMode === 'edit' ? 'Availability window updated' : 'Availability window added');
      closeForm();
      await invalidateAfterSave();
    } catch {
      /* toast via mutation */
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto px-5 py-6 lg:px-8 lg:py-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color4)' }}>
        Scheduling
      </p>
      <h1 className="mt-1 text-xl font-bold text-white">Clinician availability</h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--primary-color4)' }}>
        Weekly templates generate bookable appointment slots for the next 90 days. Patients can only book times that
        match these rules. The table below follows the header or sidebar location filter; show all clinics when no
        specific locations are selected.
      </p>

      {!isAdmin ? (
        <p className="mt-3 text-sm text-white/70">
          You can only add or edit availability for clinics you are registered to.
        </p>
      ) : null}

      {isAdmin && !adminHasClinicians && !practitionersQuery.isLoading ? (
        <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          No clinicians are registered yet. Add a clinician first, then configure availability windows here.
        </p>
      ) : null}

      {practitionerHasNoClinics ? (
        <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          You are not linked to any clinic yet. Ask an administrator to assign you to one or more clinics before you
          can set availability.
        </p>
      ) : null}

      {!isAdmin && selfPractitionerQuery.isLoading ? (
        <p className="mt-8 text-sm" style={{ color: 'var(--primary-color4)' }}>
          Loading your clinic assignments...
        </p>
      ) : null}

      <div className="mt-10 min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">Configured windows</h2>
          <div className="flex flex-wrap items-center gap-3">
            {listQuery.isFetching ? (
              <span className="text-xs" style={{ color: 'var(--primary-color4)' }}>
                Refreshing...
              </span>
            ) : null}
            {showAddAvailabilityButton ? (
              <button
                type="button"
                onClick={openAddForm}
                className="rounded-lg bg-[#ef6b3b] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
              >
                Add availability
              </button>
            ) : null}
          </div>
        </div>

        {isAdmin ? (
          <label className="mt-4 flex w-full min-w-0 max-w-md flex-col gap-1 text-sm text-white">
            Search by clinician name
            <input
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              placeholder="Name or email..."
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder:text-white/30"
            />
          </label>
        ) : null}

        {formOpen ? (
          <section className="mb-6 mt-4 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 p-5 lg:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {formMode === 'edit' ? 'Edit availability window' : 'Add availability window'}
                </h3>
                <p className="mt-1 text-xs" style={{ color: 'var(--primary-color4)' }}>
                  {formMode === 'edit'
                    ? 'Update this weekly rule, then save. Slots for the next 90 days are refreshed for the affected day.'
                    : 'Create a new weekly rule. Existing rows stay unchanged until you save.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
              {isAdmin ? (
                <label className="flex flex-col gap-1 text-sm text-white">
                  Clinician
                  <select
                    required
                    disabled={formMode === 'edit'}
                    title={
                      formMode === 'edit'
                        ? 'Clinician cannot be changed when editing a window. Delete it and add a new one to assign a different clinician.'
                        : undefined
                    }
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    value={adminFormPractitionerId}
                    onChange={(e) => setAdminFormPractitionerId(e.target.value)}
                  >
                    {(practitionersQuery.data?.items ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.user?.name ?? p.user?.email ?? p.id}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="flex flex-col gap-1 text-sm text-white">
                Clinic
                <select
                  required
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  {locationOptions.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-white">
                Day
                <select
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                >
                  {DAY_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </label>

              <p className="text-xs" style={{ color: 'var(--primary-color4)' }}>
                Times are in 30-minute steps. End must be later than start (same day, up to 24:00).
              </p>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm text-white">
                  Start
                  <select
                    required
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                    value={startTime}
                    onChange={(e) => {
                      const next = e.target.value;
                      const sm = timeValueToMinutes(next) ?? 0;
                      const em = timeValueToMinutes(endTime) ?? 0;
                      setStartTime(next);
                      if (em <= sm) {
                        const bumped = Math.min(END_OF_DAY_MIN, sm + 30);
                        setEndTime(minutesToTimeValue(bumped));
                      }
                    }}
                  >
                    {HALF_HOUR_START_MINUTES.map((m) => {
                      const v = minutesToTimeValue(m);
                      return (
                        <option key={m} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-white">
                  End
                  <select
                    required
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    {endTimeSelectOptions.map((m) => {
                      const v = minutesToTimeValue(m);
                      return (
                        <option key={m} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1 text-sm text-white">
                Slot length (minutes)
                <select
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={slotDurationMin}
                  onChange={(e) => setSlotDurationMin(Number(e.target.value))}
                >
                  {SLOT_DURATION_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={upsert.isPending || !upsertPractitionerId}
                  className="rounded-lg bg-[#ef6b3b] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
                >
                  {upsert.isPending ? 'Saving...' : formMode === 'edit' ? 'Save changes' : 'Add window'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {listQuery.isLoading ? (
          <p className="mt-4 text-sm" style={{ color: 'var(--primary-color4)' }}>
            Loading...
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-sm" style={{ color: 'var(--primary-color4)' }}>
            {isAdmin
              ? doctorSearch.trim()
                ? 'No availability matches this search.'
                : 'No availability windows yet. Click Add availability to open the form and create one.'
              : 'No availability yet. Click Add availability to open the form and create your first window.'}
          </p>
        ) : (
          <div className="mt-4 overflow-auto rounded-xl border border-white/10">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="bg-black/30 text-xs uppercase tracking-wide text-white/60">
                <tr>
                  {isAdmin ? <th className="px-3 py-2">Clinician</th> : null}
                  <th className="px-3 py-2">Day</th>
                  <th className="px-3 py-2">Clinic</th>
                  <th className="px-3 py-2">Window</th>
                  <th className="px-3 py-2">Slot</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const dayLabel = DAY_OPTIONS.find((d) => d.value === r.dayOfWeek)?.label ?? String(r.dayOfWeek);
                  const isSelected = formOpen && formMode === 'edit' && editingWindowId === r.id;
                  const clinicianLabel =
                    r.practitioner?.user?.name ?? r.practitioner?.user?.email ?? '—';
                  return (
                    <tr
                      key={r.id}
                      className={`border-t border-white/10 ${isSelected ? 'bg-white/[0.06]' : ''}`}
                    >
                      {isAdmin ? (
                        <td className="px-3 py-2" style={{ color: 'var(--primary-color4)' }}>
                          {clinicianLabel}
                        </td>
                      ) : null}
                      <td className="px-3 py-2">{dayLabel}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--primary-color4)' }}>
                        {r.location?.name ?? r.locationId}
                      </td>
                      <td className="px-3 py-2">
                        {minutesToTimeValue(r.windowStartMin)}–{minutesToTimeValue(r.windowEndMin)}
                      </td>
                      <td className="px-3 py-2">{r.slotDurationMin}m</td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex items-center justify-end gap-2 whitespace-nowrap">
                          {showRowEditButton ? (
                            <button
                              type="button"
                              className="rounded-lg border border-white/15 px-2 py-1 text-xs text-white/80 hover:bg-white/5"
                              onClick={() => openEditForm(r)}
                            >
                              Edit
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="rounded-lg border border-red-400/30 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10 disabled:opacity-50"
                            disabled={remove.isPending}
                            onClick={() => remove.mutate({ id: r.id })}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
