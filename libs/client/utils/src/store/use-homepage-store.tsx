import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the structure of the HomepageStore
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
  setHomepageData: (data: any) => void; // Directly include actions here
  setLoadingPageData: (loading: boolean) => void;
  resetHomepageData: () => void;
}

// Custom storage object to fit Zustand's requirements
const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null; // Return parsed data or null
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value)); // Store the data as JSON
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name); // Remove the item from localStorage
  },
};

// Create the Zustand store with persistence
export const useHomepageStore = create<HomepageStore>()(
  persist(
    (set) => ({
      homepageData: {
        featuredProducts: [],
        navigation: [],
        categories: [],
        topUsers: [],
        featuredCollectors: [],
        newestCostumes: [],
        trendingProductsCostumes: [],
        todayPick: [],
        newestProducts: [],
        liveAuction: [],
        featuredCollections: [],
      },
      loadingPageData: false,
      setHomepageData: (data: any) => set({ homepageData: data }),
      setLoadingPageData: (loading: boolean) => set({ loadingPageData: loading }),
      resetHomepageData: () =>
        set({
          homepageData: {
            featuredProducts: [],
            navigation: [],
            categories: [],
            topUsers: [],
            featuredCollectors: [],
            newestCostumes: [],
            trendingProductsCostumes: [],
            todayPick: [],
            newestProducts: [],
            liveAuction: [],
            featuredCollections: [],
          },
        }),
    }),
    {
      name: 'homepage-storage', // The key used to persist data in localStorage
      storage: customStorage, // Use custom storage for serializing data
    }
  )
);
