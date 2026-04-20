import { Fragment, useEffect, useMemo, useState } from 'react';
import { activeLocationIdsForApi, useLocationStore } from '@your-props/client/utils';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isFirstDayOfMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  addMonths,
} from 'date-fns';
import { isEmpty } from 'lodash';
import Cookies from 'js-cookie';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'sonner';
import { trpc } from '@nhs-portal/client-api';
import { Button, Input, Label, Textarea } from '@your-props/client/ui';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

type CalendarAppointment = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  practitionerId: string;
  locationId: string;
  patientName: string;
  practitionerName: string;
  locationName: string;
  status: string;
  rawStatus: string;
};

function getSessionUser(): {
  role?: string;
  patientId?: string;
  practitionerId?: string;
} {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

/** Match reference calendar (dark grid UI) */
const CAL_BG = '#0f1016';
/** Uniform 1px hairline on dark calendar chrome (~7% white) */
const CAL_BD = 'border-[1px] border-solid border-white/[0.07]';
const CAL_BD_B = 'border-b-[1px] border-solid border-white/[0.07]';
const CAL_BD_L = 'border-l-[1px] border-solid border-white/[0.07]';
const CAL_BD_RB = 'border-r-[1px] border-b-[1px] border-solid border-white/[0.07]';
const CAL_BD_LT = 'border-l-[1px] border-t-[1px] border-solid border-white/[0.07]';
const CAL_MUTED = '#8a8d98';
const CAL_TEXT = '#ffffff';
/** Selected day highlight (matches prior portal accent) */
const CAL_SELECTED_ORANGE = '#ef6b3b';

const CAL_STATUS_SCHEDULED = '#60a5fa';
const CAL_STATUS_COMPLETED = '#34d399';
const CAL_STATUS_CANCELLED = '#f87171';

function appointmentStatusDotColor(status: string): string {
  switch (status) {
    case 'SCHEDULED':
      return CAL_STATUS_SCHEDULED;
    case 'COMPLETED':
      return CAL_STATUS_COMPLETED;
    case 'CANCELLED':
      return CAL_STATUS_CANCELLED;
    default:
      return 'rgba(255,255,255,0.35)';
  }
}

function buildCalendarDays(currentMonth: Date) {
  const monthStart = startOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
  const days: Date[] = [];

  for (let cursor = calendarStart; cursor <= calendarEnd; cursor = addDays(cursor, 1)) {
    days.push(cursor);
  }

  return days;
}

function toTimeLabel(date: Date) {
  return format(date, 'HH:mm');
}

/** First meaningful word (skip Dr/Mr/Mrs/Ms/Prof for practitioners). */
function personFirstName(label: string, skipHonorifics: boolean): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  let i = 0;
  if (skipHonorifics) {
    while (i < parts.length && /^(dr|mr|mrs|ms|prof)\.?$/i.test(parts[i]!)) {
      i += 1;
    }
  }
  return parts[i] ?? parts[0] ?? '';
}

function calendarEventBirdsEyeLine(appointment: CalendarAppointment): string {
  const time = toTimeLabel(appointment.startAt);
  const patient = personFirstName(appointment.patientName, false) || 'Patient';
  const doctor = personFirstName(appointment.practitionerName, true) || 'Doctor';
  return `${time} - ${patient} -> ${doctor}`;
}

/** Must match `ThemeLayout` main `pt-[96px]` so overlays sit below the fixed header */
const HEADER_OFFSET_PX = 96;

function trpcErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
}

