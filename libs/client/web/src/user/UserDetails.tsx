import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Breadcrumbs,
  CardsSkeleton,
  InfiniteScroll,
  NoContentPage,
  ProfileSkeleton,
  PropCard,
} from '@your-props/client/ui';
import {request, useAuthDialogStore, useInboxActions} from '@your-props/client/utils';
import { SvgFollow, SvgStarIconSm } from '@your-props/client/icons';

import { UserRatings } from './UserRatings';

import profileImage from '../theme/assets/images/avatar/user-img.png';
import img1 from '../theme/assets/images/box-item/image-box-47.jpg';
import { MessagesPage } from '../dashboard/messages/Messages';
import { UserFollow } from './partials/UserFollow';
import { SignIn } from '../auth/SignIn';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';

export const UserDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const currentSelectedUser = params.id;
  const { toggleMessageDialogVisibility } = useAuthDialogStore();
  const { initiateChat } = useInboxActions();

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id as string;

  const dialogClassName =
    'w-auto m-[20px] md:my-[30px] md:mx-auto md:max-w-[1000px]';

  useEffect(() => {
    getUsersProps();
    getProfileDetails();
  }, [currentSelectedUser]);

  const [selectedPropFilter, setSelectedPropFilter] = useState('all');
  const [userDetailProps, setUserDetailsProps] = useState([]);
  const [nextPageData, setNextPageData] = useState({
    page: 1,
    totalPages: 0,
  });
  const [loadingUserDetails, setLoadingUserDetails] = useState(true);
  const [loadingMoreProps, setLoadingMoreProps] = useState(false);
  const [initiatingChat, setInitiatingChat] = useState(false);

  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profileData, setProfileData] = useState({
    userDetails: {
      username: '',
      avatar: '',
      aboutMe: '',
      averageRating: '',
      totalSold: '',
    },
    totalFollowers: '',
    totalFollowing: '',
    isFollowed: '',
  });

  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: profileData?.userDetails?.username,
      isActive: true,
    },
  ];

  const handleInitiateChat = async () => {
    setInitiatingChat(true);

    const chatId = await initiateChat(Number(currentSelectedUser));

    if (chatId) {
      toggleMessageDialogVisibility(true, <MessagesPage />, dialogClassName);
    }

    setInitiatingChat(false);
  };

  const getProfileDetails = async (load = true) => {
    load && setFetchingProfile(true);

    try {
      const { data } = await request.post(`/profile/${currentSelectedUser}`, {
        user_id: userId,
      });
      setProfileData(data?.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setFetchingProfile(false);
    }
  };

  const getUsersProps = async (filter?: string, isFetchMore = false) => {
    isFetchMore ? setLoadingMoreProps(true) : setLoadingUserDetails(true);

    try {
      const { data } = await request.post(`/props`, {
        user_id: currentSelectedUser,
        list: filter || selectedPropFilter,
        limit: 20,
        page: isFetchMore ? nextPageData.page + 1 : 1,
      });
      setUserDetailsProps((prevProps) =>
        isFetchMore
          ? [...prevProps, ...data?.data?.products]
          : data?.data?.products
      );
      setNextPageData(data?.pager);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingUserDetails(false);
      setLoadingMoreProps(false);
    }
  };

  const getFilteredUserDetails = async (filter: string) => {
    getUsersProps(filter);
    setSelectedPropFilter(filter);
  };

  const fetchMoreProps = async () => {
    getUsersProps(selectedPropFilter, true);
  };

  const updateFollowers = (followed: boolean) => {
    setProfileData((prevData) => ({
      ...prevData,
      totalFollowers: String(
        parseInt(prevData.totalFollowers, 10) + (followed ? 1 : -1)
      ),
    }));
  };

  const { toggleDialogVisibility } = useAuthDialogStore();

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      {fetchingProfile ? (
        <ProfileSkeleton />
      ) : (
        <section className="tf-section featured-props-section pb-0 pt-[20px] lg:pt-[30px]">
          <div className="themesflat-container">
            <div className=" rounded-3xl px-[15px] py-[20px] sm:p-[30px] profile-detail-section">
              <div className="flex column gap-16">
                <div className="rounded-[10px] profile-img bg-[#303030]">
                  <img
                    alt="User"
                    className="rounded-3xl profile-img object-cover"
                    src={profileData?.userDetails?.avatar || profileImage}
                  />
                </div>

                <div className="flex responsive items-start flex-grow gap-5">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-end gap-2">
                      <h2 className="leading-[44px] capitalize">
                        {profileData?.userDetails?.username}
                      </h2>
                      <div className="flex items-center gap-2">
                        <p className="text-[16px] text-[#C5B6B3] leading-[30px] capitalize ml-3">
                          {profileData?.userDetails?.averageRating}
                        </p>
                        <SvgStarIconSm />
                        <p className="text-[16px] text-[#C5B6B3] leading-[30px] capitalize">
                          {`(${profileData?.userDetails?.totalSold} Sold)`}
                        </p>
                      </div>
                    </div>

                    <p className="sm:text-[14px] md:text-[16px] lg:text-[18px] leading-[22px] max-h-[160px] whitespace-break-spaces truncate break-all">
                      {profileData?.userDetails?.aboutMe}
                    </p>

                    <div className="flex items-center gap-8">
                      <h5>{profileData?.totalFollowers} Followers</h5>
                      <div className="border-l-[1px] border-solid border-white h-[13px]"></div>
                      <h5>{profileData?.totalFollowing} Following</h5>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:!flex-nowrap gap-[10px] mt">
                    {currentSelectedUser === userId && (
                      <div className="flex ">
                        <button
                          onClick={() => navigate(`/user/${userId}/edit`)}
                          className="flex items-center px-[18px] sm:px-[22px] py-[12px] rounded-[10px] bg-[#676767] border-[#676767] focus:text-white hover:text-white hover:opacity-90 whitespace-nowrap"
                        >
                          Edit Profile
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        toggleDialogVisibility(
                          true,
                          <UserRatings reviewsData={profileData} />,
                          dialogClassName
                        )
                      }
                      className="reviews items-center bg-transparent rounded-[10px] px-[18px] sm:px-[22px] py-[12px] border-white text-white border-[1px] hover:border-[#EF6A3B] hover:text-[#EF6A3B] focus:bg-transparent focus:text-[#EF6A3B] focus:border-white"
                    >
                      <span>Reviews</span>
                    </button>

                    {currentSelectedUser !== userId && (
                      <>
                        <UserFollow
                          isFollowed={profileData?.isFollowed}
                          onComplete={(followed) => updateFollowers(followed)}
                        />

                        <button
                          className="flex items-center px-[15px] sm:px-[22px] py-[12px] rounded-[10px] bg-[#676767] border-[#676767] focus:text-white hover:text-white hover:opacity-90"
                          disabled={initiatingChat}
                          onClick={
                            !isLoggedIn
                              ? () => toggleDialogVisibility(true, <SignIn />)
                              : handleInitiateChat
                          }
                        >
                          <SvgFollow />
                          <span

                            className="hidden sm:block ml-[10px] cursor-pointer"
                          >
                            Message
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-auto flex-tabs flex gap-[3.5rem] px-[30px] mt-[-9px] sm:mt-[-15px] lg:mt-[-65px] rounded-b-3xl profile-detail-tabs">
              <div className="profile-img h-0 min-h-0" />
              <div className="flex justify-between flex-1">
                <div className="flex flex-row">
                  <div className="py-[16px] pr-[16px] text-[16px] leading-[24px] font-[700] ">
                    <div
                      onClick={() => getFilteredUserDetails('all')}
                      className={`${
                        selectedPropFilter === 'all' ? 'bg-[#EF6A3B]' : ''
                      } whitespace-nowrap px-[14px] py-[8px] rounded-2xl text-[18px] font-bold hover:cursor-pointer hover:text-white hover:bg-[#EF6A3B] active:bg-[#EF6A3B]`}
                    >
                      All Props
                    </div>
                  </div>

                  <div className="p-[16px] text-[16px] leading-[24px] font-[700] ">
                    <div
                      onClick={() => getFilteredUserDetails('selling')}
                      className={`${
                        selectedPropFilter === 'selling' ? 'bg-[#EF6A3B]' : ''
                      } whitespace-nowrap px-[14px] py-[8px] rounded-2xl text-[18px] font-bold hover:cursor-pointer hover:text-white hover:bg-[#EF6A3B] active:bg-[#EF6A3B]`}
                    >
                      For Sale
                    </div>
                  </div>

                  <div className="p-[16px] text-[16px] leading-[24px] font-[700]">
                    <div
                      onClick={() => getFilteredUserDetails('showcase')}
                      className={`${
                        selectedPropFilter === 'showcase' ? 'bg-[#EF6A3B]' : ''
                      } whitespace-nowrap px-[14px] py-[8px] rounded-2xl text-[18px] font-bold hover:cursor-pointer hover:text-white hover:bg-[#EF6A3B] active:bg-[#EF6A3B]`}
                    >
                      Showcase Only
                    </div>
                  </div>

                  <div className="p-[16px] text-[16px] leading-[24px] font-[700] ">
                    <div
                      onClick={() => getFilteredUserDetails('sold')}
                      className={`${
                        selectedPropFilter === 'sold' ? 'bg-[#EF6A3B]' : ''
                      } whitespace-nowrap px-[14px] py-[8px] rounded-2xl text-[18px] font-bold hover:cursor-pointer hover:text-white hover:bg-[#EF6A3B] active:bg-[#EF6A3B]`}
                    >
                      Sold
                    </div>
                  </div>
                </div>

                {
                  <div className="items-center reviews-lg">
                    <button
                      onClick={() =>
                        toggleDialogVisibility(
                          true,
                          <UserRatings reviewsData={profileData} />,
                          dialogClassName
                        )
                      }
                      className="px bg-transparent rounded-[10px] h-[40px] leading-[10px] border-white text-white border-[1px] hover:border-[#EF6A3B] hover:text-[#EF6A3B] focus:bg-transparent focus:text-[#EF6A3B] focus:border-white"
                    >
                      <span>Reviews</span>
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>
      )}

      {loadingUserDetails ? (
        <section className="tf-section today-pick featured-props-section">
          <div className="themesflat-container px-0">
            <CardsSkeleton count={4} />
          </div>
        </section>
      ) : (
        <section className="tf-section today-pick featured-props-section">
          <div className="themesflat-container">
            {userDetailProps?.length > 0 ? (
              <div className="row">
                <InfiniteScroll
                  hasNextPage={nextPageData?.page !== nextPageData?.totalPages}
                  isFetchingNextPage={loadingMoreProps}
                  isLoading={loadingUserDetails}
                  fetchNextPage={fetchMoreProps}
                  data={userDetailProps}
                  itemRenderer={(item: any, index) => (
                    <div
                      key={index}
                      className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
                      <PropCard
                        featureTag={{
                          text: 'screen-matched',
                          show: item?.isOriginal === '1',
                        }}
                        item={{
                          ...item,
                          image: item.imagePath || img1,
                          subTitle: item?.movieName,
                        }}
                        wishlist={{ show: true, count: item?.productLikes }}
                      />
                    </div>
                  )}
                />
              </div>
            ) : (
              <NoContentPage subText="No props found" />
            )}
          </div>
        </section>
      )}
    </>
  );
};
