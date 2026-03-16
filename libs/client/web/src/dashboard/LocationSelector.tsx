import React, { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';

import { useLocationStore } from '@your-props/client/utils';
import { trpc } from '@nhs-portal/client-api';

export const LocationSelector: React.FC = () => {
  const { locations, selectedLocationId, setLocations, setSelectedLocationId } =
    useLocationStore();

  const locationsQuery = trpc.locations.list.useQuery();

  useEffect(() => {
    if (locationsQuery.data && locationsQuery.data.length > 0 && locations.length === 0) {
      setLocations(locationsQuery.data.map((l) => ({ id: l.id, name: l.name })));
    }
  }, [locationsQuery.data, locations.length, setLocations]);

  const currentLabel =
    selectedLocationId === 'all'
      ? 'All locations'
      : locations.find((l) => l.id === selectedLocationId)?.name ?? 'All locations';

  return (
    <div className="mb-[20px]">
      <p className="text-[15px] font-semibold leading-[22px] text-[#C5B6B3] mb-[8px]">
        Location
      </p>
      <Dropdown>
        <Dropdown.Toggle
          id="location-dropdown"
          className="btn-sort-by dropdown flex h-11 w-full items-center justify-between rounded-[10px] border border-[#393939] bg-[#222222] px-[14px] text-lg text-[#EBEBEB]"
        >
          <span className="mr-[10px] block truncate">{currentLabel}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="!top-[18px] w-full text-base">
          {locations.length > 0 && (
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
          {locations.map((loc) => (
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
      </Dropdown>
    </div>
  );
};