export function AppointmentCalendarModule() {
  const utils = trpc.useUtils();
  const isSignedIn = !isEmpty(Cookies.get('token'));
  const session = getSessionUser();
  const staffCanManage = session.role === 'ADMIN' || session.role === 'PRACTITIONER';
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] = useState<CalendarAppointment | null>(null);
  const [morePopup, setMorePopup] = useState<{
    date: Date;
    appointments: CalendarAppointment[];
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [practitionerId, setPractitionerId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [reason, setReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [practitionerFilter, setPractitionerFilter] = useState<string>('all');
  const [staffPatientId, setStaffPatientId] = useState('');
  const [detailEditStatus, setDetailEditStatus] = useState<string>('SCHEDULED');
  const [detailEditNotes, setDetailEditNotes] = useState('');

  const calendarDays = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);
  const calendarWeeks = useMemo(() => {
    const weeks: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    return weeks;
  }, [calendarDays]);
  const rangeStart = calendarDays[0];
  const rangeEnd = addDays(calendarDays[calendarDays.length - 1], 1);

  const storeLocations = useLocationStore((s) => s.locations);
  const selectedLocationIds = useLocationStore((s) => s.selectedLocationIds);
  const setLocations = useLocationStore((s) => s.setLocations);
  const locationsQuery = trpc.locations.list.useQuery();
  const apiLocations = locationsQuery.data ?? [];

  useEffect(() => {
    if (locationsQuery.data && locationsQuery.data.length > 0 && storeLocations.length === 0) {
      setLocations(locationsQuery.data.map((l) => ({ id: l.id, name: l.name })));
    }
  }, [locationsQuery.data, storeLocations.length, setLocations]);

  const allLocationIds = useMemo(
    () => (storeLocations.length > 0 ? storeLocations : apiLocations).map((l) => l.id),
    [storeLocations, apiLocations]
  );
  const activeIds = useMemo(
    () => activeLocationIdsForApi(selectedLocationIds, allLocationIds),
    [selectedLocationIds, allLocationIds]
  );

  const drawerLocations = useMemo(() => {
    if (activeIds?.length) return apiLocations.filter((l) => activeIds.includes(l.id));
    return apiLocations;
  }, [apiLocations, activeIds]);

  const appointmentsQuery = trpc.appointments.list.useQuery(
    {
      from: rangeStart,
      to: rangeEnd,
      limit: 200,
      ...(activeIds?.length ? { locationIds: activeIds } : {}),
    },
    { enabled: isSignedIn }
  );
  const practitionersQuery = trpc.practitioners.list.useQuery(
    { limit: 100, ...(activeIds?.length ? { locationIds: activeIds } : {}) },
    { enabled: isSignedIn }
  );
  const staffPatientsQuery = trpc.patients.list.useQuery(
    { limit: 200, ...(activeIds?.length ? { locationIds: activeIds } : {}) },
    { enabled: isSignedIn && staffCanManage && drawerOpen }
  );

  const slotDayStart = useMemo(() => startOfDay(selectedDate), [selectedDate]);
  const slotDayEndExclusive = useMemo(() => addDays(slotDayStart, 1), [slotDayStart]);

  const availableSlotsQuery = trpc.slots.available.useQuery(
    {
      practitionerId,
      locationId,
      from: slotDayStart,
      to: slotDayEndExclusive,
    },
    { enabled: drawerOpen && Boolean(practitionerId && locationId) }
  );
  const availableSlots = availableSlotsQuery.data ?? [];

  const createAppointment = trpc.appointments.create.useMutation({
    onSuccess: async () => {
      await utils.appointments.list.invalidate();
      await utils.slots.available.invalidate();
      toast.success('Appointment created');
      setDrawerOpen(false);
      setReason('');
      setSelectedSlotId(null);
      setStaffPatientId('');
    },
    onError: (error) => {
      toast.error(trpcErrorMessage(error));
    },
  });

  const updateAppointmentStatus = trpc.appointments.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.appointments.list.invalidate();
      toast.success('Appointment updated');
      setDetailAppointment(null);
    },
    onError: (error) => {
      toast.error(trpcErrorMessage(error));
    },
  });

  const practitioners = practitionersQuery.data?.items ?? [];

  const appointments = useMemo<CalendarAppointment[]>(
    () =>
      (appointmentsQuery.data?.items ?? []).map((appointment: any) => {
        const startAt = new Date(appointment.slot.startAt);
        const endAt = new Date(appointment.slot.endAt);

        // If the event date has passed and it wasn't marked attended (COMPLETED),
        // treat it as cancelled in the calendar UI.
        const rawStatus = String(appointment.status ?? '');
        const status =
          rawStatus === 'COMPLETED'
            ? 'COMPLETED'
            : endAt.getTime() < Date.now()
              ? 'CANCELLED'
              : rawStatus === 'NO_SHOW'
                ? 'CANCELLED'
                : rawStatus;

        return {
          id: appointment.id,
          title: appointment.reason?.trim() || 'Appointment',
          startAt,
          endAt,
          practitionerId: appointment.practitionerId,
          locationId: appointment.slot.location.id,
          patientName:
            appointment.patient?.user?.name?.trim() ||
            appointment.patient?.user?.email ||
            'Patient',
          practitionerName: appointment.practitioner?.user?.name ?? 'Practitioner',
          locationName: appointment.slot.location?.name ?? 'Clinic',
          status,
          rawStatus: rawStatus || 'SCHEDULED',
        };
      }),
    [appointmentsQuery.data?.items]
  );

  useEffect(() => {
    if (session.role === 'PRACTITIONER' && session.practitionerId) {
      setPractitionerId(session.practitionerId);
      return;
    }
    if (!practitionerId && practitioners[0]) {
      setPractitionerId(practitioners[0].id);
    }
  }, [practitionerId, practitioners, session.practitionerId, session.role]);

  useEffect(() => {
    if (drawerLocations.length === 0) return;
    if (!locationId || !drawerLocations.some((l) => l.id === locationId)) {
      setLocationId(drawerLocations[0]!.id);
    }
  }, [drawerLocations, locationId]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (statusFilter !== 'all' && appointment.status !== statusFilter) return false;
      if (practitionerFilter !== 'all' && appointment.practitionerId !== practitionerFilter) return false;
      return true;
    });
  }, [appointments, statusFilter, practitionerFilter]);

  const appointmentsByDay = useMemo(() => {
    return filteredAppointments.reduce<Record<string, CalendarAppointment[]>>((acc, appointment) => {
      const key = format(appointment.startAt, 'yyyy-MM-dd');
      acc[key] ??= [];
      acc[key].push(appointment);
      acc[key].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
      return acc;
    }, {});
  }, [filteredAppointments]);

  const selectedDayAppointments = appointmentsByDay[format(selectedDate, 'yyyy-MM-dd')] ?? [];

  const selectedSlot = useMemo(
    () => availableSlots.find((s) => s.id === selectedSlotId) ?? null,
    [availableSlots, selectedSlotId]
  );

  useEffect(() => {
    setSelectedSlotId(null);
  }, [practitionerId, locationId, slotDayStart]);

  useEffect(() => {
    if (!selectedSlotId) return;
    if (!availableSlots.some((s) => s.id === selectedSlotId)) {
      setSelectedSlotId(null);
    }
  }, [availableSlots, selectedSlotId]);

  const openDrawerForDate = (date: Date) => {
    const dayStart = startOfDay(date);
    const todayStart = startOfDay(new Date());
    if (dayStart.getTime() < todayStart.getTime()) {
      toast.error('You cannot add appointments on past dates.');
      return;
    }
    setDetailAppointment(null);
    setSelectedDate(dayStart);
    setSelectedSlotId(null);
    setDrawerOpen(true);
    if (!practitionerId && practitioners[0]) {
      setPractitionerId(practitioners[0].id);
    }
    if (!locationId && drawerLocations[0]) {
      setLocationId(drawerLocations[0].id);
    }
  };

  const openDetailDrawer = (appointment: CalendarAppointment) => {
    setMorePopup(null);
    setDrawerOpen(false);
    setDetailAppointment(appointment);
    const row = (appointmentsQuery.data?.items ?? []).find((a: { id: string }) => a.id === appointment.id) as
      | { status?: string; notes?: string | null }
      | undefined;
    setDetailEditStatus(String(row?.status ?? appointment.rawStatus ?? 'SCHEDULED'));
    setDetailEditNotes(String(row?.notes ?? ''));
  };

  const closeDetailDrawer = () => setDetailAppointment(null);

  const anyOverlayOpen = drawerOpen || detailAppointment !== null || morePopup !== null;

  useEffect(() => {
    if (!anyOverlayOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [anyOverlayOpen]);

  useEffect(() => {
    if (!anyOverlayOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (morePopup) {
        setMorePopup(null);
        return;
      }
      if (detailAppointment) {
        setDetailAppointment(null);
        return;
      }
      setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [anyOverlayOpen, morePopup, detailAppointment]);

  const handleCreateAppointment = () => {
    if (!isSignedIn) {
      toast.error('Sign in to book an appointment');
      return;
    }
    if (!practitionerId || !locationId) {
      toast.error('Select a practitioner and location');
      return;
    }
    if (!selectedSlotId) {
      toast.error('Select an available time slot');
      return;
    }
    if (staffCanManage && !staffPatientId) {
      toast.error('Select a patient for this appointment');
      return;
    }

    createAppointment.mutate({
      slotId: selectedSlotId,
      reason: reason.trim() || undefined,
      ...(staffCanManage && staffPatientId ? { patientId: staffPatientId } : {}),
    });
  };

  const selectBar = `box-border h-[43px] min-h-[43px] cursor-pointer appearance-none rounded-md ${CAL_BD} bg-transparent py-0 pl-3 pr-9 text-[16px] font-medium leading-none outline-none focus-visible:ring-2 focus-visible:ring-white/20`;

  return (
    <Fragment>
      <div
        className="flex w-full flex-col"
        style={{ minHeight: 'calc(100dvh - 96px - 1.5rem)' }}
      >
        <div className={`flex flex-col gap-4 ${CAL_BD_B} py-4 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonth((value) => subMonths(value, 1))}
                className={`flex size-9 items-center justify-center rounded-md ${CAL_BD} text-white transition hover:bg-white/5`}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth((value) => addMonths(value, 1))}
                className={`flex size-9 items-center justify-center rounded-md ${CAL_BD} text-white transition hover:bg-white/5`}
                aria-label="Next month"
              >
                <ChevronRight className="size-4" strokeWidth={2} />
              </button>
            </div>

            <div className={`flex items-center gap-1.5 rounded-md ${CAL_BD} px-3 py-2 text-sm`} style={{ color: CAL_MUTED }}>
              <span>Month</span>
              <ChevronDown className="size-3.5 opacity-80" aria-hidden />
            </div>

            <label
              className={`relative flex cursor-pointer items-center gap-1.5 rounded-md ${CAL_BD} px-3 py-2 text-sm font-medium transition hover:bg-white/5`}
              style={{ color: CAL_TEXT }}
            >
              {format(currentMonth, 'MMMM, yyyy')}
              <ChevronDown className="size-4" style={{ color: CAL_MUTED }} aria-hidden />
              <input
                type="month"
                className="absolute inset-0 cursor-pointer opacity-0"
                style={{ colorScheme: 'dark' }}
                value={format(currentMonth, 'yyyy-MM')}
                onChange={(event) => {
                  const value = event.target.value;
                  if (!value) return;
                  const [y, m] = value.split('-').map(Number);
                  setCurrentMonth(startOfMonth(new Date(y, m - 1, 1)));
                }}
                aria-label="Choose month"
              />
            </label>

            <button
              type="button"
              onClick={() => setCurrentMonth(startOfMonth(new Date()))}
              className={`rounded-full ${CAL_BD} px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:bg-white/5`}
              style={{ color: CAL_TEXT }}
            >
              Today
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative inline-block max-w-full">
              <select
                className={selectBar}
                style={{ color: CAL_MUTED }}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Event filter"
              >
                <option value="all">Event</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No show</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 opacity-80"
                style={{ color: CAL_MUTED }}
                aria-hidden
              />
            </div>

            <div className="relative inline-block min-w-0 max-w-[140px] sm:max-w-[180px]">
              <select
                className={`${selectBar} w-full min-w-0`}
                style={{ color: CAL_MUTED }}
                value={practitionerFilter}
                onChange={(event) => setPractitionerFilter(event.target.value)}
                aria-label="Filter by practitioner"
              >
                <option value="all">Team</option>
                {practitioners.map((p: { id: string; user?: { name?: string | null; email?: string | null } }) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.name ?? p.user?.email ?? 'Practitioner'}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 opacity-80"
                style={{ color: CAL_MUTED }}
                aria-hidden
              />
            </div>

            <button
              type="button"
              onClick={() => openDrawerForDate(new Date())}
              className="box-border flex h-[43px] min-h-[43px] shrink-0 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: CAL_SELECTED_ORANGE }}
            >
              + Add
            </button>
          </div>
        </div>

        {!isSignedIn && (
          <p className={`${CAL_BD_B} py-2 text-center text-xs sm:text-left`} style={{ color: CAL_MUTED }}>
            Sign in to save appointments.{' '}
            <Link to="/auth/signin" className="font-medium underline" style={{ color: CAL_TEXT }}>
              Sign in
            </Link>
          </p>
        )}

        <div className={`box-border flex w-full min-w-0 flex-1 flex-col ${CAL_BD_LT}`}>
          <div className="grid w-full min-w-0 grid-cols-7">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
              <div
                key={dayName}
                className={`box-border ${CAL_BD_RB} py-3 text-center text-[11px] font-semibold tracking-[0.12em] uppercase sm:text-xs`}
                style={{
                  color: CAL_MUTED,
                }}
              >
                {dayName}
              </div>
            ))}
          </div>

          {appointmentsQuery.isLoading ? (
            <div className="flex flex-1 items-center justify-center py-24 text-sm" style={{ color: CAL_MUTED }}>
              Loading appointments...
            </div>
          ) : (
            <div className="flex w-full min-w-0 flex-1 flex-col">
              {calendarWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid min-h-0 w-full min-w-0 flex-1 grid-cols-7">
                  {week.map((day) => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const dayAppointments = appointmentsByDay[dayKey] ?? [];
                    const visibleAppointments = dayAppointments.slice(0, 3);
                    const overflowAppointments = dayAppointments.slice(3);
                    const hiddenCount = overflowAppointments.length;
                    const isOutsideMonth = !isSameMonth(day, currentMonth);
                    const isTodayDay = isToday(day);
                    const isPastDay = startOfDay(day).getTime() < startOfDay(new Date()).getTime();

                    return (
                      <div
                        key={dayKey}
                        onClick={() => openDrawerForDate(day)}
                        title={isPastDay ? 'Past dates cannot be used for new appointments' : undefined}
                        className={`box-border flex min-h-[25px] min-w-0 flex-col ${CAL_BD_RB} px-2 py-2.5 text-left transition-colors sm:min-h-[40px] sm:px-3 sm:py-3 ${
                          isPastDay
                            ? 'cursor-not-allowed opacity-[0.42] hover:bg-transparent'
                            : 'cursor-pointer hover:bg-white/[0.03]'
                        }`}
                        style={{
                          backgroundColor: isSameDay(day, selectedDate) ? 'rgba(239,107,59,0.1)' : 'transparent',
                          boxShadow: isSameDay(day, selectedDate)
                            ? `inset 0 0 0 1px ${CAL_SELECTED_ORANGE}`
                            : undefined,
                        }}
                      >
                        <div
                          className="flex min-h-0 flex-1 flex-col"
                          style={{ opacity: isOutsideMonth && !isTodayDay ? 0.45 : 1 }}
                        >
                          <div className="pointer-events-none px-0.5">
                            {isFirstDayOfMonth(day) ? (
                              <div className="flex flex-wrap items-center gap-1">
                                <span
                                  className="text-xs font-medium leading-tight sm:text-sm"
                                  style={{ color: CAL_MUTED }}
                                >
                                  {format(day, 'MMMM')}
                                </span>
                                {isTodayDay ? (
                                  <span
                                    className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-[2px] text-xs font-medium tabular-nums sm:size-7 sm:text-sm"
                                    style={{
                                      backgroundColor: 'rgba(255,255,255,0.14)',
                                      color: CAL_TEXT,
                                    }}
                                    aria-current="date"
                                  >
                                    {format(day, 'd')}
                                  </span>
                                ) : (
                                  <span
                                    className="text-xs font-medium tabular-nums leading-tight sm:text-sm"
                                    style={{ color: CAL_MUTED }}
                                  >
                                    {format(day, 'd')}
                                  </span>
                                )}
                              </div>
                            ) : isTodayDay ? (
                              <span
                                className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-[2px] text-xs font-medium tabular-nums sm:size-7 sm:text-sm"
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.14)',
                                  color: CAL_TEXT,
                                }}
                                aria-current="date"
                              >
                                {format(day, 'd')}
                              </span>
                            ) : (
                              <span
                                className="text-xs font-medium leading-tight tabular-nums sm:text-sm"
                                style={{ color: CAL_MUTED }}
                              >
                                {format(day, 'd')}
                              </span>
                            )}
                          </div>

                          <div className="mt-1.5 flex min-h-0 flex-1 flex-col gap-0.5 sm:gap-1">
                            {visibleAppointments.map((appointment) => (
                              <button
                                key={appointment.id}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openDetailDrawer(appointment);
                                }}
                                className="flex w-full min-w-0 !rounded-sm !border-0 !bg-transparent !px-0.5 !py-0.5 !shadow-none text-left text-[10px] font-normal leading-tight transition hover:!bg-white/[0.06] sm:text-[11px] sm:leading-[14px]"
                                title={calendarEventBirdsEyeLine(appointment)}
                              >
                                <span className="flex min-w-0 flex-1 items-start gap-1.5 truncate">
                                  <span
                                    className="mt-[2px] size-3 shrink-0 rounded-full"
                                    style={{ backgroundColor: appointmentStatusDotColor(appointment.status) }}
                                    aria-hidden
                                  />
                                  <span className="tabular-nums ml-1" style={{ color: CAL_MUTED }}>
                                    {toTimeLabel(appointment.startAt)}
                                  </span>
                                  <span style={{ color: CAL_MUTED }}>{': '}</span>
                                  <span className="font-medium" style={{ color: CAL_TEXT }}>
                                    {personFirstName(appointment.patientName, false) || 'Patient'}
                                  </span>
                                  <span style={{ color: CAL_MUTED }}>{' -> '}</span>
                                  <span style={{ color: CAL_TEXT }}>
                                    {personFirstName(appointment.practitionerName, true) || 'Doctor'}
                                  </span>
                                </span>
                              </button>
                            ))}

                            {hiddenCount > 0 && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setMorePopup({ date: day, appointments: overflowAppointments });
                                }}
                                className="w-full !rounded-sm !border-0 !bg-transparent !px-0.5 !py-0.5 !shadow-none text-left text-[10px] font-medium transition hover:!bg-transparent hover:underline sm:text-[11px]"
                                style={{ color: CAL_TEXT }}
                              >
                                + {hiddenCount} more
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed left-0 right-0 bottom-0 z-[10050] flex justify-end backdrop-blur-[2px]"
            style={{ top: HEADER_OFFSET_PX }}
            role="presentation"
          >
            <button
              type="button"
              className="min-h-0 min-w-0 flex-1 cursor-default bg-black/45 transition-colors hover:bg-black/50"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close appointment drawer"
            />
            <aside
              className={`flex h-full w-full max-w-[min(100vw,460px)] shrink-0 flex-col overflow-hidden ${CAL_BD_L} shadow-2xl`}
              style={{
                backgroundColor: 'var(--bg-section)',
                boxShadow: '-24px 0 80px rgba(15, 23, 42, 0.22)',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="appointment-drawer-title"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em]" style={{ color: 'var(--primary-color3)' }}>
                  New appointment
                </p>
                <h2
                  id="appointment-drawer-title"
                  className="mt-3 text-[28px] font-semibold"
                  style={{ color: 'var(--primary-color2)' }}
                >
                  {format(selectedDate, 'EEEE, d MMMM')}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full !border-0 !bg-transparent !p-0 !shadow-none transition hover:!bg-white/10"
                style={{ color: 'var(--primary-color2)' }}
                aria-label="Close new appointment"
              >
                <X className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </div>

            <div className={`mt-6 rounded-[18px] p-4 ${CAL_BD}`} style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--primary-color2)' }}>
                Existing appointments for this day
              </p>
              {selectedDayAppointments.length === 0 ? (
                <p className="mt-2 text-sm" style={{ color: 'var(--primary-color4)' }}>
                  No appointments scheduled yet.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {selectedDayAppointments.map((appointment) => (
                    <div key={appointment.id} className={`rounded-[12px] px-3 py-3 ${CAL_BD}`}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--primary-color2)' }}>
                        {toTimeLabel(appointment.startAt)} - {toTimeLabel(appointment.endAt)}
                      </p>
                      <p className="mt-1 text-sm" style={{ color: 'var(--primary-color4)' }}>
                        {appointment.practitionerName} · {appointment.locationName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <Label className="mb-2 block">Practitioner</Label>
                <select
                  value={practitionerId}
                  disabled={session.role === 'PRACTITIONER'}
                  onChange={(event) => setPractitionerId(event.target.value)}
                  className={`h-14 w-full rounded-[14px] px-4 text-base outline-none ${CAL_BD}`}
                  style={{
                    backgroundColor: 'var(--bg-section2)',
                    color: 'var(--primary-color2)',
                  }}
                >
                  <option value="">Select practitioner</option>
                  {practitioners.map((practitioner: any) => (
                    <option key={practitioner.id} value={practitioner.id}>
                      {practitioner.user?.name ?? practitioner.user?.email ?? 'Practitioner'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="mb-2 block">Location</Label>
                <select
                  value={locationId}
                  onChange={(event) => setLocationId(event.target.value)}
                  className={`h-14 w-full rounded-[14px] px-4 text-base outline-none ${CAL_BD}`}
                  style={{
                    backgroundColor: 'var(--bg-section2)',
                    color: 'var(--primary-color2)',
                  }}
                >
                  <option value="">Select location</option>
                  {drawerLocations.map((location: { id: string; name: string }) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {staffCanManage && (
                <div>
                  <Label className="mb-2 block">Patient</Label>
                  <select
                    value={staffPatientId}
                    onChange={(event) => setStaffPatientId(event.target.value)}
                    className={`h-14 w-full rounded-[14px] px-4 text-base outline-none ${CAL_BD}`}
                    style={{
                      backgroundColor: 'var(--bg-section2)',
                      color: 'var(--primary-color2)',
                    }}
                  >
                    <option value="">Select patient</option>
                    {(staffPatientsQuery.data?.items ?? []).map((p: { id: string; user?: { name?: string | null; email?: string | null } }) => (
                      <option key={p.id} value={p.id}>
                        {p.user?.name ?? p.user?.email ?? 'Patient'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label className="mb-2 block">Available times</Label>
                {availableSlotsQuery.isLoading ? (
                  <p className="text-sm" style={{ color: 'var(--primary-color4)' }}>
                    Loading slots…
                  </p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--primary-color4)' }}>
                    No open slots for this practitioner at this location on this day. Try another day,
                    location, or clinician.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = slot.id === selectedSlotId;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`!m-0 shrink-0 !rounded-[4px] !border !border-solid !px-3 !py-2 text-sm !font-medium !leading-tight !shadow-none transition ${
                            isSelected
                              ? '!border-[var(--primary-color3)] !bg-[var(--primary-color3)]/15'
                              : '!border-white/[0.12] !bg-transparent hover:!bg-white/[0.06]'
                          }`}
                          style={{ color: 'var(--primary-color2)' }}
                        >
                          {toTimeLabel(new Date(slot.startAt))} – {toTimeLabel(new Date(slot.endAt))}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <Label className="mb-2 block">Selected slot</Label>
                <Input
                  value={
                    selectedSlot
                      ? `${format(selectedDate, 'PP')} · ${toTimeLabel(new Date(selectedSlot.startAt))} – ${toTimeLabel(new Date(selectedSlot.endAt))}`
                      : 'Choose a time above'
                  }
                  readOnly
                  className="!h-14 !rounded-[14px] !border-[1px] !border-solid !border-white/[0.07] !bg-[var(--bg-section2)] !text-[var(--primary-color2)]"
                />
              </div>

              <div>
                <Label className="mb-2 block">Reason</Label>
                <Textarea
                  rows={5}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Add a short reason for the appointment"
                  className="!rounded-[14px] !border-[1px] !border-solid !border-white/[0.07] !bg-[var(--bg-section2)] !text-[var(--primary-color2)] placeholder:!text-[var(--primary-color4)]"
                />
              </div>
            </div>

            {!isSignedIn && (
              <p className={`mt-6 rounded-[14px] px-4 py-3 text-sm ${CAL_BD}`}>
                <span style={{ color: 'var(--primary-color4)' }}>You must be signed in to create an appointment. </span>
                <Link to="/auth/signin" className="font-semibold underline" style={{ color: 'var(--primary-color3)' }}>
                  Sign in
                </Link>
              </p>
            )}

            <div className="mt-8 flex items-center gap-3">
              <Button
                type="button"
                onClick={handleCreateAppointment}
                disabled={createAppointment.isPending || !isSignedIn || !selectedSlotId}
              >
                {createAppointment.isPending ? 'Saving...' : 'Create appointment'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="!border-[1px] !border-solid !border-white/[0.07] bg-transparent hover:bg-white/[0.04]"
                onClick={() => setDrawerOpen(false)}
              >
                Cancel
              </Button>
            </div>
              </div>
          </aside>
        </div>,
          document.body
        )}

      {morePopup &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[10040] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
            style={{ top: HEADER_OFFSET_PX }}
            role="presentation"
            onClick={() => setMorePopup(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="more-appointments-title"
              className={`max-h-[min(70vh,420px)] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl ${CAL_BD}`}
              style={{
                backgroundColor: 'var(--bg-section)',
                boxShadow: '0 24px 80px rgba(16, 24, 40, 0.35)',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={`flex items-center justify-between px-5 py-4 ${CAL_BD_B}`}>
                <h2 id="more-appointments-title" className="text-base font-semibold" style={{ color: 'var(--primary-color2)' }}>
                  {format(morePopup.date, 'EEEE, d MMMM yyyy')}
                </h2>
                <button
                  type="button"
                  onClick={() => setMorePopup(null)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-white/10"
                  style={{ color: 'var(--primary-color4)' }}
                >
                  Close
                </button>
              </div>
              <ul className="max-h-[min(60vh,340px)] space-y-1 overflow-y-auto px-3 py-3">
                {morePopup.appointments.map((appointment) => (
                  <li key={appointment.id}>
                    <button
                      type="button"
                      onClick={() => openDetailDrawer(appointment)}
                      className={`flex w-full min-w-0 rounded-xl px-3 py-2.5 text-left text-[12px] leading-snug transition hover:bg-white/[0.05] ${CAL_BD}`}
                      style={{
                        color: 'var(--primary-color2)',
                      }}
                      title={calendarEventBirdsEyeLine(appointment)}
                    >
                      <span className="flex min-w-0 flex-1 items-start gap-2 truncate">
                        <span
                          className="mt-[3px] size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: appointmentStatusDotColor(appointment.status) }}
                          aria-hidden
                        />
                        <span className="tabular-nums text-white/70">{toTimeLabel(appointment.startAt)}</span>
                        <span className="text-white/45">{' - '}</span>
                        <span className="font-medium text-white">
                          {personFirstName(appointment.patientName, false) || 'Patient'}
                        </span>
                        <span className="text-white/45">{' -> '}</span>
                        <span className="text-white">{personFirstName(appointment.practitionerName, true) || 'Doctor'}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}

      {detailAppointment &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed left-0 right-0 bottom-0 z-[10050] flex justify-end backdrop-blur-[2px]"
            style={{ top: HEADER_OFFSET_PX }}
            role="presentation"
          >
            <button
              type="button"
              className="min-h-0 min-w-0 flex-1 cursor-default bg-black/45 transition-colors hover:bg-black/50"
              onClick={closeDetailDrawer}
              aria-label="Close appointment details"
            />
            <aside
              className={`flex h-full w-full max-w-[min(100vw,460px)] shrink-0 flex-col overflow-hidden ${CAL_BD_L} shadow-2xl`}
              style={{
                backgroundColor: 'var(--bg-section)',
                boxShadow: '-24px 0 80px rgba(15, 23, 42, 0.22)',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="appointment-detail-title"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em]" style={{ color: 'var(--primary-color3)' }}>
                      Appointment
                    </p>
                    <h2
                      id="appointment-detail-title"
                      className="mt-3 text-[28px] font-semibold leading-tight"
                      style={{ color: 'var(--primary-color2)' }}
                    >
                      {detailAppointment.patientName}
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: 'var(--primary-color4)' }}>
                      {format(detailAppointment.startAt, 'EEEE, d MMMM yyyy')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDetailDrawer}
                    className="text-sm font-medium"
                    style={{ color: 'var(--primary-color4)' }}
                  >
                    Close
                  </button>
                </div>

                <dl className={`mt-8 space-y-4 rounded-[18px] p-5 ${CAL_BD}`} style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary-color4)' }}>
                      Time
                    </dt>
                    <dd className="mt-1 text-base font-medium" style={{ color: 'var(--primary-color2)' }}>
                      {toTimeLabel(detailAppointment.startAt)} – {toTimeLabel(detailAppointment.endAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary-color4)' }}>
                      Patient
                    </dt>
                    <dd className="mt-1 text-base font-medium" style={{ color: 'var(--primary-color2)' }}>
                      {detailAppointment.patientName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary-color4)' }}>
                      Practitioner
                    </dt>
                    <dd className="mt-1 text-base font-medium" style={{ color: 'var(--primary-color2)' }}>
                      {detailAppointment.practitionerName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary-color4)' }}>
                      Location
                    </dt>
                    <dd className="mt-1 text-base font-medium" style={{ color: 'var(--primary-color2)' }}>
                      {detailAppointment.locationName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary-color4)' }}>
                      Status
                    </dt>
                    <dd className="mt-1 text-base font-medium" style={{ color: 'var(--primary-color2)' }}>
                      {detailAppointment.rawStatus.replace(/_/g, ' ')}
                    </dd>
                  </div>
                  {detailAppointment.title?.trim() && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary-color4)' }}>
                        Reason
                      </dt>
                      <dd className="mt-1 text-base" style={{ color: 'var(--primary-color2)' }}>
                        {detailAppointment.title}
                      </dd>
                    </div>
                  )}
                </dl>

                {staffCanManage && detailAppointment && (
                  <div className="mt-8 space-y-4">
                    <div>
                      <Label className="mb-2 block">Update status</Label>
                      <select
                        value={detailEditStatus}
                        onChange={(e) => setDetailEditStatus(e.target.value)}
                        className={`h-12 w-full rounded-[14px] px-4 text-base outline-none ${CAL_BD}`}
                        style={{ backgroundColor: 'var(--bg-section2)', color: 'var(--primary-color2)' }}
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No show</option>
                      </select>
                    </div>
                    <div>
                      <Label className="mb-2 block">Clinical notes</Label>
                      <Textarea
                        rows={4}
                        value={detailEditNotes}
                        onChange={(e) => setDetailEditNotes(e.target.value)}
                        className="!rounded-[14px] !border-[1px] !border-solid !border-white/[0.07] !bg-[var(--bg-section2)] !text-[var(--primary-color2)]"
                      />
                    </div>
                    <Button
                      type="button"
                      disabled={updateAppointmentStatus.isPending}
                      onClick={() =>
                        updateAppointmentStatus.mutate({
                          id: detailAppointment.id,
                          status: detailEditStatus as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
                          notes: detailEditNotes.trim() || undefined,
                        })
                      }
                    >
                      {updateAppointmentStatus.isPending ? 'Saving…' : 'Save changes'}
                    </Button>
                  </div>
                )}

                {session.role === 'PATIENT' && detailAppointment && detailAppointment.rawStatus === 'SCHEDULED' && (
                  <div className="mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={updateAppointmentStatus.isPending}
                      onClick={() =>
                        updateAppointmentStatus.mutate({
                          id: detailAppointment.id,
                          status: 'CANCELLED',
                        })
                      }
                      className="!border-rose-500/50 text-rose-200"
                    >
                      Cancel appointment
                    </Button>
                  </div>
                )}
              </div>
            </aside>
          </div>,
          document.body
        )}
    </Fragment>
  );
}
