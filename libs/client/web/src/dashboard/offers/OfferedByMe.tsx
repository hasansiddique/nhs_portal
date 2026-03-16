import { toast } from 'sonner';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import { request, timeAgo } from '@your-props/client/utils';
import {
  getItemPriceString,
  InfiniteScroll,
  NoContentPage,
  PropCartButton,
  Spinner,
} from '@your-props/client/ui';

import profileImage from '../../theme/assets/images/avatar/user-img.png';
import { toNumber } from 'lodash';

interface OfferProps {
  productTitle: string | undefined;
  productImage: string;
  productName: string;
  updatedAt: string;
  createdAt: string;
  username: string;
  comment: string;
  amount: string;
  status: string;
  review: string;
  avatar: string;
  rating: string;
  title: string;
  id: string;
  productId: string;
}

export const OfferedByMe = () => {
  const tableColumns = [
    'User',
    'Prop Title',
    'Offered Price',
    'Date Offered',
    'Status',
    'Actions',
  ];

  useEffect(() => {
    getOffersList();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id as string;

  const [offersList, setOfferList] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getOffersList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingOffers(true);

    try {
      const { data } = await request.post(`/offers-given`, {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      setOfferList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.offers] : data?.offers
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingOffers(false);
    }
  };

  const fetchMore = async () => {
    getOffersList(false, true);
  };

  const formatDate = (date: string) => {
    const formattedDate = format(new Date(), 'MMM dd, yyyy');
    return formattedDate.replace(/AM|PM/, (match) => match.toLowerCase());
  };

  return loadingOffers ? (
    <div className="flex justify-center items-center my-60 w-full">
      <Spinner loadingText="Loading..." className="text-primary text-[32px]" />
    </div>
  ) : offersList?.length > 0 ? (
    <div className="bg-[#3939394D] mt-[2.5rem] rounded-[8px] p-[26px]">
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
              hasNextPage={nextPageData?.page !== nextPageData?.totalPages}
              isFetchingNextPage={loadingOffers}
              isLoading={loadingOffers}
              fetchNextPage={fetchMore}
              data={offersList}
              itemRenderer={(item: OfferProps, index) => (
                <tr key={item?.productId}>
                  <td>
                    <div className="flex gap-5 items-center w-max">
                      <img
                        alt="userimg"
                        className="w-[34px] h-[34px] object-cover rounded-[10px] default_image"
                        src={item?.avatar || profileImage}
                      />
                      <p
                        title={item?.username}
                        className="text-[16px] text-truncate whitespace-nowrap"
                      >
                        {`${item?.username}`}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-5 items-center w-max">
                      <img
                        alt="Product"
                        className="w-[34px] h-[34px] object-cover rounded-[10px] default_image"
                        src={item?.productImage || profileImage}
                      />
                      <p
                        title={item?.productTitle}
                        className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                      >
                        {item?.productTitle}
                      </p>
                    </div>
                  </td>
                  <td>
                    <p
                      title={item?.amount}
                      className="text-[16px] leading-[20px] whitespace-nowrap"
                    >
                      ${getItemPriceString(item?.amount)}
                    </p>
                  </td>

                  <td>
                    <p className="text-[16px] leading-[35px] whitespace-nowrap">
                      {timeAgo(item?.updatedAt)}
                    </p>
                  </td>
                  <td>
                    <div
                      className={`text-center rounded-[10px] ${
                        item?.status === 'Pending'
                          ? 'pending'
                          : item?.status === 'Rejected'
                          ? 'rejected'
                          : 'accepted'
                      } border-solid border-2`}
                    >
                      <p className="text-[16px] whitespace-nowrap px-4">
                        {item?.status}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className={`text-center rounded-[10px] `}>
                      <p className="text-[16px] whitespace-nowrap px-4">
                        {item?.status === 'Accepted' ? (
                          <PropCartButton
                            isOrdersPage
                            showCartButton
                            isLoggedIn={true}
                            stock={toNumber(1)}
                            showSubmitButton={false}
                            itemId={toNumber(item?.productId)}
                          />
                        ) : (
                          '-'
                        )}
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
    <div className="mt-[2.5rem]">
      <NoContentPage subText="No offers found" isSpacing={false} />
    </div>
  );
};
