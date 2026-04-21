import { useEffect, useRef, type RefObject } from 'react';

/**
 * When the user scrolls the given container near the bottom, fetch the next infinite-query page.
 * Also runs once on mount / when deps change so short viewports can load past the first page.
 */
export function useFetchNextPageNearScrollEnd(opts: {
  scrollRootRef: RefObject<HTMLElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  /** Distance from bottom (px) before requesting the next page */
  threshold?: number;
}) {
  const { scrollRootRef, hasNextPage, isFetchingNextPage, fetchNextPage, threshold = 200 } = opts;
  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  useEffect(() => {
    const el = scrollRootRef.current;
    if (!el) return;

    const tryFetch = () => {
      if (!hasNextPage || isFetchingNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        fetchNextPageRef.current();
      }
    };

    el.addEventListener('scroll', tryFetch, { passive: true });
    tryFetch();
    return () => el.removeEventListener('scroll', tryFetch);
  }, [scrollRootRef, hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);
}
