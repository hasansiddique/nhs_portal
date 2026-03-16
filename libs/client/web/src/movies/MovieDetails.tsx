import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Dropdown, Spinner } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';

import { request } from '@your-props/client/utils';
import { FullPageSpinner } from '@your-props/client/ui';
import {
  GridIcon,
  ListIcon,
  SvgChevronDown,
  SvgSortIcon,
} from '@your-props/client/icons';

import imdb from '../../../logos/imdb.png';
import rotten from '../../../logos/rotten.png';
import metacritic from '../../../logos/metacritic.png';
import posterImage from '../theme/assets/images/avatar/poster 1.jpg';

import PropBackground from '../theme/assets/images/backgroup-secsion/cover-movie-detail.jpg';
import { FilterProps } from '../props/list/Props';
import ItemContent from '../props/list/ItemContent';

export const MovieDetails = () => {
  const params = useParams();
  const movieId = params.id || '';

  useEffect(() => {
    getPropsList();
    getFiltersData();
    getMoviesDetails();
  }, []);

  const [movieDetailsData, setMoviesDetailsData] = useState<any | null>([]);
  const [loadingMoviesDetails, setLoadingMoviesDetails] = useState(false);

  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });
  const [loadingMoreProps, setLoadingMoreProps] = useState(false);

  const [isGridView, setIsGridView] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('');

  const [filtersList, setFiltersList] = useState<FilterProps>();

  const [propsList, setPropsList] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);

  const getMoviesDetails = async () => {
    setLoadingMoviesDetails(true);

    try {
      const { data } = await request.get(`/movie-details/${movieId}`);
      setMoviesDetailsData(data?.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingMoviesDetails(false);
    }
  };

  const getFiltersData = useCallback(async () => {
    try {
      const { data } = await request.get('/discover-props-filters');
      setFiltersList(data?.data);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Network Error. Please try again later.';
      toast.error(String(message));
    }
  }, []);

  const getPropsList = async (isFetchMore = false, filter?: string) => {
    isFetchMore ? setLoadingMoreProps(true) : setLoadingProps(true);

    try {
      const { data } = await request.post('/props', {
        limit: 8,
        sorting: filter,
        movie_id: movieId,
        page: isFetchMore ? nextPageData.page + 1 : 1,
      });
      setPropsList((prevProps) =>
        isFetchMore && !filter
          ? [...prevProps, ...data?.data?.products]
          : data?.data?.products
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingProps(false);
      setLoadingMoreProps(false);
    }
  };

  const fetchMoreProps = async (filter?: string) => {
    if (filter) {
      setCurrentFilter(filter);
    }
    getPropsList(true, filter);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleIsExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  const getSortedByValue = useCallback(() => {
    const currSorting = filtersList?.sorting?.findIndex(
      (f) => f.id === currentFilter
    );
    return currSorting !== undefined && currSorting > -1
      ? filtersList?.sorting?.[currSorting]?.label
      : 'Sort By';
  }, [currentFilter]);

  return loadingMoviesDetails ? (
    <FullPageSpinner />
  ) : (
    <>
      <div
        className="relative overflow-hidden collapse-section "
        style={{
          height: isExpanded ? '100%' : '850px',
        }}
      >
        <section
          className="relative flat-title-page inner h-[600px]"
          style={{
            background: `linear-gradient(180deg, rgba(41, 41, 41, 0.00) 10.3%, rgba(41, 41, 41, 0.81) 77.32%, #292929 99.66%),
            url(${
              movieDetailsData?.posterPath || PropBackground
            }) lightgray center center no-repeat`,
            backgroundSize: 'cover',
          }}
        >
          <div className="themesflat-container">
            <div className="row">
              <div className="col-md-12">
                <div className="flex flex-row mt-[300px]">
                  <div>
                    <img
                      alt=""
                      className="w-[78px] h-[78px] rounded-[10px] object-cover"
                      src={movieDetailsData?.posterPath || posterImage}
                    />
                  </div>
                  <div className="flex flex-col ml-[18px]">
                    <h2 className="text-[36px] font-[700] leading-[44px]">
                      {movieDetailsData?.title}
                    </h2>
                    <p className="text-[#C5B6B3] text-[24px] font-[700] leading-[44px]">
                      {`${movieDetailsData?.totalProducts}+ Props`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="themesflat-container py-16">
            <div className="row">
              <div className="col-xl-8 col-lg-7 col-md-6">
                <div className="flex flex-wrap gap-6">
                  {movieDetailsData?.genre?.map((genre: string, index: any) => (
                    <div key={index} className="bg-[#393939E5] px-8 py-4 rounded-[10px] text-[18px] font-bold text-white">
                      {genre}
                    </div>
                  ))}
                </div>

                <p className="text-[18px] font-medium pt-10 text-justify">
                  {movieDetailsData?.overview}
                </p>

                <div className="my-[20px]">
                  <div className="table-responsive">
                    <table className="table border-0">
                      <tbody>
                        <tr>
                          <td className="border-0 p-0" width="12%">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Creators:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            {movieDetailsData?.creators?.length > 0 ? (
                              movieDetailsData?.creators?.map(
                                (creator: string, index: number) => (
                                  <p key={index} className="ml-2 text-[18px] text-[#EF6A3B] font-medium whitespace-nowrap">{`${creator} ${
                                    index !==
                                    movieDetailsData?.creators?.length - 1
                                      ? ' - '
                                      : ''
                                  }`}</p>
                                )
                              )
                            ) : (
                              <p className="ml-2 text-[18px] font-medium">N/A</p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="border-0 pt-0 px-0">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Actors:
                            </p>
                          </td>
                          <td className="border-0 flex pt-0 px-0 flex-wrap">
                            {movieDetailsData?.actors?.length > 0
                              ? movieDetailsData?.actors?.map(
                                  (actor: string, index: number) => (
                                    <p key={index} className="ml-2 text-[18px] text-[#EF6A3B] font-medium whitespace-nowrap">{`${actor}${
                                      index !==
                                      movieDetailsData?.actors?.length - 1
                                        ? ', '
                                        : ''
                                    }`}</p>
                                  )
                                )
                              : 'N/A'}
                          </td>
                        </tr>

                        <tr>
                          <td className="border-0 pb-0 px-0">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Language:
                            </p>
                          </td>
                          <td className="border-0 pb-0 px-0" width="40%">
                            <p className="ml-2 font-medium text-[18px] font-mediumwhitespace-nowrap">
                              {movieDetailsData?.language}
                            </p>
                          </td>
                          <td
                            className="d-xl-table-cell d-none border-0 pb-0 px-0"
                            width="12%"
                          >
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Released:
                            </p>
                          </td>
                          <td className="d-xl-table-cell d-none border-0 pb-0 px-0">
                            <p className="ml-2 font-medium text-[18px]whitespace-nowrap">
                              {movieDetailsData?.releaseDate}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="border-0 p-0">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Rated:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            <p className="ml-2 font-medium text-[18px]">
                              {movieDetailsData?.rated}
                            </p>
                          </td>
                          <td className="d-xl-table-cell d-none border-0 p-0">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Runtime:
                            </p>
                          </td>
                          <td className="d-xl-block d-none border-0 p-0">
                            <p className="ml-2 font-medium text-[18px]">
                              {movieDetailsData?.runtime}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="border-0 p-0">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Awards:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            {movieDetailsData?.awards
                              ?.split('&')
                              .map((item: string, index: any) => (
                                <p key={index} className="ml-2 font-medium text-[18px]">
                                  {item}
                                </p>
                              ))}
                          </td>
                        </tr>

                        <tr className="d-xl-none">
                          <td className="border-0 pb-0 px-0" width="12%">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Released:
                            </p>
                          </td>
                          <td className="border-0 pb-0 px-0">
                            <p className="ml-2 font-medium text-[18px] whitespace-nowrap">
                              {movieDetailsData?.releaseDate}
                            </p>
                          </td>
                        </tr>

                        <tr className="d-xl-none">
                          <td className="border-0 p-0">
                            <p className="font-extrabold text-[18px] leading-[24px] mt-[2px] w-36">
                              Runtime:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            <p className="ml-2 font-medium text-[18px]">
                              {movieDetailsData?.runtime}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-lg-5 col-md-6">
                <p className="text-[22px] font-bold text-[#EDE8E7]">Ratings</p>

                <div className="flex flex-col pt-6">
                  {movieDetailsData?.ratings?.map((rating: any, index: any) => (
                    <div key={index} className="flex flex-row rounded-2xl mb-12 w-full">
                      <p className="bg-[#393939] px-8 py-6 rounded-l-2xl text-[20px] font-bold text-[#EDE8E7] w-52 flex justify-center items-center">
                        {rating?.value}
                        {rating?.max ? (
                          <>
                            <sub className="text-[#676767]">/</sub>
                            <sub className="text-[#676767]">10</sub>
                          </>
                        ) : (
                          <span>{rating?.seperator}</span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 px-8 rounded-r-2xl border-[1px] border-[#393939] border-solid w-full overflow-hidden">
                        {rating?.source === 'Rotten Tomatoes' && (
                          <img
                            src={rotten}
                            alt="logo"
                            className="object-contain w-[30px] h-[32px]"
                          />
                        )}
                        {rating?.source === 'Internet Movie Database' && (
                          <img
                            src={imdb}
                            alt="logo"
                            className="object-contain w-[30px] h-[32px]"
                          />
                        )}
                        {rating?.source === 'Metacritic' && (
                          <img
                            src={metacritic}
                            alt="logo"
                            className="object-contain w-[30px] h-[32px]"
                          />
                        )}
                        <p className=" py-6 text-[18px] font-bold text-[#EDE8E7] truncate">
                          {rating?.source}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {!isExpanded && (
          <div className="absolute gradient bottom-0 w-full"></div>
        )}
      </div>

      <div className="flex justify-center relative bottom-[20px]">
        <button
          className="bg-[#EF6A3B] w-[40px] h-[40px] rounded-[100px] p-[6px] hover:opacity-90"
          onClick={toggleIsExpanded}
        >
          <SvgChevronDown
            className={`${isExpanded ? `rotate-180` : `rotate-0`}`}
          />
        </button>
      </div>

      {loadingProps ? (
        <Spinner />
      ) : (
        <section className="tf-section live-auctions featured-props-section">
          <div className="themesflat-container">
            <div className="row">
              <div className="flat-tabs items w-full">
                <div className="flex justify-end items-center w-full flex-row px-4">
                  <div className="option ">
                    <div className="view">
                      <ul>
                        <li
                          onClick={() => setIsGridView(true)}
                          className={`style1 grid ${
                            isGridView ? 'active' : 'cursor-pointer'
                          }`}
                        >
                          <a>
                            <GridIcon />
                            <span className="hidden md:block">Grid</span>
                          </a>
                        </li>
                        <li
                          onClick={() => setIsGridView(false)}
                          className={`style2 list ${
                            !isGridView ? 'active' : 'cursor-pointer'
                          }`}
                        >
                          <a>
                            <ListIcon />
                            <span className="hidden md:block">List</span>
                          </a>
                        </li>
                      </ul>
                    </div>

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

                      <Dropdown.Menu
                        style={{ margin: 0 }}
                        className="!top-0"
                      >
                        {filtersList?.sorting?.map((filter) => {
                          if (Number(filter?.id) <= 5) return null;
                          return (
                            <Dropdown.Item
                              className="bg-[#222222]"
                              key={filter.id}
                              onClick={() => fetchMoreProps(filter.id)}
                            >
                              {filter.label}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <ItemContent
                  loadingMoreProps={loadingMoreProps}
                  loadingFilteredProps={loadingProps}
                  fetchMoreProps={fetchMoreProps}
                  nextPageData={nextPageData}
                  propsList={propsList}
                  isGridView={isGridView}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
