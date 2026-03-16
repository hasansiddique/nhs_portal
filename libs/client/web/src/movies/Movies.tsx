import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  InfiniteScroll,
  MovieGridCard,
  NoContentPage,
  Spinner,
} from '@your-props/client/ui';
import { request } from '@your-props/client/utils';
import img1 from '../theme/assets/images/box-item/card-item-3.jpg';
import { Dropdown } from 'react-bootstrap';
import { SvgSortIcon } from '@your-props/client/icons';

export const MoviesListing = () => {
  const [sortingOptions] = useState([
    { id: 1, label: 'Latest Addition' },
    { id: 2, label: 'Most Items' },
  ]);

  const [moviesList, setMoviesList] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingMoreMovies, setLoadingMoreMovies] = useState(false);
  const [currentSorting, setCurrentSorting] = useState<number | null>(null);

  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getMoviesList = async (isFetchMore = false) => {
    let nextPage = 1;

    if (isFetchMore) {
      setLoadingMoreMovies(true);
      nextPage = nextPageData.page + 1;

      if (nextPage > nextPageData.totalPages) {
        nextPage = nextPageData.totalPages;
      }
    } else {
      setLoadingMovies(true);
    }

    try {
      const { data } = await request.post(`/movie-props`, {
        limit: 9,
        page: nextPage,
        sorting: currentSorting,
      });

      setMoviesList((prevMovies) =>
        isFetchMore ? [...prevMovies, ...data?.data] : data?.data
      );

      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingMovies(false);
      setLoadingMoreMovies(false);
    }
  };

  const fetchMoreMovies = async () => {
    getMoviesList(true);
  };

  const getSortedByValue = useCallback(() => {
    const currSorting = sortingOptions.findIndex(
      (f) => f.id === currentSorting
    );

    return currSorting !== undefined && currSorting > -1
      ? sortingOptions[currSorting].label
      : 'Sort By';
  }, [currentSorting]);

  useEffect(() => {
    setNextPageData({
      page: 1,
      totalPages: 0,
    });
    getMoviesList();
  }, [currentSorting]);

  return (
    <section className="tf-section featured-props-section pt-[20px] lg:pt-[30px]">
      <div className="themesflat-container">
        {loadingMovies ? (
          <div
            className="flex justify-center items-center w-full"
            style={{ height: `calc(100vh - 290px)` }}
          >
            <Spinner className="text-primary text-[32px]" />
          </div>
        ) : moviesList.length > 0 ? (
          <div className="flat-tabs items w-full">
            <div className="flex justify-between">
              <div className="">
                <div className="heading-live-auctions">
                  <h2 className="tf-title pb-0 text-left">Top Movies</h2>
                </div>
              </div>

              <div className="option justify-end">
                <Dropdown>
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="btn-sort-by dropdown"
                  >
                    <SvgSortIcon />
                    <span className="mr-[10px] hidden md:block">
                      {getSortedByValue()}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="!top-[18px]">
                    {sortingOptions.map((filter) => (
                      <Dropdown.Item
                        key={filter.id}
                        onClick={() => {
                          setCurrentSorting(filter.id);
                        }}
                      >
                        {filter.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <InfiniteScroll
              isTable={false}
              isClassName={true}
              hasNextPage={nextPageData?.page !== nextPageData?.totalPages}
              isFetchingNextPage={loadingMoreMovies}
              isLoading={loadingMovies}
              fetchNextPage={fetchMoreMovies}
              data={moviesList}
              itemRenderer={(item, index) => {
                return (
                  <Link
                    key={index}
                    to={`/movies/${item.id}/details`}
                    className={`movie-card fl-item col-xl-4 col-md-6`}
                  >
                    <MovieGridCard
                      redirectLink={`/movies/${item.id}/details`}
                      item={{
                        ...item,
                        title: item.title,
                        name: `${item.totalProducts} Prop${
                          item.totalProducts > 1 ? 's' : ''
                        }`,
                        wishlist: item.totalProductsLikes,
                        imgAuthor: item.posterPath || img1,
                        totalImages: item.productImages.length,
                        imgright1: item.productImages?.[0]?.image || img1,
                        imgright2: item.productImages?.[1]?.image || img1,
                        imgright3: item.productImages?.[2]?.image || img1,
                        imgleft: item.productImages?.[3]?.image || img1,
                      }}
                    />
                  </Link>
                );
              }}
            />
          </div>
        ) : (
          <div className="mt-[2.5rem]">
            <NoContentPage subText="No Movies found" isSpacing={false} />
          </div>
        )}
      </div>
    </section>
  );
};
