import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { request, timeAgo } from '@your-props/client/utils';
import { InfiniteScroll, NoContentPage, Spinner } from '@your-props/client/ui';

interface DisputeProps {
  sellerUsername: string;
  buyerUsername: string;
  orderNumber: string;
  description: string;
  createdAt: string;
  status: string;
  id: string;
}

export const SellerDisputes = () => {
  const tableColumns = [
    'Order Number',
    'User Name',
    'Seller Name',
    'Description',
    'Date Added',
    'Status',
  ];

  const navigate = useNavigate();

  useEffect(() => {
    getOrdersList();
  }, []);

  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getOrdersList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingOrders(true);

    try {
      const { data } = await request.post(`/seller-disputes`, {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      console.log(data);
      setOrdersList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.disputes] : data?.disputes
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

  return loadingOrders ? (
    <div className="flex justify-center items-center my-60 w-full">
      <Spinner loadingText="Loading..." className="text-primary text-[32px]" />
    </div>
  ) : ordersList?.length > 0 ? (
    <div className="bg-[#3939394D] mt-[2.5rem]  rounded-[8px] p-[26px]">
      <div className="table-responsive">
        <table className="table table-custom comment border-0">
          <thead className="thead-dark">
            <tr className="bg-[#393939] rounded-[8px]">
              {tableColumns.map((col, index) => (
                <th scope="col" className="border-0 p-0 table-head">
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
              isFetchingNextPage={loadingOrders}
              isLoading={loadingOrders}
              fetchNextPage={fetchMore}
              data={ordersList}
              itemRenderer={(item: DisputeProps, index) => (
                <tr key={index} className="cursor-pointer">
                  <td
                    onClick={() =>
                      navigate(`/dashboard/disputes/${item.id}/details/seller`)
                    }
                  >
                    <p
                      title={item?.orderNumber}
                      className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                    >
                      {item?.orderNumber}
                    </p>
                  </td>

                  <td
                    onClick={() =>
                      navigate(`/dashboard/disputes/${item.id}/details/seller`)
                    }
                  >
                    <div className="flex gap-5 items-center w-max">
                      <p
                        title={`${item?.buyerUsername}`}
                        className="text-[16px] text-truncate whitespace-nowrap capitalize"
                      >
                        {`${item?.buyerUsername}`}
                      </p>
                    </div>
                  </td>

                  <td
                    onClick={() =>
                      navigate(`/dashboard/disputes/${item.id}/details/seller`)
                    }
                  >
                    <div className="flex gap-5 items-center w-max">
                      <p
                        title={`${item?.sellerUsername}`}
                        className="text-[16px] text-truncate whitespace-nowrap capitalize"
                      >
                        {`${item?.sellerUsername}`}
                      </p>
                    </div>
                  </td>

                  <td
                    onClick={() =>
                      navigate(`/dashboard/disputes/${item.id}/details/seller`)
                    }
                  >
                    <p
                      title={item?.description}
                      className="text-[16px] leading-[35px] whitespace-nowrap"
                    >
                      {item?.description}
                    </p>
                  </td>

                  <td
                    onClick={() =>
                      navigate(`/dashboard/disputes/${item.id}/details/seller`)
                    }
                  >
                    <p className="text-[16px] leading-[35px] whitespace-nowrap">
                      {timeAgo(item?.createdAt)}
                    </p>
                  </td>

                  <td
                    onClick={() =>
                      navigate(`/dashboard/disputes/${item.id}/details/seller`)
                    }
                  >
                    <div className="text-center rounded-[10px] bg-[#29953A33] border-[#109A2E] border-solid border-2">
                      <p className="text-[16px] whitespace-nowrap px-4 capitalize">
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
    <div className="mt-[2.5rem]">
      <NoContentPage subText="No disputes found" isSpacing={false} />
    </div>
  );
};
