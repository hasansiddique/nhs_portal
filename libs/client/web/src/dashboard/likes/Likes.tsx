import { toast } from 'sonner';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import { InfiniteScroll, NoContentPage, Spinner } from '@your-props/client/ui';
import { request } from '@your-props/client/utils';

import { DashboardLayout } from '../Dashboard';
import profileImage from '../../theme/assets/images/avatar/user-img.png';

export const LikesPage = () => {
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
      label: 'Likes',
      isActive: true,
    },
  ];

  const tableColumns = ['Prop Title', 'Date Liked'];

  useEffect(() => {
    getLikesList();
  }, []);

  const [likesList, setLikesList] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getLikesList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingLikes(true);

    try {
      const { data } = await request.post('/user-likes', {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      setLikesList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.data?.likes] : data?.data?.likes
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingLikes(false);
    }
  };

  const fetchMore = async () => {
    getLikesList(false, true);
  };

  const formatDate = (date: string) => {
    const formattedDate = format(new Date(date), 'MMM dd, yyyy h:mm a');
    return formattedDate.replace(/AM|PM/, (match) => match.toLowerCase());
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingLikes ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : likesList?.length > 0 ? (
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
                    isFetchingNextPage={loadingLikes}
                    isLoading={loadingLikes}
                    fetchNextPage={fetchMore}
                    data={likesList}
                    itemRenderer={(
                      item: {
                        imageSmall: string;
                        avatar: string;
                        displayName: string;
                        username: string;
                        title: string;
                        createdAt: string;
                      },
                      index
                    ) => (
                      <tr key={index}>
                        <td>
                          <div className="flex gap-5 items-center w-full">
                            <img
                              alt="userimg"
                              className="w-[34px] h-[34px] rounded-[10px] default_image"
                              src={item?.imageSmall || profileImage}
                            />
                            <p
                              title={item.title}
                              className="flex-grow text-[16px] leading-[20px] text-truncate w-[12rem] whitespace-nowrap"
                            >
                              {item.title}
                            </p>
                          </div>
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
          <NoContentPage subText="No likes found" isSpacing={false} />
        )}
      </div>
    </DashboardLayout>
  );
};
