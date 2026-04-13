import React, { useEffect, useMemo, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { ChevronDown } from 'lucide-react';
import { trpc } from '@nhs-portal/client-api';
import { useLocationStore } from '@your-props/client/utils';

function readSessionUser(): { role?: string; homeLocationId?: string; workLocationIds?: string[] } {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export function HeaderLocationFilter() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);
  const session = readSessionUser();
  const isPatient = session.role === 'PATIENT';
  const isPractitioner = session.role === 'PRACTITIONER';
  const workIds = session.workLocationIds ?? [];

  const locationsQuery = trpc.locations.list.useQuery(undefined, { staleTime: 60_000 });
  const { locations, selectedLocationIds, setLocations, setSelectedLocationIds, toggleLocationId, selectAllLocations } =
    useLocationStore();

  useEffect(() => {
    const data = locationsQuery.data;
    if (data && data.length > 0 && locations.length === 0) {
      setLocations(data.map((l) => ({ id: l.id, name: l.name })));
    }
  }, [locationsQuery.data, locations.length, setLocations]);

  const patientHomeApplied = useRef(false);
  useEffect(() => {
    if (!isPatient || !session.homeLocationId || patientHomeApplied.current) return;
    patientHomeApplied.current = true;
    setSelectedLocationIds([session.homeLocationId]);
  }, [isPatient, session.homeLocationId, setSelectedLocationIds]);

  const visibleLocations = useMemo(() => {
    if (isPractitioner && workIds.length > 0) {
      return locations.filter((l) => workIds.includes(l.id));
    }
    return locations;
  }, [locations, isPractitioner, workIds]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const summary = useMemo(() => {
    if (locations.length === 0) return 'Locations';
    if (selectedLocationIds === 'all') return 'All locations';
    if (selectedLocationIds.length === 1) {
      const n = locations.find((l) => l.id === selectedLocationIds[0])?.name;
      return n ?? '1 location';
    }
    return `${selectedLocationIds.length} locations`;
  }, [locations, selectedLocationIds]);

  const allSelected =
    selectedLocationIds === 'all' ||
    (Array.isArray(selectedLocationIds) &&
      visibleLocations.length > 0 &&
      selectedLocationIds.length === visibleLocations.length);

  const patientLabel = useMemo(() => {
    if (!isPatient || locations.length === 0) return null;
    const id = session.homeLocationId;
    const name = locations.find((l) => l.id === id)?.name;
    return name ?? 'Your clinic';
  }, [isPatient, locations, session.homeLocationId]);

  if (!isLoggedIn) {
    return (
      <div className="mt-[7px] hidden min-w-0 flex-1 justify-center xl:flex">
        <p className="truncate text-sm text-white/50">Sign in to filter by clinic</p>
      </div>
    );
  }

  if (isPatient && patientLabel) {
    return (
      <div className="mt-[7px] hidden min-w-0 max-w-[min(100%,420px)] flex-1 justify-center xl:flex">
        <div
          className="flex h-12 w-full max-w-[420px] items-center rounded-2xl border border-white/10 bg-[#222222] px-4 text-sm text-white/90"
          title="Your registered clinic"
        >
          <span className="truncate">
            <span className="text-white/50">Clinic · </span>
            {patientLabel}
          </span>
        </div>
      </div>
    );
  }

  if (visibleLocations.length === 0) {
    return (
      <div className="mt-[7px] hidden min-w-0 flex-1 justify-center xl:flex">
        <p className="text-sm text-white/50">No locations</p>
      </div>
    );
  }

  return (
    <div className="relative mt-[7px] hidden min-w-0 flex-1 justify-center xl:flex" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full max-w-[420px] min-w-[220px] items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#222222] px-4 text-left text-sm font-medium text-white transition hover:bg-[#2a2a2a]"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="min-w-0 flex-1 truncate">{summary}</span>
        <ChevronDown className={`size-4 shrink-0 text-white/60 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-[calc(100%+6px)] z-[100] w-full max-w-[min(100vw-2rem,420px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#2a2a2a] py-2 shadow-2xl"
          role="listbox"
        >
          <div className="border-b border-white/10 px-3 pb-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5">
              <input
                type="checkbox"
                className="size-4 rounded border-white/30 bg-[#1a1a1a] accent-[#EF6A3B]"
                checked={allSelected}
                onChange={() => {
                  if (allSelected) {
                    setSelectedLocationIds([visibleLocations[0]!.id]);
                  } else {
                    selectAllLocations();
                  }
                }}
              />
              <span className="text-sm font-semibold text-white">All locations</span>
            </label>
            <p className="px-2 pt-1 text-xs text-white/45">Uncheck to narrow; check all to reset the filter.</p>
          </div>
          <div className="max-h-[min(60vh,320px)] overflow-y-auto px-1 py-1">
            {visibleLocations.map((loc) => {
              const checked =
                selectedLocationIds === 'all' || (Array.isArray(selectedLocationIds) && selectedLocationIds.includes(loc.id));
              return (
                <label
                  key={loc.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    className="size-4 rounded border-white/30 bg-[#1a1a1a] accent-[#EF6A3B]"
                    checked={checked}
                    onChange={() => toggleLocationId(loc.id)}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-white/90">{loc.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
