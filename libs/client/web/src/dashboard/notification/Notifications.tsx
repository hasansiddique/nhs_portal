import React, { useEffect } from 'react';
import {getUserId, timeAgo, useNotificationActions, useNotificationState} from '@your-props/client/utils';
import {
  NoContentPage,
  InfiniteScroll, Spinner,
} from '@your-props/client/ui';

import {DashboardLayout} from "../Dashboard";
import {useNavigate} from "react-router-dom";

export const Notifications = () => {
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
      label: 'Notifications',
      isActive: true,
    },
  ];

  const userId = getUserId();
  const navigate = useNavigate();

  const { isInitialized, notifications, unreadNotificationsCount, nextPageData, isFetchingNotifications } = useNotificationState();
  const { fetchNotifications, markAsRead, markAllAsRead } = useNotificationActions();

  const fetchMore = async () => {
    await fetchNotifications(true);
  };

  const handleClick = (notification: any ) => {
    if(notification.isRead == '0') {
      markAsRead(notification.id);
    }

    if (notification.url) {
      const baseUrl = window.location.origin;
      const cleanedUrl = notification.url.startsWith(baseUrl)
        ? notification.url.replace(baseUrl, '')
        : notification.url;

      navigate(cleanedUrl);
    }
  }

  useEffect(() => {
    if (userId && !isInitialized) {
      (async () => {
        await fetchNotifications();
      })();
    }
  }, []);

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {isFetchingNotifications ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : (
          notifications.length === 0 ? (
            <NoContentPage
              subText="No notifications found."
              showButton={false}
              isHeight={true}
              isSpacing={false}
            />
          ) : (
            <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
              <div className="flex justify-between mb-5 items-center">
                <h5>{unreadNotificationsCount} Unread</h5>
                <button
                  className="flex flex-row items-center h-[38px] px-[15px] py-[12px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none"
                  onClick={markAllAsRead}
                  disabled={unreadNotificationsCount === 0}
                >
                  <span className="ml-[5px] font-medium">Mark All As Read</span>
                </button>
              </div>
              <InfiniteScroll
                isTable={false}
                hasNextPage={
                  nextPageData?.page !== nextPageData?.totalPages
                }
                isFetchingNextPage={isFetchingNotifications}
                isLoading={false}
                fetchNextPage={fetchMore}
                data={notifications}
                itemRenderer={(notification, index) => (
                  <div
                    key={index}
                    className="flex gap-5 p-4 rounded-[8px] bg-[#39393966] mb-3 cursor-pointer w-full"
                    onClick={() => handleClick(notification)}
                  >
                    <img
                      alt="user"
                      src={notification.image}
                      className="w-[38px] h-[38px] sm:w-[58px] sm:h-[58px] rounded-[10px]"
                    />
                    <div className="flex-grow">
                      <p className='text-[14px] sm:text-[18px]'>{notification.message}</p>
                      <p className="text-[14px] text-[#C5B6B3]">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>

                    {notification.isRead === "0" && (
                      <div className="bg-[#ef6a3b] rounded-full w-4 h-4 self-center animate-pulse"></div>
                    )}
                  </div>
                )}
              />
            </div>
          )
      )}
      </div>
    </DashboardLayout>
  );
};
