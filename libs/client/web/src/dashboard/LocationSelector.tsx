import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import { useLocationStore } from '@your-props/client/utils';
import { trpc } from '@nhs-portal/client-api';

function readSessionUser(): { role?: string; homeLocationId?: string; workLocationIds?: string[] } {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export const LocationSelector: React.FC = () => {
  const {
    locations,
    selectedLocationIds,
    setLocations,
    setSelectedLocationIds,
    toggleLocationId,
    selectAllLocations,
  } = useLocationStore();
  const locationsQuery = trpc.locations.list.useQuery();
  const session = readSessionUser();
  const patientHomeApplied = useRef(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (locationsQuery.data && locationsQuery.data.length > 0 && locations.length === 0) {
      setLocations(locationsQuery.data.map((l) => ({ id: l.id, name: l.name })));
    }
  }, [locationsQuery.data, locations.length, setLocations]);

  useEffect(() => {
    if (session.role !== 'PATIENT' || !session.homeLocationId || patientHomeApplied.current) return;
    patientHomeApplied.current = true;
    setSelectedLocationIds([session.homeLocationId]);
  }, [session.role, session.homeLocationId, setSelectedLocationIds]);

  const isPatient = session.role === 'PATIENT';
  const isPractitioner = session.role === 'PRACTITIONER';
  const workIds = session.workLocationIds ?? [];

  const visibleLocations = React.useMemo(() => {
    if (isPractitioner && workIds.length > 0) {
      return locations.filter((l) => workIds.includes(l.id));
    }
    return locations;
  }, [locations, isPractitioner, workIds]);

  const filteredLocations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return visibleLocations;
    return visibleLocations.filter((l) => l.name.toLowerCase().includes(q));
  }, [search, visibleLocations]);

  const allSelected =
    selectedLocationIds === 'all' ||
    (Array.isArray(selectedLocationIds) &&
      visibleLocations.length > 0 &&
      selectedLocationIds.length === visibleLocations.length);

  const currentLabel =
    selectedLocationIds === 'all'
      ? 'All locations'
      : selectedLocationIds.length === 1
        ? locations.find((l) => l.id === selectedLocationIds[0])?.name ?? 'Location'
        : `${selectedLocationIds.length} locations`;

  return (
    <div className="mb-[20px]">
      <p className="text-[15px] font-semibold leading-[22px] text-[#C5B6B3] mb-[8px]">Location</p>
      <Dropdown>
        <Dropdown.Toggle
          id="location-dropdown"
          disabled={isPatient}
          className="btn-sort-by dropdown flex h-11 w-full items-center justify-between rounded-[10px] border border-[#393939] bg-[#222222] px-[14px] text-lg text-[#EBEBEB] disabled:opacity-70"
        >
          <span className="mr-[10px] block truncate">{currentLabel}</span>
        </Dropdown.Toggle>

        {!isPatient && (
          <Dropdown.Menu className="!top-[18px] max-h-[min(70vh,360px)] w-full overflow-y-auto text-base border border-[#393939] bg-[#222222] shadow-xl">
            {visibleLocations.length > 0 && (
              <>
                <Dropdown.Header className="text-xs uppercase text-[#C5B6B3]">Quick</Dropdown.Header>
                <Dropdown.Item
                  key="all"
                  className="py-2.5 text-base text-[#EBEBEB] hover:!bg-[#2a2a2a] hover:!text-white focus:!bg-[#2a2a2a]"
                  onClick={() => {
                    selectAllLocations();
                  }}
                >
                  All locations
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header className="text-xs uppercase text-[#C5B6B3]">Clinics</Dropdown.Header>
                <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search locations…"
                    className="mb-3 h-10 w-full rounded-[4px] border border-white/10 bg-[#1a1a1a] px-3 text-sm text-[#EBEBEB] placeholder:text-[#C5B6B3] outline-none focus:border-[var(--primary-color3)]"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#EBEBEB]">
                    <input
                      type="checkbox"
                      className="size-4 accent-[#EF6A3B]"
                      checked={allSelected}
                      onChange={() => {
                        if (allSelected) {
                          setSelectedLocationIds([visibleLocations[0]!.id]);
                        } else {
                          selectAllLocations();
                        }
                      }}
                    />
                    Select all
                  </label>
                  {filteredLocations.length === 0 ? (
                    <p className="py-2 text-sm text-[#C5B6B3]">No locations match your search.</p>
                  ) : null}
                  {filteredLocations.map((loc) => {
                    const checked =
                      selectedLocationIds === 'all' ||
                      (Array.isArray(selectedLocationIds) && selectedLocationIds.includes(loc.id));
                    return (
                      <label
                        key={loc.id}
                        className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-[#EBEBEB]"
                      >
                        <input
                          type="checkbox"
                          className="size-4 accent-[#EF6A3B]"
                          checked={checked}
                          onChange={() => toggleLocationId(loc.id)}
                        />
                        <span className="truncate">{loc.name}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
            {locations.length === 0 && (
              <Dropdown.Item disabled className="py-2.5 text-base text-[#C5B6B3]">
                No locations configured
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        )}
      </Dropdown>
      {isPatient && session.homeLocationId && (
        <p className="mt-1 text-xs text-[#C5B6B3]">Your registered clinic (change via admin if needed).</p>
      )}
    </div>
  );
};
