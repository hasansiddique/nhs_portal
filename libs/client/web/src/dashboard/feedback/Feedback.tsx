import { toast } from 'sonner';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import { request } from '@your-props/client/utils';
import { InfiniteScroll, NoContentPage, Spinner } from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';
import profileImage from '../../theme/assets/images/avatar/user-img.png';

interface FeedbackProps {
  productImage: string;
  productName: string;
  createdAt: string;
  displayName: string;
  comment: string;
  review: string;
  avatar: string;
  rating: string;
  title: string;
  id: string;
}

export const FeedbacksPage = () => {
  const tableColumns = ['Name', 'Prop', 'Rating', 'Review', 'Date Added'];

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
      label: 'Feedback',
      isActive: true,
    },
  ];

  useEffect(() => {
    getFeedbacksList();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id as string;

  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getFeedbacksList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingFeedbacks(true);

    try {
      const { data } = await request.post(`/seller-reviews/${userId}`, {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      setFeedbackList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.data] : data?.data
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const fetchMore = async () => {
    getFeedbacksList(false, true);
  };

  const formatDate = (date: string) => {
    const formattedDate = format(new Date(date), 'MMM dd, yyyy h:mm a');
    return formattedDate.replace(/AM|PM/, (match) => match.toLowerCase());
  };

  console.log(feedbackList?.length);
  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingFeedbacks ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : feedbackList?.length > 0 ? (
          <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
            <div className="table-responsive">
              <table className="table table-custom comment border-0">
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
                    isFetchingNextPage={loadingFeedbacks}
                    isLoading={loadingFeedbacks}
                    fetchNextPage={fetchMore}
                    data={feedbackList}
                    itemRenderer={(item: FeedbackProps, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex gap-5 items-center w-max">
                            <div
                              className={`rounded-[10px] ${
                                item?.avatar ? '' : 'bg-[#303030]'
                              }`}
                            >
                              <img
                                alt="userimg"
                                className={`w-[34px] h-[34px] rounded-[10px] ${
                                  item?.avatar
                                    ? 'object-cover'
                                    : 'object-contain p-[5px]'
                                }`}
                                src={item?.avatar || profileImage}
                              />
                            </div>
                            <p
                              title={item?.displayName}
                              className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                            >
                              {item?.displayName}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-5 items-center w-max">
                            <img
                              alt="Product"
                              className="w-[34px] h-[34px] rounded-[10px] default_image"
                              src={item?.productImage || profileImage}
                            />
                            <p
                              title={item?.productName}
                              className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                            >
                              {item?.productName}
                            </p>
                          </div>
                        </td>
                        <td>
                          <p
                            title={item?.rating}
                            className="text-[16px] max-h-[105px] overflow-y-auto leading-[20px]"
                          >
                            {item?.rating}/5
                          </p>
                        </td>
                        <td>
                          <p
                            title={item?.review}
                            className="text-[16px] max-h-[105px] overflow-y-auto leading-[20px]"
                          >
                            {item?.review}
                          </p>
                        </td>
                        <td>
                          <p className="text-[16px] leading-[35px] whitespace-nowrap">
                            {formatDate(item?.createdAt)}
                          </p>
                        </td>
                      </tr>
                    )}
                  />
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <NoContentPage subText="No feedback found" isSpacing={false} />
        )}
      </div>
    </DashboardLayout>
  );
};
