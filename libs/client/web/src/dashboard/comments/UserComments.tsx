import { toast } from 'sonner';
import { format } from 'date-fns';
import { Modal } from 'react-bootstrap';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { request } from '@your-props/client/utils';
import { SvgTrashIcon } from '@your-props/client/icons';
import { InfiniteScroll, NoContentPage, Spinner } from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';
import profileImage from '../../theme/assets/images/avatar/user-img.png';
import { DeletePopup } from './Comments';
import { useNavigate } from 'react-router-dom';

export const UserCommentsPage = () => {
  const tableColumns = ['Prop', 'Comment', 'Date Added', 'Actions'];

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
      label: 'Comments',
      isActive: true,
    },
  ];

  useEffect(() => {
    getCommentsList();
  }, []);

  const [showModal, setShowModal] = useState('');
  const [commentsList, setCommentList] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });

  const navigate = useNavigate();

  const getCommentsList = async (showLoader = true, fetchMore = false) => {
    if (showLoader) {
      setLoadingComments(true);
    }
    if (fetchMore) {
      setLoadingMore(true);
    }

    try {
      const { data } = await request.post('/comments/sent', {
        limit: 10,
        page: fetchMore ? nextPageData.page + 1 : 1,
      });
      setCommentList((prevProps) =>
        fetchMore ? [...prevProps, ...data?.comments] : data?.comments
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { data } = await request.delete(`/delete-comment/${commentId}`);
      getCommentsList(false);
      setShowModal('');
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const fetchMore = async () => {
    getCommentsList(false, true);
  };

  const formatDate = (date: string) => {
    const formattedDate = format(new Date(date), 'MMM dd, yyyy h:mm a');
    return formattedDate.replace(/AM|PM/, (match) => match.toLowerCase());
  };

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id as string;

  return loadingComments ? (
    <div className="flex justify-center items-center my-60 w-full">
      <Spinner loadingText="Loading..." className="text-primary text-[32px]" />
    </div>
  ) : commentsList?.length > 0 ? (
    <div className="bg-[#3939394D] rounded-[8px] p-[26px] mt-[2.5rem]">
      {showModal !== '' && (
        <DeletePopup
          setShowModal={setShowModal}
          showModal={showModal !== ''}
          handleDelete={() => handleDelete(showModal)}
          title="Are you sure you want to delete this comment?"
          btnTitle="Confirm"
          isSpacing={false}
        />
      )}
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
              isFetchingNextPage={loadingComments}
              isLoading={loadingComments}
              fetchNextPage={fetchMore}
              data={commentsList}
              itemRenderer={(item: any, index) =>
                item.userId === userId ? (
                  <tr key={index} className="cursor-pointer">
                    <td onClick={() => navigate(`/${item.productSlug}`)}>
                      <div className="flex gap-5 items-center w-max">
                        <div
                          className={`rounded-[10px] ${
                            item?.productImage ? '' : 'bg-[#303030]'
                          }`}
                        >
                          <img
                            alt="Product"
                            className={`"w-[34px] h-[34px] rounded-[10px] ${
                              item?.productImage
                                ? 'object-cover'
                                : 'object-contain p-[5px]'
                            }`}
                            src={item?.productImage || profileImage}
                          />
                        </div>
                        <p
                          title={item?.title}
                          className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                        >
                          {item?.title}
                        </p>
                      </div>
                    </td>
                    <td onClick={() => navigate(`/${item.productSlug}`)}>
                      <p
                        title={item?.comment}
                        className="text-[16px] max-h-[105px] overflow-y-auto leading-[20px]"
                      >
                        {item?.comment}
                      </p>
                    </td>
                    <td onClick={() => navigate(`/${item.productSlug}`)}>
                      <p className="text-[16px] leading-[35px] whitespace-nowrap">
                        {formatDate(item?.createdAt)}
                      </p>
                    </td>
                    <td>
                      <span
                        onClick={() => setShowModal(item?.id)}
                        className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center cursor-pointer"
                      >
                        <SvgTrashIcon />
                      </span>
                    </td>
                  </tr>
                ) : (
                  ''
                )
              }
            />
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="mt-[2.5rem]">
      <NoContentPage subText="No Comments found" isSpacing={false} />
    </div>
  );
};
