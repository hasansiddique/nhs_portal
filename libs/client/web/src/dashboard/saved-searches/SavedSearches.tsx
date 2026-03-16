import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';

import { InfiniteScroll, NoContentPage, Spinner } from '@your-props/client/ui';
import { request } from '@your-props/client/utils';
import {SvgRocketIcon, SvgTrashIcon} from '@your-props/client/icons';

import { DashboardLayout } from '../Dashboard';
import {useNavigate} from "react-router-dom";

interface SavedSearchesProps {
  id: string;
  searchTerm: string;
  searchFilters: {
    parameters: {
      collections: [name: string];
      categories: [name: string];
      propType: [name: string];
      saleType: [name: string];
    };
  };
}

export const SavedSearchesPage = () => {

  const navigate = useNavigate();

  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: 'Dashboard',
      isActive: false,
      redirectUrl: '/dashboard/props',
    },
    {
      label: 'Saved Searches',
      isActive: true,
    },
  ];

  const tableColumns = [
    'Query',
    'Listing Type',
    'Categories',
    'Type',
    'Collections',
    'Actions',
  ];

  useEffect(() => {
    getSearchesList();
  }, []);

  const [searchesList, setSearchesList] = useState([]);
  const [loadingSearches, setLoadingSearches] = useState(false);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getSearchesList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingSearches(true);

    try {
      const { data } = await request.post('/search-history', {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      setSearchesList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.searchHistory] : data?.searchHistory
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingSearches(false);
    }
  };

  const fetchMore = async () => {
    getSearchesList(false, true);
  };

  const handleSearchDelete = async (searchId: string) => {
    try {
      const { data } = await request.delete(`/delete-search/${searchId}`);
      getSearchesList(false);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const viewSearchResults = (search: SavedSearchesProps) => {
    const queryParams = new URLSearchParams({ sorting: '1' });

    const saleTypes = search.searchFilters.parameters.saleType
      .map((s: any) => s.id)
      .join(',');
    if (saleTypes) queryParams.append('sale_type', saleTypes);

    const categories = search.searchFilters.parameters.categories
      .map((c: any) => c.id)
      .join(',');
    if (categories) queryParams.append('category', categories);

    const propTypes = search.searchFilters.parameters.propType
      .map((p: any) => p.id)
      .join(',');
    if (propTypes) queryParams.append('type', propTypes);

    if (search.searchTerm) queryParams.append('q', search.searchTerm);

    navigate(`/props?${queryParams.toString()}`);
  }

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingSearches ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : searchesList?.length > 0 ? (
          <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
            <div className="table-responsive">
              <table className="table table-custom border-0">
                <thead className="thead-dark">
                  <tr className="bg-[#393939] rounded-[8px]">
                    {tableColumns.map((col, index) => (
                      <th scope="col" className="border-0 p-0 table-head" key={index}>
                        <p className="font-bold whitespace-nowrap text-[16px] py-[13px] px-[17px]">
                          {col}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <InfiniteScroll
                    hasNextPage={
                      nextPageData?.page !== nextPageData?.totalPages
                    }
                    isFetchingNextPage={loadingSearches}
                    isLoading={loadingSearches}
                    fetchNextPage={fetchMore}
                    data={searchesList}
                    itemRenderer={(item: SavedSearchesProps, index) => (
                      <tr key={index}>
                        <td>
                          <p
                            className="text-[14px] capitalize"
                          >
                            {item?.searchTerm ? item?.searchTerm : '-'}
                          </p>
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-2">
                            {item.searchFilters?.parameters?.saleType &&
                            item.searchFilters?.parameters?.saleType.length >
                              0 ? (
                              item.searchFilters.parameters.saleType.map(
                                (f: any, index) => (
                                  <span key={index} className="inline bg-[#393939]/90 whitespace-nowrap px-6 py-3 rounded-[10px] text-[14px] font-medium">
                                    {f.name}
                                  </span>
                                )
                              )
                            ) : (
                              <p className="text-[14px] leading-[35px] whitespace-nowrap px-6">-</p>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-2">
                            {item.searchFilters?.parameters?.categories &&
                            item.searchFilters?.parameters?.categories.length >
                              0 ? (
                              item.searchFilters.parameters.categories.map(
                                (f: any, index) => (
                                  <span key={index} className="bg-[#393939]/90 whitespace-nowrap px-6 py-3 rounded-[10px] text-[14px] font-medium">
                                    {f.name}
                                  </span>
                                )
                              )
                            ) : (
                              <p className="text-[14px] leading-[35px] whitespace-nowrap px-6">-</p>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-2">
                            {item.searchFilters?.parameters?.propType &&
                            item.searchFilters?.parameters?.propType.length >
                              0 ? (
                              item.searchFilters.parameters.propType.map(
                                (f: any, index) => (
                                  <span key={index} className="bg-[#393939]/90 whitespace-nowrap px-6 py-3 rounded-[10px] text-[14px] font-medium">
                                    {f.name}
                                  </span>
                                )
                              )
                            ) : (
                              <p className="text-[14px] leading-[35px] whitespace-nowrap px-6">-</p>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-2">
                            {item.searchFilters?.parameters?.collections &&
                            item.searchFilters?.parameters?.collections.length >
                              0 ? (
                              item.searchFilters.parameters.collections.map(
                                (f: any, index) => (
                                  <span key={index} className="bg-[#393939]/90 whitespace-nowrap px-6 py-3 rounded-[10px] text-[14px] mr-3 font-medium">
                                    {f.name}
                                  </span>
                                )
                              )
                            ) : (
                              <p className="text-[14px] leading-[35px] whitespace-nowrap px-6">-</p>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex">
                            <span
                              onClick={() => viewSearchResults(item)}
                              className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center cursor-pointer"
                            >
                              <SvgRocketIcon/>
                            </span>

                            <span
                              onClick={() => handleSearchDelete(item.id)}
                              className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center cursor-pointer"
                            >
                              <SvgTrashIcon/>
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  />
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <NoContentPage subText="No searches found" isSpacing={false}/>
        )}
      </div>
    </DashboardLayout>
  );
};
