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
type PersistedLocationSlice = Pick<LocationStore, 'selectedLocationIds'>;
export declare const useLocationStore: import('zustand').UseBoundStore<Omit<import('zustand').StoreApi<LocationStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import('zustand/middleware').PersistOptions<LocationStore, PersistedLocationSlice>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: LocationStore) => void) => () => void;
        onFinishHydration: (fn: (state: LocationStore) => void) => () => void;
        getOptions: () => Partial<import('zustand/middleware').PersistOptions<LocationStore, PersistedLocationSlice>>;
    };
}>;
/** For tRPC / Prisma: `undefined` means no location filter (all). */
export declare function activeLocationIdsForApi(selection: LocationSelection, allLocationIds: string[]): string[] | undefined;
export declare function isLocationFilterActive(selection: LocationSelection, allLocationIds: string[]): boolean;
export {};
