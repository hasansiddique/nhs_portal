import { isEmpty, map } from 'lodash';
import { toast } from 'sonner';
import { Dropdown } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState, useCallback, useRef } from 'react';

import { request } from '@your-props/client/utils';
import {
  FiltersIcon,
  GridIcon,
  SvgSortIcon,
  ListIcon,
  SvgCloseIcon,
} from '@your-props/client/icons';

import ItemContent from './ItemContent';
import { PropFilters } from './PropFilters';
import Cookies from 'js-cookie';
import { Breadcrumbs } from '@your-props/client/ui';

export interface ActiveFilterProps {
  filterType: string;
  value: string;
  name?: string;
  id?: string;
}

interface FilterSubCategoryProps {
  categoryName: string;
  name: string;
  id: string;
}

export interface FilterSortingProps {
  label: string;
  id: string;
}

export interface FilterProps {
  productCategories: FilterSubCategoryProps[];
  productSaleTypes: FilterSubCategoryProps[];
  productTypes: FilterSubCategoryProps[];
  collections: FilterSortingProps[];
  sorting: FilterSortingProps[];
}

export const PropListing = () => {
  const location = useLocation();
  const abortPropControllerRef = useRef<AbortController | null>(null);

  const [appliedFilters, setAppliedFilters] = useState<ActiveFilterProps[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [loadingState, setLoadingState] = useState({
    filters: false,
    props: false,
    filteredProps: true,
    moreProps: false,
  });
  const [filtersList, setFiltersList] = useState<FilterProps>();
  const [propsList, setPropsList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchSaved, setSearchSaved] = useState(false);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  useEffect(() => {
    getFiltersData();
  }, []);

  useEffect(() => {
    if (filtersList) {
      const initialFilters: ActiveFilterProps[] = [];
      for (const [key, values] of searchParams.entries()) {
        values.split(',').forEach((value) => {
          let arrayKey;
          if (key !== 'q' && key !== 'sorting') {
            if (key === 'sale_type') {
              arrayKey = 'productSaleTypes';
            }
            if (key === 'category') {
              arrayKey = 'productCategories';
            }
            if (key === 'type') {
              arrayKey = 'productTypes';
            }
            if (key === 'collections') {
              arrayKey = 'collections';
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const selectedFilter = filtersList?.[arrayKey]?.find(
              (i: { id: string }) => i.id === value
            );
            initialFilters.push({
              filterType: key,
              value,
              name: selectedFilter?.name,
            });
          } else {
            initialFilters.push({ filterType: key, value });
          }
        });
      }

      setAppliedFilters(initialFilters);
      getPropsList(initialFilters, false);
    }
  }, [searchParams, location.search, filtersList]);

  const updateQueryParams = (filters: ActiveFilterProps[]) => {
    const params: { [key: string]: string } = {};
    filters.forEach((filter) => {
      if (!params[filter.filterType]) {
        params[filter.filterType] = '';
      }
      params[filter.filterType] = params[filter.filterType]
        ? `${params[filter.filterType]},${filter.value}`
        : filter.value;
    });
    setSearchParams(params);
  };

  const getFlatFilters = (filters?: ActiveFilterProps[]) => {
    return filters?.reduce(
      (acc: Record<string, any>, { filterType, value }) => {
        if (
          filterType === 'q' ||
          filterType === 'sorting' ||
          filterType === 'page' ||
          filterType === 'offset'
        ) {
          acc[filterType] = value;
        } else {
          if (!acc[filterType]) {
            acc[filterType] = [];
          }
          acc[filterType].push(value);
        }
        return acc;
      },
      {}
    );
  };

  const getPropsList = useCallback(
    async (
      filters?: ActiveFilterProps[],
      showTopLoading = true,
      isFetchMore = false
    ) => {
      if (abortPropControllerRef.current) {
        abortPropControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortPropControllerRef.current = abortController;

      setLoadingState((prev) => ({
        ...prev,
        props: showTopLoading && !isFetchMore,
        filteredProps: !showTopLoading && !isFetchMore,
        moreProps: isFetchMore,
      }));

      const allFilters = getFlatFilters(filters);
      try {
        const { data } = await request.post(
          '/props',
          {
            ...allFilters,
            limit: 20,
            page: isFetchMore ? nextPageData.page + 1 : 1,
          },
          {},
          true,
          true,
          abortController.signal
        );

        setPropsList((prevProps) =>
          isFetchMore
            ? [...prevProps, ...data?.data?.products]
            : data?.data?.products
        );

        setNextPageData(data?.pager);
        setSearchSaved(data?.data?.searchSaved);

        setLoadingState((prev) => ({
          ...prev,
          props: false,
          filteredProps: false,
          moreProps: false,
        }));
      } catch (err: any) {
        if (err.name === 'CanceledError') {
          return;
        }

        const message =
          err.response?.data?.message ||
          'Network Error. Please try again later.';
        toast.error(String(message));

        setLoadingState((prev) => ({
          ...prev,
          props: false,
          filteredProps: false,
          moreProps: false,
        }));
      }
    },
    [nextPageData]
  );

  const getFiltersData = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, filters: true }));
    try {
      const { data } = await request.get('/discover-props-filters');
      const productTypesFilters = data?.data?.productTypes || [];
      const updatedTypeFilters = [
        ...productTypesFilters,
        {
          id: '100',
          hidden: '0',
          name: 'Screen Matched',
          description: 'Screen Matched',
        },
      ];
      const finalFilters = {
        ...data?.data,
        productTypes: updatedTypeFilters,
      };
      setFiltersList(finalFilters);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Network Error. Please try again later.';
      toast.error(String(message));
    } finally {
      setLoadingState((prev) => ({ ...prev, filters: false }));
    }
  }, []);

  const handleOnFilterClick = useCallback(
    (filter: ActiveFilterProps) => {
      let updatedFilters = [...appliedFilters];

      if (filter?.filterType === 'sorting') {
        // Remove existing sorting filter
        updatedFilters = updatedFilters.filter(
          (f) => f.filterType !== 'sorting'
        );

        // Add new sorting filter
        updatedFilters.push(filter);

        // If sorting is changed to '3' or '4', ensure sale_type includes only '2'
        if (['3', '4'].includes(filter.value)) {
          updatedFilters = updatedFilters.filter(
            (f) => f.filterType !== 'sale_type' || f.value === '2'
          );

          // Ensure sale_type contains '2'
          if (
            !updatedFilters.some(
              (f) => f.filterType === 'sale_type' && f.value === '2'
            )
          ) {
            updatedFilters.push({ filterType: 'sale_type', value: '2' });
          }
        }
      } else if (filter?.filterType === 'sale_type') {
        // Allow multiple selections for sale_type
        const existingSaleTypes = updatedFilters.filter(
          (f) => f.filterType === 'sale_type'
        );

        if (existingSaleTypes.some((f) => f.value === filter.value)) {
          // If the sale_type is already selected, remove it
          updatedFilters = updatedFilters.filter(
            (f) => !(f.filterType === 'sale_type' && f.value === filter.value)
          );
        } else {
          // Otherwise, add the new sale_type
          updatedFilters.push(filter);
        }

        // If sorting was '3' or '4' and sale_type includes anything other than '2', reset sorting to '1'
        const sortingFilter = updatedFilters.find(
          (f) => f.filterType === 'sorting'
        );
        const saleTypeValues = updatedFilters
          .filter((f) => f.filterType === 'sale_type')
          .map((f) => f.value);

        if (
          sortingFilter &&
          ['3', '4'].includes(sortingFilter.value) &&
          (saleTypeValues.length > 1 || !saleTypeValues.includes('2'))
        ) {
          updatedFilters = updatedFilters.filter(
            (f) => f.filterType !== 'sorting'
          );
          updatedFilters.push({ filterType: 'sorting', value: '1' });
        }
      } else {
        // For other filters, toggle them as usual
        const filterIndex = updatedFilters.findIndex(
          (f) => f.value === filter.value && f.filterType === filter.filterType
        );

        if (filterIndex >= 0) {
          updatedFilters.splice(filterIndex, 1);
        } else {
          updatedFilters.push(filter);
        }
      }

      getPropsList(updatedFilters, false);
      setAppliedFilters(updatedFilters);
      updateQueryParams(updatedFilters);
    },
    [appliedFilters, getPropsList]
  );

  const resetFilters = () => {
    setAppliedFilters([{ filterType: 'sorting', value: '1' }]);
    setSearchParams({ sorting: '1' });
  };

  const prepareFiltersForSave = (initialFilters = null) => {
    const newFilters: Record<string, any> = {};
    const allFilters = getFlatFilters(initialFilters || appliedFilters);

    map(allFilters, (value, key) => {
      if (key !== 'sorting') {
        if (key === 'type') {
          newFilters['filters[prop_type]'] = value;
        } else if (key === 'sale_type') {
          newFilters['filters[sale_type]'] = value;
        } else if (key === 'q') {
          newFilters['search'] = value;
        } else if (key === 'category') {
          newFilters['filters[categories]'] = value;
        } else {
          newFilters[`filters[${key}]`] = value;
        }
      }
    });

    return newFilters;
  };

  const handleSaveSearch = async () => {
    const newFilters = prepareFiltersForSave();

    try {
      const { data } = await request.post('/save-search', {
        ...newFilters,
      });

      setSearchSaved(true);
      toast.success(data.message);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Network Error. Please try again later.';
      toast.error(String(message));
    }
  };

  const getSortedByValue = useCallback(() => {
    const currIndex = appliedFilters?.findIndex(
      (f) => f.filterType === 'sorting'
    );
    const currSorting = filtersList?.sorting?.findIndex(
      (f) => f.id === appliedFilters[currIndex]?.value
    );
    return currSorting !== undefined && currSorting > -1
      ? filtersList?.sorting?.[currSorting]?.label
      : 'Sort By';
  }, [appliedFilters, filtersList]);

  const fetchMoreProps = async () => {
    getPropsList([...appliedFilters], false, true);
  };

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  const filterPillList = appliedFilters.filter(
    (item) => item.filterType !== 'q' && item.filterType !== 'sorting'
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setShowFilters(false);
      } else {
        setShowFilters(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const searchFilter = appliedFilters.find(
    (filter) => filter.filterType === 'q'
  );

  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    ...(appliedFilters.length > 1
      ? [
          {
            label: 'Filtered',
            isActive: false,
          },
        ]
      : []),
    {
      label: searchFilter
        ? `${nextPageData?.totalItems || 0} Result${
            nextPageData?.totalItems != 1 ? 's' : ''
          } for '${searchFilter.value}'`
        : `${nextPageData?.totalItems || 0} Result${
            nextPageData?.totalItems != 1 ? 's' : ''
          }`,
      isActive: true,
    },
  ];

  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />
      <section className="featured-props-section pt-[20px] lg:pt-[30px]">
        <div className="themesflat-container">
          <div className="row">
            <PropFilters
              showFilters={showFilters}
              filtersList={filtersList}
              appliedFilters={appliedFilters}
              handleOnFilterClick={handleOnFilterClick}
              setShowFilters={setShowFilters}
              resetFilters={resetFilters}
            />

            <div
              className={`${
                showFilters ? 'col-xl-9 col-lg-8' : 'col-xl-12 col-lg-12'
              } col-md-12`}
            >
              <div className="home-8">
                <section className="tf-section featured-props-section pt-0">
                  <div className="themesflat-container p-0">
                    <div className="row">
                      <div className="flat-tabs items w-full">
                        <div className="flex justify-between w-full flex-row px-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                setShowFilters(!showFilters);
                              }}
                              className="flex items-center gap-2 h-[44px] w-auto md:w-[110px] px-[14px] py-[10px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] text-[18px] font-bold leading-[24px] focus:bg-[#EF6A3B] hover:opacity-90 text-white"
                            >
                              <FiltersIcon
                                fill="white"
                                width={24}
                                height={24}
                              />
                              <span className="ml-2 hidden md:block">
                                Filters
                              </span>
                            </button>

                            {isLoggedIn &&
                              !loadingState.filteredProps &&
                              !searchSaved && (
                                <div
                                  onClick={handleSaveSearch}
                                  className="hidden md:block ml-4 text-[16px] font-bold leading-[24px] cursor-pointer hover:text-orange-500"
                                >
                                  Save Search
                                </div>
                              )}
                          </div>

                          <div className="option justify-end">
                            <div className="view ">
                              <ul>
                                <li
                                  onClick={() => setIsGridView(true)}
                                  className={`style1 grid ${
                                    isGridView ? 'active' : 'cursor-pointer'
                                  }`}
                                >
                                  <a>
                                    <GridIcon />
                                    <span className="hidden md:block">
                                      Grid
                                    </span>
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
                                    <span className="hidden md:block">
                                      List
                                    </span>
                                  </a>
                                </li>
                              </ul>
                            </div>

                            <Dropdown>
                              <Dropdown.Toggle
                                id="dropdown-basic"
                                className="btn-sort-by dropdown "
                              >
                                <SvgSortIcon />
                                <span className="mr-[10px] hidden md:block">
                                  {getSortedByValue()}
                                </span>
                              </Dropdown.Toggle>

                              <Dropdown.Menu
                                className="!top-[18px]"
                                style={{ margin: 0 }}
                              >
                                {filtersList?.sorting?.map((filter) => {
                                  if (Number(filter?.id) > 5) return null;

                                  return (
                                    <Dropdown.Item
                                      key={filter.id}
                                      className="bg-[#222222]"
                                      onClick={() =>
                                        handleOnFilterClick({
                                          filterType: 'sorting',
                                          value: filter.id,
                                        })
                                      }
                                    >
                                      {filter.label}
                                    </Dropdown.Item>
                                  );
                                })}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>

                        {/* selected filters */}
                        {filterPillList.length > 0 && (
                          <div className="flex gap-4 mx-4 pt-[30px] overflow-hidden overflow-x-auto pb-0 -mb-[6px]">
                            {filterPillList.map(
                              (item: ActiveFilterProps, i) => (
                                <div
                                  key={i}
                                  className=" bg-[#393939E5] rounded-[10px] h-[46px] max-w-[190px] pl-4 pr-2 flex items-center justify-between gap-4"
                                >
                                  <p
                                    title={item.name}
                                    className="text-[15px] font-bold text-truncate capitalize"
                                  >
                                    {item.name}
                                  </p>
                                  <div
                                    onClick={() =>
                                      handleOnFilterClick({
                                        filterType: item.filterType,
                                        value: item.value,
                                        name: item.name,
                                      })
                                    }
                                    className="cursor-pointer text-[12px]"
                                  >
                                    <SvgCloseIcon fill="#EF6A3B" width={16} />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        <ItemContent
                          loadingFilteredProps={loadingState.filteredProps}
                          loadingMoreProps={loadingState.moreProps}
                          fetchMoreProps={fetchMoreProps}
                          nextPageData={nextPageData}
                          showFilters={showFilters}
                          propsList={propsList}
                          isGridView={isGridView}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
