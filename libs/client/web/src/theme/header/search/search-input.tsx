import { toast } from 'sonner';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Spinner } from '@your-props/client/ui';
import { SvgSearchIcon } from '@your-props/client/icons';
import { request, useDebounce } from '@your-props/client/utils';

import { useSearchActions, useSearchState } from './use-search-store';

type SearchProps = {
  canSearch?: boolean;
  handleClearSearch: () => void;
};

export const SearchProps: React.FC<SearchProps> = ({
  canSearch = true,
  handleClearSearch,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for detecting clicks outside

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  const [searchValue, setSearchText] = useState(query || '');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  const { toggleIsLoading, setLastSearchedResults } = useSearchActions();
  const { isLoading, lastSearchedResults } = useSearchState();
  const debouncedSearchQuery = useDebounce(searchValue, 300);

  useEffect(() => {
    if (debouncedSearchQuery) {
      getSearchSuggestions(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSearchSuggestions = async (searchText: string) => {
    toggleIsLoading(true);
    setLastSearchedResults([]);
    try {
      const { data } = await request.post(
        `/props`,
        {
          page: 1,
          limit: 5,
          q: searchText,
        },
        {},
        true,
        true
      );
      setLastSearchedResults(data?.data?.products);
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load props');
    } finally {
      toggleIsLoading(false);
    }
  };

  return (
    <div className="mt-[7px] w-full" ref={searchContainerRef}>
      <div className="relative">
        <div className="w-[513px] h-full items-center relative hidden xl:flex">
          <input
            required
            type="text"
            value={searchValue}
            disabled={!canSearch}
            onClick={() => {
              query && setIsDropdownVisible(true);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              const searchValue = e.currentTarget.value.trim();

              if (e.key === 'Enter') {
                setIsDropdownVisible(false);
                searchParams.set('q', searchValue);
                navigate(`/props?${searchParams.toString()}`);
              } else if (searchValue === '') {
                setIsDropdownVisible(false);
                searchParams.delete('q');
                navigate(`/props?${searchParams.toString()}`);
              }
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
              setIsDropdownVisible(true);
            }}
            placeholder="Find appointments or services"
            className="search w-[513px] !text-[14px] !h-[48px] !rounded-2xl !pl-20 !bg-[#222222] !text-white !border-0"
          />
          <div className="absolute left-0 ml-[14px]">
            <SvgSearchIcon />
          </div>
          {searchValue && (
            <div
              onClick={() => {
                handleClearSearch();
                setSearchText('');
                setIsDropdownVisible(false);
              }}
              className="absolute right-[12px] cursor-pointer text-white"
            >
              ✖
            </div>
          )}
        </div>

        {isDropdownVisible && (
          <div className="w-[513px] rounded-2xl absolute z-50 mt-1 overflow-y-auto bg-[#393939] py-1">
            {isLoading ? (
              <div className="flex justify-center p-2">
                <Spinner />
              </div>
            ) : lastSearchedResults && lastSearchedResults.length > 0 ? (
              <>
                {lastSearchedResults.map((item: any) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 flex w-full cursor-pointer flex-row items-center text-[16px] hover:bg-[#8a8aa04d]"
                    onClick={() => {
                      setSearchText('');
                      setIsDropdownVisible(false);
                      navigate(`/${item.slug}`);
                    }}
                  >
                    <div className="flex h-12 w-12">
                      <img
                        className="rounded-[4px]"
                        src={item?.imagePath}
                        alt=""
                      />
                    </div>
                    <span className="flex w-full ml-4 font-[500] capitalize flex-row justify-between text-white">
                      {item.title}
                    </span>
                  </div>
                ))}

                {nextPageData?.totalPages > 1 && (
                  <div
                    className="p-4 cursor-pointer text-center text-[16px] hover:bg-[#5b5b5b99] border-t-[1px] bg-[#5b5b5b] m-2 rounded-[4px]"
                    onClick={() => {
                      handleClearSearch();
                      setSearchText('');
                      setIsDropdownVisible(false);
                      navigate(`/props?q=${searchValue}`);
                    }}
                  >
                    Show All
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-[16px]">{`No props found against value "${searchValue}"`}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
