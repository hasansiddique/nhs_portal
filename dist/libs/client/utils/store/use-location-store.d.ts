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
export declare const useLocationStore: import('zustand').UseBoundStore<import('zustand').StoreApi<LocationStore>>;
export {};
