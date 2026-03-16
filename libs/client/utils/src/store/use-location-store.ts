import { create } from 'zustand';

type Location = {
  id: string;
  name: string;
};

type LocationStore = {
  locations: Location[];
  selectedLocationId: string | 'all';
  setLocations: (locations: Location[]) => void;
  setSelectedLocationId: (id: string | 'all') => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  selectedLocationId: 'all',
  setLocations: (locations) => set({ locations }),
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
}));

