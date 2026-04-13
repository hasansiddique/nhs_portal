import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  DashboardAppointmentsList,
  type DashboardAppointmentsUrlFilters,
} from '../../components/dashboard/DashboardAppointmentsList';
import { trpc } from '@nhs-portal/client-api';

function useUrlFilters(searchParams: URLSearchParams): DashboardAppointmentsUrlFilters {
  return useMemo(() => {
    const practitionerId = searchParams.get('practitionerId') ?? undefined;
    const patientId = searchParams.get('patientId') ?? undefined;
    return {
      ...(practitionerId ? { practitionerId } : {}),
      ...(patientId ? { patientId } : {}),
    };
  }, [searchParams]);
}

export default function DashboardAppointments() {
  const [searchParams] = useSearchParams();
  const urlFilters = useUrlFilters(searchParams);
  const practitionerId = urlFilters.practitionerId;
  const patientId = urlFilters.patientId;

  const practitionerQuery = trpc.practitioners.byId.useQuery(
    { id: practitionerId! },
    { enabled: Boolean(practitionerId) }
  );
  const patientQuery = trpc.patients.byId.useQuery({ id: patientId! }, { enabled: Boolean(patientId) });

  const doctorName =
    practitionerQuery.data?.user?.name ?? practitionerQuery.data?.user?.email ?? 'this clinician';
  const patientName =
    patientQuery.data?.user?.name ?? patientQuery.data?.user?.email ?? 'this patient';

  const clearPractitionerHref = useMemo(() => {
    const sp = new URLSearchParams(searchParams);
    sp.delete('practitionerId');
    sp.delete('appointmentId');
    const s = sp.toString();
    return s ? `/dashboard/appointments?${s}` : '/dashboard/appointments';
  }, [searchParams]);

  const clearPatientHref = useMemo(() => {
    const sp = new URLSearchParams(searchParams);
    sp.delete('patientId');
    sp.delete('appointmentId');
    const s = sp.toString();
    return s ? `/dashboard/appointments?${s}` : '/dashboard/appointments';
  }, [searchParams]);

  const clearAllFiltersHref = '/dashboard/appointments';

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-5 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color4)' }}>
            Booked
          </p>
          <h1 className="mt-1 text-xl font-bold text-white">Appointments list</h1>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--primary-color4)' }}>
            Same view as the dashboard home. Open a row to see full details in the right panel (large screens).
          </p>
        </div>
        {(practitionerId || patientId) && (
          <Link
            to={clearAllFiltersHref}
            className="shrink-0 text-sm font-semibold underline-offset-2 hover:underline"
            style={{ color: '#ef6b3b' }}
          >
            Clear all filters
          </Link>
        )}
      </div>

      {(practitionerId || patientId) && (
        <div className="mb-5 flex w-full min-w-0 flex-col gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm" style={{ color: 'var(--primary-color4)' }}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">Active filters</span>
          <div className="flex flex-wrap items-center gap-2">
            {practitionerId ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white">
                Doctor:{' '}
                <span className="font-medium">
                  {practitionerQuery.isLoading ? '…' : doctorName}
                </span>
                <Link to={clearPractitionerHref} className="text-xs font-semibold hover:underline" style={{ color: '#ef6b3b' }}>
                  Remove
                </Link>
              </span>
            ) : null}
            {patientId ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white">
                Patient:{' '}
                <span className="font-medium">{patientQuery.isLoading ? '…' : patientName}</span>
                <Link to={clearPatientHref} className="text-xs font-semibold hover:underline" style={{ color: '#ef6b3b' }}>
                  Remove
                </Link>
              </span>
            ) : null}
          </div>
        </div>
      )}

      <DashboardAppointmentsList mode="booked" urlFilters={urlFilters} />
    </div>
  );
}
