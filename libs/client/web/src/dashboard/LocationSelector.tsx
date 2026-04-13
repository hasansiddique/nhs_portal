import React, { useEffect, useRef } from 'react';
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
  const { locations, selectedLocationId, setLocations, setSelectedLocationId } =
    useLocationStore();
  const locationsQuery = trpc.locations.list.useQuery();
  const session = readSessionUser();
  const patientHomeApplied = useRef(false);

  useEffect(() => {
    if (locationsQuery.data && locationsQuery.data.length > 0 && locations.length === 0) {
      setLocations(locationsQuery.data.map((l) => ({ id: l.id, name: l.name })));
    }
  }, [locationsQuery.data, locations.length, setLocations]);

  useEffect(() => {
    if (session.role !== 'PATIENT' || !session.homeLocationId || patientHomeApplied.current) return;
    patientHomeApplied.current = true;
    setSelectedLocationId(session.homeLocationId);
  }, [session.role, session.homeLocationId, setSelectedLocationId]);

  const isPatient = session.role === 'PATIENT';
  const isPractitioner = session.role === 'PRACTITIONER';
  const workIds = session.workLocationIds ?? [];

  const visibleLocations = React.useMemo(() => {
    if (isPractitioner && workIds.length > 0) {
      return locations.filter((l) => workIds.includes(l.id));
    }
    return locations;
  }, [locations, isPractitioner, workIds]);

  const currentLabel =
    selectedLocationId === 'all'
      ? 'All locations'
      : locations.find((l) => l.id === selectedLocationId)?.name ?? 'All locations';

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
          <Dropdown.Menu className="!top-[18px] w-full text-base">
            {(!isPractitioner || workIds.length === 0) && visibleLocations.length > 0 && (
              <Dropdown.Item
                key="all"
                className="py-2.5 text-base"
                onClick={() => {
                  setSelectedLocationId('all');
                }}
              >
                All locations
              </Dropdown.Item>
            )}
            {(isPractitioner ? visibleLocations : locations).map((loc) => (
              <Dropdown.Item
                key={loc.id}
                className="py-2.5 text-base"
                onClick={() => {
                  setSelectedLocationId(loc.id);
                }}
              >
                {loc.name}
              </Dropdown.Item>
            ))}
            {locations.length === 0 && (
              <Dropdown.Item disabled className="py-2.5 text-base">
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
