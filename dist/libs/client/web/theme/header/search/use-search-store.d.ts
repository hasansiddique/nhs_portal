interface SearchState {
    isLoading: boolean;
    lastSearchedResults: any | null;
}
interface SearchActions {
    toggleIsLoading: (isLoading: boolean) => void;
    setLastSearchedResults: (result: any) => void;
}
export declare const useSearchState: () => SearchState;
export declare const useSearchActions: () => SearchActions;
export {};
