import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import {formatDate, getUserId, request, timeAgo} from '@your-props/client/utils';
import {
  getItemPriceString,
  InfiniteScroll,
  NoContentPage,
  Spinner,
} from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';
import profileImage from '../../theme/assets/images/avatar/user-img.png';

interface AuctionProps {
  userId: string;
  productSlug: string;
  endTime: string;
  lastBid: string;
  userBid: string;
  isActive: string;
  bidsCount: string;
  highestBid: string;
  startingPrice: string;
  productImage: string;
  productTitle: string;
  id: string;
  status: string;
}

export const AuctionsPage = () => {
  const tableColumns = [
    'Prop',
    'Bids',
    'Highest',
    'Your Bid',
    'Latest',
    'Ending',
    'Status'
  ];

  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Dashboard',
      isActive: false,
      redirectUrl: '/dashboard/props',
    },
    {
      label: 'Auctions',
      isActive: true,
    },
  ];

  useEffect(() => {
    getAuctionList();
  }, []);

  const navigate = useNavigate();
  const userId = getUserId();

  const [auctionList, setAuctionList] = useState([]);
  const [loadingAuction, setLoadingAuction] = useState(true);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getAuctionList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingAuction(true);

    try {
      const { data } = await request.get(`/user-auctions`);
      setAuctionList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.data] : data?.data
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingAuction(false);
    }
  };

  const fetchMore = async () => {
    getAuctionList(false, true);
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingAuction ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : auctionList?.length > 0 ? (
          <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
            <div className="table-responsive">
              <table className="table table-custom comment border-0">
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
                    isFetchingNextPage={loadingAuction}
                    isLoading={loadingAuction}
                    fetchNextPage={fetchMore}
                    data={auctionList}
                    itemRenderer={(item: AuctionProps) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/${item.productSlug}`)}
                      >
                        <td>
                          <div className="flex gap-5 items-center w-max">
                            <img
                              alt="Product"
                              className="w-[34px] h-[34px] rounded-[10px] default_image"
                              src={item.productImage}
                            />
                            <p
                              title={item?.productTitle}
                              className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                            >
                              {item?.productTitle || '-'}
                            </p>
                          </div>
                        </td>
                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {item?.bidsCount || 0}
                          </p>
                        </td>
                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {`$${getItemPriceString(item?.highestBid || 0)}`}
                          </p>
                        </td>
                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {item?.userId == userId ? (<span className="inline-block text-center small leading-[16px]">Own<br />Auction</span>) : `$${getItemPriceString(item?.userBid || 0)}`}
                          </p>
                        </td>
                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {item.lastBid ? timeAgo(item.lastBid) : ''}
                          </p>
                        </td>
                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {timeAgo(item.endTime)}
                          </p>
                        </td>
                        <td>
                          <div
                            className={`text-center rounded-[10px] border-solid border ${
                              item?.status == 1 ? 'accepted' :
                                item?.status == 2 ? 'pending' : 'rejected'
                            }`}
                          >
                            <p className="text-[16px] whitespace-nowrap px-4">
                              {item?.status == 1 ? 'Active' :
                                item?.status == 2 ? 'Starting soon' : 'Ended'}
                            </p>
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
          <NoContentPage subText="No auctions found" isSpacing={false}/>
        )}
      </div>
    </DashboardLayout>
  );
};
