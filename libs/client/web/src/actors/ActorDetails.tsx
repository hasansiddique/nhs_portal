import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';

import { Breadcrumbs, Spinner } from '@your-props/client/ui';
import { request } from '@your-props/client/utils';

import ItemContent from '../props/list/ItemContent';
import { TabPanel, Tabs } from 'react-tabs';
import { GridIcon, ListIcon, SvgSortIcon } from '@your-props/client/icons';


export const ActorDetails = () => {
  const params = useParams();
  const actorId = params.id || '';

  const [isGridViewTwo, setIsGridViewTwo] = useState(true);
  const [currentSorting, setCurrentSorting] = useState<number | null>(null);

  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const [propsList, setPropsList] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingMoreProps, setLoadingMoreProps] = useState(false);
  const [propActorName, setPropActorName] = useState('');

  const [sortingOptions] = useState([
    { id: 1, label: 'Newest First'},
    { id: 2, label: 'Oldest First'},
  ]);

  const getPropsList = async (isFetchMore = false) => {
    let nextPage = 1;

    if(isFetchMore) {
      setLoadingMoreProps(true);
      nextPage = nextPageData.page + 1;

      if(nextPage > nextPageData.totalPages) {
        nextPage = nextPageData.totalPages;
      }
    } else {
      setLoadingProps(true);
    }

    try {
      const { data } = await request.post('/props', {
        limit: 8,
        sorting: currentSorting,
        actor_id: actorId,
        page: nextPage,
      });

      setPropsList((prevProps) =>
        isFetchMore
          ? [...prevProps, ...data?.data?.products]
          : data?.data?.products
      );
      setPropActorName(data?.data?.actorName || '');
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingProps(false);
      setLoadingMoreProps(false);
    }
  };

  const fetchMoreProps = async () => {
    getPropsList(true);
  };

  const getSortedByValue = useCallback(() => {
    const currSorting = sortingOptions.findIndex((f) => f.id === currentSorting);

    return currSorting !== undefined && currSorting > -1
      ? sortingOptions[currSorting].label
      : 'Sort By';
  }, [currentSorting]);

  useEffect(() => {
    getPropsList();
  }, []);

  useEffect(() => {
    setNextPageData({
      page: 1,
      totalPages: 0,
    });
    getPropsList();
  }, [currentSorting]);

  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: 'Actors',
      isActive: false,
      redirectUrl: '/actors',
    },
    {
      label: `${propActorName}`,
      isActive: true,
    },
  ];

  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      {loadingProps ? (
        <div className="flex justify-center items-center w-full" style={{ height: `calc(100vh - 290px)` }}>
          <Spinner />
        </div>
      ) : (
        <section className="tf-section live-auctions featured-props-section  !pt-[20px] lg:!pt-[30px]">
          <div className="themesflat-container">
            <div className="row">
              <div className="flat-tabs items w-full">
                <div className="flex justify-end items-center w-full px-4">
                  <div className="option">
                    <div className="view">
                      <ul>
                        <li
                          onClick={() => setIsGridViewTwo(true)}
                          className={`style1 grid ${
                            isGridViewTwo ? 'active' : 'cursor-pointer'
                          }`}
                        >
                          <a>
                            <GridIcon />
                            <span className="hidden md:block">Grid</span>
                          </a>
                        </li>
                        <li
                          onClick={() => setIsGridViewTwo(false)}
                          className={`style2 list ${
                            !isGridViewTwo ? 'active' : 'cursor-pointer'
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

                      <Dropdown.Menu style={{ margin: 0 }}>
                        {sortingOptions.map((filter, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              onClick={() => {
                                setCurrentSorting(filter.id);
                              }}
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
                  isGridView={isGridViewTwo}
                  propsList={propsList}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
