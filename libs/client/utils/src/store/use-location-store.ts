import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LocationOption = {
  id: string;
  name: string;
};

/** `'all'` = no location filter (show all). Otherwise a non-empty subset of location ids. */
export type LocationSelection = 'all' | string[];

type LocationStore = {
  locations: LocationOption[];
  selectedLocationIds: LocationSelection;
  setLocations: (locations: LocationOption[]) => void;
  setSelectedLocationIds: (selection: LocationSelection) => void;
  /** When `all`, unchecking one location switches to a subset of all others. */
  toggleLocationId: (id: string) => void;
  selectAllLocations: () => void;
};

function dedupe(ids: string[]) {
  return [...new Set(ids)];
}

type PersistedLocationSlice = Pick<LocationStore, 'selectedLocationIds'>;

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      locations: [],
      selectedLocationIds: 'all',

      setLocations: (locations) => set({ locations }),

      setSelectedLocationIds: (selection) => {
        const locs = get().locations;
        if (selection === 'all') {
          set({ selectedLocationIds: 'all' });
          return;
        }
        const ids = dedupe(selection);
        if (ids.length === 0 || (locs.length > 0 && ids.length >= locs.length)) {
          set({ selectedLocationIds: 'all' });
          return;
        }
        set({ selectedLocationIds: ids });
      },

      toggleLocationId: (id) => {
        const { locations, selectedLocationIds } = get();
        const allIds = locations.map((l) => l.id);
        if (allIds.length === 0) return;

        if (selectedLocationIds === 'all') {
          const next = allIds.filter((x) => x !== id);
          set({ selectedLocationIds: next.length === 0 ? 'all' : next });
          return;
        }

        const setSel = new Set(selectedLocationIds);
        if (setSel.has(id)) setSel.delete(id);
        else setSel.add(id);
        const next = dedupe([...setSel]);
        if (next.length === 0 || next.length >= allIds.length) {
          set({ selectedLocationIds: 'all' });
        } else {
          set({ selectedLocationIds: next });
        }
      },

      selectAllLocations: () => set({ selectedLocationIds: 'all' }),
    }),
    {
      name: 'nhs-portal-location-filter',
      partialize: (s): PersistedLocationSlice => ({ selectedLocationIds: s.selectedLocationIds }),
    }
  )
);

/** For tRPC / Prisma: `undefined` means no location filter (all). */
export function activeLocationIdsForApi(
  selection: LocationSelection,
  allLocationIds: string[]
): string[] | undefined {
  if (selection === 'all') return undefined;
  if (!Array.isArray(selection) || selection.length === 0) return undefined;
  if (allLocationIds.length > 0 && selection.length >= allLocationIds.length) return undefined;
  return selection;
}

export function isLocationFilterActive(selection: LocationSelection, allLocationIds: string[]): boolean {
  return activeLocationIdsForApi(selection, allLocationIds) !== undefined;
}
