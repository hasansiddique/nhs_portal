import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { request, timeAgo, formatDate } from '@your-props/client/utils';
import { InfiniteScroll, NoContentPage, Spinner } from '@your-props/client/ui';

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
  id: string;
}

export const SalesPage = () => {
  const tableColumns = [
    // 'Buyer',
    'Prop',
    'Price',
    'Added',
    'Last Update',
    'Status',
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
      label: 'Sales',
      isActive: true,
    },
  ];

  useEffect(() => {
    getOrdersList();
  }, []);

  const navigate = useNavigate();

  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getOrdersList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingOrders(true);

    try {
      const { data } = await request.post(`/fetch-order`, {
        type: 'seller',
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
    }
  };

  const fetchMore = async () => {
    getOrdersList(false, true);
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingOrders ? (
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
                        {/*<td>*/}
                        {/*  <div className="flex gap-5 items-center w-max">*/}
                        {/*    <img*/}
                        {/*      alt="userimg"*/}
                        {/*      className="w-[34px] h-[34px] object-cover rounded-[10px] default_image"*/}
                        {/*      src={item?.buyerAvatar || profileImage}*/}
                        {/*    />*/}
                        {/*    <p*/}
                        {/*      title={`${item?.buyerName}`}*/}
                        {/*      className="text-[16px] text-truncate whitespace-nowrap"*/}
                        {/*    >*/}
                        {/*      {`${item?.buyerName}`}*/}
                        {/*    </p>*/}
                        {/*  </div>*/}
                        {/*</td>*/}
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
                            title={`$${item?.productTotalPrice}`}
                            className="text-[16px] leading-[35px] whitespace-nowrap"
                          >
                            ${item?.productTotalPrice || 0}
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
                          <div className="text-center rounded-[10px] bg-[#29953A33] border-[#109A2E] border-solid border-2">
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
        ) : (
          <NoContentPage subText="No orders found" isSpacing={false} />
        )}
      </div>
    </DashboardLayout>
  );
};
