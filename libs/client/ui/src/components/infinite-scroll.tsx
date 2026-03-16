import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Spinner } from './spinner';

export function InfiniteScroll({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isTable = true,
  isClassName = false,
  itemRenderer,
}: {
  data?: any;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isTable?: boolean;
  isClassName?: boolean;
  itemRenderer: (item: any, idx: number) => React.ReactNode;
}) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && inView && hasNextPage)
      fetchNextPage();
  }, [inView]);

  return (
    <>
      {isLoading && <Spinner />}

      {data && (
        <>
          {!isTable ? (
            <>
              <div
                className={`${
                  isClassName ? 'row' : 'flex flex-wrap '
                } pt-[40px]`}
              >
                {data?.map(itemRenderer)}

                {isFetchingNextPage && (
                  <div className="flex justify-center items-center my-10 w-full">
                    <Spinner />
                  </div>
                )}
              </div>

              <div className="h-1 shadow-top-line" />

              <div ref={ref} className="invisible">
                load more when in view
              </div>
            </>
          ) : (
            <>
              {data?.map(itemRenderer)}

              {isFetchingNextPage && (
                <div className="flex justify-center items-center my-10 w-full">
                  <Spinner />
                </div>
              )}

              <tr ref={ref} className="invisible">
                <td>load more when in view</td>
              </tr>
            </>
          )}
        </>
      )}
    </>
  );
}
