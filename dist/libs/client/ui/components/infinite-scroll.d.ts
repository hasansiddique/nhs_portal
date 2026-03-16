export declare function InfiniteScroll({ data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isTable, isClassName, itemRenderer, }: {
    data?: any;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isTable?: boolean;
    isClassName?: boolean;
    itemRenderer: (item: any, idx: number) => React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
