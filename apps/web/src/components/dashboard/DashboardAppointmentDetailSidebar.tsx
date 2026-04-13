import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trpc } from '@nhs-portal/client-api';

function labelRow(label: string, value: string | null | undefined) {
  if (!value?.trim()) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C5B6B3]">{label}</p>
      <p className="mt-1 text-[15px] font-medium leading-snug text-[#EBEBEB]">{value}</p>
    </div>
  );
}

export function DashboardAppointmentDetailSidebar({ appointmentId }: { appointmentId: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError } = trpc.appointments.byId.useQuery({ id: appointmentId });

  const close = () => {
    const sp = new URLSearchParams(location.search);
    sp.delete('appointmentId');
    const s = sp.toString();
    navigate({ pathname: location.pathname, search: s ? `?${s}` : '' }, { replace: true });
  };

  const patient = data?.patient?.user;
  const patientLine = patient?.name?.trim() || patient?.email || null;
  const practitioner = data?.practitioner?.user?.name?.trim() || null;
  const start = data?.slot?.startAt ? new Date(data.slot.startAt) : null;
  const end = data?.slot?.endAt ? new Date(data.slot.endAt) : null;
  const whenLine =
    start && end
      ? `${format(start, 'EEEE, d MMMM yyyy')} · ${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`
      : null;
  const statusLine = data?.status ? data.status.replace(/_/g, ' ') : null;

  return (
    <aside className="flex h-full min-h-0 max-h-[calc(100vh-96px-2rem)] flex-col rounded-[16px] border border-[#393939] bg-[#393939] p-4 lg:p-5">
      <header className="mb-4 flex shrink-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-[18px] font-bold leading-[22px] text-[#EBEBEB]">Appointment</h2>
          <p className="mt-1 text-[14px] leading-[20px] text-[#C5B6B3]">Selected from your booked list</p>
        </div>
        <button
          type="button"
          onClick={close}
          className="shrink-0 rounded-lg p-1.5 text-[#C5B6B3] transition hover:bg-white/10 hover:text-white"
          aria-label="Close appointment details"
        >
          <X className="size-5" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <p className="text-sm text-[#C5B6B3]">Loading…</p>
        ) : isError || !data ? (
          <p className="text-sm text-[#C5B6B3]">Could not load this appointment.</p>
        ) : (
          <div className="space-y-5 text-sm">
            {labelRow('Patient', patientLine)}
            {patient?.email && patientLine !== patient.email ? labelRow('Email', patient.email) : null}
            {patient?.phone ? labelRow('Phone', patient.phone) : null}
            {labelRow('Clinician', practitioner)}
            {labelRow('When', whenLine)}
            {labelRow('Location', data.slot?.location?.name ?? undefined)}
            {labelRow('Status', statusLine)}
            {labelRow('Reason for visit', data.reason ?? undefined)}
            {labelRow('Notes', data.notes ?? undefined)}
          </div>
        )}
      </div>
    </aside>
  );
}
