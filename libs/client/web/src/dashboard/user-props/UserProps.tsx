import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  PencilIcon,
  PlusIcon,
  SvgDashboardFollowersIcon,
  SvgDashboardLikeIcon,
  SvgDashboardPropIcon,
  SvgDashboardViewsIcon,
  SvgInfoIcon,
  SvgRocketIcon,
  SvgTrashIcon,
} from '@your-props/client/icons';
import {
  getItemPriceString,
  InfiniteScroll,
  NoContentPage,
  DashboardSkeleton,
  Tooltip,
  CircularChart,
  ProductViewsChart,
} from '@your-props/client/ui';
import {
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { request, PaymentCheck } from '@your-props/client/utils';

import { DashboardLayout } from '../Dashboard';
import { StatsCard } from '../stats/partials/StatsCard';
import profileImage from '../../theme/assets/images/avatar/user-img.png';

export const UserProps = () => {
  const tableColumns = [
    'Title',
    'Movie / TV Shows',
    'Views',
    'Listing Type',
    'Status',
    'Actions',
  ];

  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Dashboard',
      isActive: true,
    },
  ];

  useEffect(() => {
    getPropsList();
    getDashboardStats();
  }, []);

  const [statsData, setStatsData] = useState({
    propViewsByMonths: [],
    totalProps: 0,
    totalFollowers: 0,
    totalSold: 0,
    totalPropViews: 0,
    totalLikes: 0,
  });
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);

  const [loadingMoreProps, setLoadingMoreProps] = useState(false);
  const [propsList, setPropsList] = useState([]);

  const getDashboardStats = async () => {
    setLoadingStats(true);

    try {
      const { data } = await request.get('/dashboard');
      setStatsData(data?.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const getPropsList = async (isFetchMore = false) => {
    isFetchMore ? setLoadingMoreProps(true) : setLoadingProps(true);

    try {
      const { data } = await request.post('/props', {
        user_id: currentUser?.id,
        limit: 10,
        page: isFetchMore ? nextPageData.page + 1 : 1,
      });
      setPropsList((prevProps) =>
        isFetchMore
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

  const fetchMoreProps = async () => {
    getPropsList(true);
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingStats || loadingProps ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="flex stats-flex-direction gap-8 mb-[20px]">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col sm:flex-row gap-7">
                  <Link
                    to={`/user/${currentUser?.id}/details`}
                    className="stat-card"
                  >
                    <StatsCard
                      title="Props"
                      icon={SvgDashboardPropIcon}
                      count={statsData?.totalProps}
                    />
                  </Link>

                  <Link to="/dashboard/likes" className=" stat-card">
                    <StatsCard
                      title="Likes"
                      icon={SvgDashboardLikeIcon}
                      count={statsData?.totalLikes}
                    />
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-7">
                  <div className=" stat-card">
                    <StatsCard
                      title="Product Views"
                      icon={SvgDashboardViewsIcon}
                      count={statsData?.totalPropViews}
                    />
                  </div>
                  <Link to="/dashboard/follows" className=" stat-card">
                    <StatsCard
                      title="Followers"
                      icon={SvgDashboardFollowersIcon}
                      count={statsData?.totalFollowers}
                    />
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-8 w-full">
                <div className="bg-[#393939]/40 p-[24px] rounded-[10px] stat-chart-card w-full">
                  <div className="flex flex-row justify-between">
                    <p className="text-[16px] leading-[150%] text-[#C5B6B3]">
                      Listings
                    </p>
                  </div>

                  <div className="flex flex-col justify-center items-center h-full">
                    <CircularChart
                      total={statsData?.totalProps || 0}
                      sold={statsData?.totalSold || 0}
                    />
                  </div>
                </div>

                <div className="bg-[#393939]/40 p-[24px] !pb-[10px] rounded-[10px] stat-chart-card w-full">
                  <div className="pb-6">
                    <p className="text-[16px] leading-[150%] text-[#C5B6B3]">
                      Views
                    </p>
                  </div>

                  <ProductViewsChart data={statsData?.propViewsByMonths} />
                </div>
              </div>
            </div>

            {propsList?.length > 0 ? (
              <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
                <div className="flex wrap justify-between items-center mb-10">
                  <div>
                    <h5 className=" whitespace-nowrap">Your Props</h5>
                  </div>
                  <div className="flex justify-end gap-4 w-full spacing-mt">
                    <PaymentCheck addShowcaseAllowed>
                      <button className="flex flex-row items-center h-[38px] px-[15px] py-[12px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none">
                        <PlusIcon />
                        <span className="ml-[5px] font-medium">Add Item</span>
                      </button>
                    </PaymentCheck>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-custom border-0">
                    <thead className="thead-dark">
                      <tr className="bg-[#393939] rounded-[8px]">
                        {tableColumns.map((col, index) => (
                          <th
                            scope="col"
                            className="border-0 p-0 table-head"
                            key={index}
                          >
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
                        isFetchingNextPage={loadingMoreProps}
                        fetchNextPage={fetchMoreProps}
                        isLoading={loadingProps}
                        data={Array.from(
                          new Set(propsList.map((item: any) => item.id))
                        ).map((id) =>
                          propsList.find((item: any) => item.id === id)
                        )}
                        itemRenderer={(item: any, index) => (
                          <tr key={index}>
                            <td>
                              <Link title="Edit" to={`/${item.slug}`}>
                                <div className="flex gap-5 items-center w-max">
                                  <img
                                    alt="userimg"
                                    className="w-[42px] h-[42px] rounded-[10px] default_image"
                                    src={item?.imagePath || profileImage}
                                  />
                                  <p
                                    title={item?.title}
                                    className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                                  >
                                    {item?.title}
                                  </p>
                                </div>
                              </Link>
                            </td>

                            <td>
                              <p
                                title={item?.movieName}
                                className="text-[16px] whitespace-nowrap w-[15rem] text-truncate "
                              >
                                {item?.movieName || 'N/A'}
                              </p>
                            </td>

                            <td>
                              <div className="flex flex-row items-center">
                                <p className="text-[16px] whitespace-nowrap">
                                  {item?.productViews}
                                </p>

                                <span className="cursor-pointer ml-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span aria-label="Info">
                                          <SvgInfoIcon />
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="right"
                                        className="border-[#C5B6B3] w-auto rounded-[4px] bg-[#393939]/90 p-0"
                                        align="center"
                                      >
                                        <div className="px-[16px] py-[10px]">
                                          <div className="flex flex-row items-center">
                                            <p className="text-[#C5B6B3] text-[16px] leading-[130%]">
                                              Yesterday:
                                            </p>
                                            <p className="text-white text-[16px] leading-[130%] ml-1">
                                              {item?.productViewsYesterday}
                                            </p>
                                          </div>
                                          <div className="flex flex-row items-center">
                                            <p className="text-[#C5B6B3] text-[16px] leading-[130%]">
                                              Last 30 Days:
                                            </p>
                                            <p className="text-white text-[16px] leading-[130%] ml-1">
                                              {item?.productViews30Days}
                                            </p>
                                          </div>
                                        </div>
                                        <TooltipArrow
                                          className="TooltipArrow"
                                          fill="#393939E5"
                                          width={20}
                                          height={12}
                                        />
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </span>
                              </div>
                            </td>

                            <td className="flex flex-col justify-center h-[85px]">
                              <p className="text-[16px] whitespace-nowrap">
                                {item?.listingTypeName}
                              </p>

                              {item?.listingType === 'sell_on_site' ||
                              item?.listingType === 'bidding' ? (
                                <div className="flex flex-row gap-2 items-center">
                                  <p className="text-[#C5B6B3] text-[16px] leading-[130%]">
                                    {item?.listingType === 'bidding'
                                      ? // eslint-disable-next-line eqeqeq
                                        item?.bidsCount == 0
                                        ? 'Starting Bid'
                                        : 'Highest Bid'
                                      : 'Buy Now'}
                                    :
                                  </p>
                                  <p className="text-[16px] leading-[130%]">
                                    {`$${getItemPriceString(item?.price)}`}
                                  </p>
                                </div>
                              ) : null}
                            </td>

                            <td>
                              {item?.statusLabel && (
                                <div className="text-center rounded-[10px] bg-[#29953A33] border-[#109A2E] border-solid border-2">
                                  <p className="text-[16px] whitespace-nowrap px-4">
                                    {item?.statusLabel}
                                  </p>
                                </div>
                              )}
                            </td>

                            <td>
                              <div className="flex gap-4 justify-center items-center">
                                {item?.statusLabel === 'In Bidding' ? (
                                  <span className="disabled">
                                    <PencilIcon
                                      fill="#8181814d"
                                      width={22}
                                      height={22}
                                    />
                                  </span>
                                ) : (
                                  <Link
                                    title="Edit"
                                    to={`/dashboard/props/${item.id}/update`}
                                  >
                                    <PencilIcon width={22} height={22} />
                                  </Link>
                                )}

                                <Link title="Details" to={`/${item.slug}`}>
                                  <SvgRocketIcon width={22} height={22} />
                                </Link>

                                <a title="Delete" href="/">
                                  <SvgTrashIcon width={22} height={22} />
                                </a>
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
              <NoContentPage
                subText="You haven’t added any props yet"
                showButton={true}
                isHeight={true}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
