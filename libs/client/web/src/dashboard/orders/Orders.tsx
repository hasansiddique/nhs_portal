import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import {request, formatDate, timeAgo} from '@your-props/client/utils';
import {
  getItemPriceString,
  InfiniteScroll,
  NoContentPage,
  Spinner,
} from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';
import profileImage from '../../theme/assets/images/avatar/user-img.png';

interface OrdersProps {
  productTotalPrice: string;
  sellerAvatar: string;
  productImage: string;
  productTitle: string;
  buyerAvatar: string;
  updatedAt: string;
  buyerName: string;
  createdAt: string;
  displayName: string;
  lastName: string;
  comment: string;
  status: string;
  review: string;
  avatar: string;
  rating: string;
  title: string;
  totalOrderPrice: string;
  id: string;
}

export const OrdersPage = () => {
  const tableColumns = ['Prop Name', 'Total Amount', 'Added', 'Last Update', 'Status'];

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
      label: 'Orders',
      isActive: true,
    },
  ];

  useEffect(() => {
    getOrdersList();
  }, []);

  const navigate = useNavigate();

  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getOrdersList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingOrders(true);

    try {
      const { data } = await request.post(`/fetch-order`, {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      setOrdersList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.orders] : data?.orders
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingOrders(false);
      setIsFirstLoad(false);
    }
  };

  const fetchMore = async () => {
    getOrdersList(false, true);
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingOrders && isFirstLoad ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : ordersList?.length > 0 ? (
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
                    isFetchingNextPage={loadingOrders}
                    isLoading={loadingOrders}
                    fetchNextPage={fetchMore}
                    data={ordersList}
                    itemRenderer={(item: OrdersProps, index) => (
                      <tr
                        key={index}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/dashboard/orders/${item.id}/details`
                          )
                        }
                      >
                        <td>
                          <div className="flex gap-5 items-center w-max">
                            <img
                              alt="Product"
                              className="w-[34px] h-[34px] rounded-[10px] default_image"
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
                            title={
                              item?.totalOrderPrice
                                ? `$${getItemPriceString(
                                  item?.totalOrderPrice
                                )}`
                                : '$0'
                            }
                            className="text-[16px] leading-[35px] whitespace-nowrap"
                          >
                            {item?.totalOrderPrice
                              ? `$${getItemPriceString(item?.totalOrderPrice)}`
                              : '$0'}
                          </p>
                        </td>

                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {formatDate(item?.createdAt)}
                          </p>
                        </td>
                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {timeAgo(item?.updatedAt)}
                          </p>
                        </td>
                        <td>
                          <div
                            className="max-w-[250px] text-center rounded-[10px] bg-[#29953A33] border-[#109A2E] border-solid border-2">
                            <p className="text-[16px] whitespace-nowrap px-4">
                              {item?.status}
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
        ) : !isFirstLoad ? (
          <NoContentPage subText="No orders found" isSpacing={false} />
        ) : (
          ''
        )}
      </div>
    </DashboardLayout>
  );
};
