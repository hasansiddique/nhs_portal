import { create } from 'zustand';

interface SearchState {
  isLoading: boolean;
  lastSearchedResults: any | null;
}

interface SearchActions {
  toggleIsLoading: (isLoading: boolean) => void;
  setLastSearchedResults: (result: any) => void;
}

interface SearchStore {
  searchState: SearchState;
  actions: SearchActions;
}

const useSearchStore = create<SearchStore>((set) => ({
  searchState: {
    isLoading: false,
    lastSearchedResults: null,
  },
  actions: {
    toggleIsLoading: (isLoading) =>
      set((state) => ({
        searchState: { ...state.searchState, isLoading },
      })),
    setLastSearchedResults: (result) =>
      set((state) => ({
        searchState: { ...state.searchState, lastSearchedResults: result },
      })),
  },
}));

export const useSearchState = () =>
  useSearchStore((state) => state.searchState);

export const useSearchActions = () => useSearchStore((state) => state.actions);
