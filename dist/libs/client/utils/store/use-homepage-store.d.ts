interface HomepageStore {
    homepageData: {
        featuredProducts: any[];
        navigation: any[];
        categories: any[];
        topUsers: any[];
        featuredCollectors: any[];
        newestCostumes: any[];
        trendingProductsCostumes: any[];
        todayPick: any[];
        newestProducts: any[];
        liveAuction: any[];
        featuredCollections: any[];
    };
    loadingPageData: boolean;
    setHomepageData: (data: any) => void;
    setLoadingPageData: (loading: boolean) => void;
    resetHomepageData: () => void;
}
export declare const useHomepageStore: import('zustand').UseBoundStore<Omit<import('zustand').StoreApi<HomepageStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import('zustand/middleware').PersistOptions<HomepageStore, HomepageStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: HomepageStore) => void) => () => void;
        onFinishHydration: (fn: (state: HomepageStore) => void) => () => void;
        getOptions: () => Partial<import('zustand/middleware').PersistOptions<HomepageStore, HomepageStore>>;
    };
}>;
export {};
