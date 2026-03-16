import { toast } from 'sonner';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {request, timeAgo} from '@your-props/client/utils';
import { NoContentPage, Spinner } from '@your-props/client/ui';

import { DashboardLayout } from '../../Dashboard';
import { DisputeMessages } from '../DisputeMessages';

import profileImage from '../../../theme/assets/images/avatar/user-img.png';

export const SellerDisputeDetailsPage = () => {
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
      label: 'Dispute Details',
      isActive: true,
    },
  ];

  const params = useParams();
  const disputeId = params.id as string;

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const currentUserId = currentUser?.id;

  useEffect(() => {
    getDisputeDetails();
    getDisputeMessagesList();
  }, []);

  const [disputeDetails, setDisputeData] = useState({
    sellerId: '',
    userId: '',
    createdAt: '',
    buyerAvatar: '',
    buyerUsername: '',
    orderNumber: '',
    reason: '',
    description: '',
  });
  const [loadingDispute, setLoadingDispute] = useState(false);
  const [disputeMessagesList, setDisputeMessagesList] = useState([]);

  const getDisputeDetails = async () => {
    setLoadingDispute(true);

    try {
      const { data } = await request.get(`/dispute/${disputeId}`);
      setDisputeData(data?.dispute);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingDispute(false);
    }
  };

  const getDisputeMessagesList = async () => {
    try {
      const { data } = await request.post(`/dispute-messages/${disputeId}`, {});
      setDisputeMessagesList(data?.messages);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }

    const formattedDate = format(new Date(date), 'MMM dd, yyyy h:mm a');
    return formattedDate.replace(/AM|PM/, (match) => match.toLowerCase());
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingDispute ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : disputeDetails ? (
          <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
            <div className="flex justify-between bg-[#393939]/90 rounded-[10px] p-[40px]">
              <div className="flex flex-col">
                <p className="uppercase text-[18px] text-[#C5B6B3] font-bold leading-[26px]">
                  Buyer Details
                </p>

                <div className="mt-2">
                  <Link
                    to={`/user/${disputeDetails?.userId}/details`}
                    className="hover:text-inherit"
                  >
                    <div className="flex flex-row">
                      <div className="rounded-[10px] items-center justify-center">
                        <img
                          alt="User"
                          width={50}
                          height={50}
                          src={disputeDetails?.buyerAvatar || profileImage}
                          className="rounded-[10px] h-[50px] w-[50px] object-cover default_image"
                        />
                      </div>

                      <div className="justify-between flex flex-col ml-[15px]">
                        <span className="text-[18px] font-bold leading-[22px] capitalize hover:text-white focus:text-white">
                          {`${disputeDetails?.buyerUsername}`}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#393939]/90 rounded-[10px] p-[40px] my-[20px]">
              <div className="row">
                <div className="col-md-12">
                  <p className="uppercase text-[18px] text-[#C5B6B3] font-bold leading-[26px] mb-3">
                    Dispute Details
                  </p>

                  <p className="text-[18px]  leading-[26px] mb-3">
                    <b>Dispute Number:</b> #{disputeDetails?.orderNumber}
                  </p>

                  <p className="text-[18px] leading-[26px] mb-3">
                    <b>Dispute Date: </b>
                    <span>{formatDate(disputeDetails?.createdAt)}</span>
                  </p>

                  <p className="text-[18px] leading-[26px] mb-3">
                    <b>Dispute Reason: </b>
                    <span>{disputeDetails?.reason || '-'}</span>
                  </p>

                  <p className="text-[18px] leading-[26px] mb-3">
                    <b>Dispute Details: </b>
                    <span>{disputeDetails?.description || '-'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#393939]/90 rounded-[10px] p-[40px] my-[20px]">
              <div className="row">
                <div className="col-md-12">
                  <p className="text-[18px] font-bold pb-10">Chat with Buyer</p>

                  <div className="flex flex-col">
                    {disputeMessagesList &&
                      disputeMessagesList?.map(
                        (message: {
                          senderId: string;
                          createdAt: string;
                          id: string;
                          message: string;
                        }) => (
                          <div
                            className={`${
                              message?.senderId === currentUserId
                                ? 'self-end'
                                : 'self-start'
                            } bg-[#222]/90 rounded-[10px] w-[70%] px-[26px] py-[20px] mt-8 whitespace-break-spaces break-words`}
                          >
                            <p>{message?.message}</p>
                            <p className="text-[12px] leading-[14px] font-normal text-[#C5B6B3] mt-4">
                              {timeAgo(message?.createdAt)}
                            </p>
                          </div>
                        )
                      )}
                  </div>

                  <DisputeMessages
                    getDisputeMessagesList={getDisputeMessagesList}
                    disputeId={disputeId}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NoContentPage subText="No Dispute details found" isSpacing={false} />
        )}
      </div>
    </DashboardLayout>
  );
};
