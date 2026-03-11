import { toast } from 'sonner';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import { InfiniteScroll, NoContentPage, Spinner } from '@your-props/client/ui';
import { SvgBlockIcon } from '@your-props/client/icons';
import { request } from '@your-props/client/utils';

import { DeletePopup } from '../comments/Comments';
import profileImage from '../../theme/assets/images/avatar/user-img.png';

interface FollowerProps {
  dateFollowed: string;
  username: string;
  avatar: string;
  id: string;
}

export const FollowersPage = () => {
  const tableColumns = ['Name', 'Date Followed', 'Actions'];

  useEffect(() => {
    getFollowersList();
  }, []);

  const [showModal, setShowModal] = useState('');
  const [followersList, setFollowersList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const getFollowersList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingFollowers(true);

    try {
      const { data } = await request.post('/followers', {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      setFollowersList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.data] : data?.data
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchMore = async () => {
    getFollowersList(false, true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { data } = await request.post(`/follower/remove`, {
        follower_id: id,
      });
      getFollowersList(false);
      setShowModal('');
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const formatDate = (date: string) => {
    const formattedDate = format(new Date(date), 'MMM dd, yyyy h:mm a');
    return formattedDate.replace(/AM|PM/, (match) => match.toLowerCase());
  };

  return loadingFollowers ? (
    <div className="flex justify-center items-center my-60 w-full">
      <Spinner loadingText="Loading..." className="text-primary text-[32px]" />
    </div>
  ) : followersList?.length > 0 ? (
    <div className="bg-[#3939394D] rounded-[8px] p-[26px] mt-[2.5rem]">
      {showModal !== '' && (
        <DeletePopup
          setShowModal={setShowModal}
          showModal={showModal !== ''}
          handleDelete={() => handleDelete(showModal)}
          title="Are you sure you want to unfollow?"
          btnTitle="Confirm"
          isSpacing={false}
        />
      )}

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
              isFetchingNextPage={loadingFollowers}
              isLoading={loadingFollowers}
              fetchNextPage={fetchMore}
              data={followersList}
              itemRenderer={(item: FollowerProps, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex gap-5 items-center w-max">
                      <div className={`rounded-[10px] ${item?.avatar ? '' : 'bg-[#303030]'}`}>
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
                        title={item?.username}
                        className="text-[16px] text-truncate w-[12rem] whitespace-nowrap capitalize"
                      >
                        {item?.username}
                      </p>
                    </div>
                  </td>

                  <td>
                    <p className="text-[16px] leading-[35px] whitespace-nowrap">
                      {formatDate(item?.dateFollowed)}
                    </p>
                  </td>
                  <td className="flex">
                    <span
                      title="Unfollow"
                      onClick={() => setShowModal(item?.id)}
                      className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center cursor-pointer"
                    >
                      <SvgBlockIcon/>
                    </span>
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
      <NoContentPage subText="No followers found" isSpacing={false} />
    </div>
  );
};
