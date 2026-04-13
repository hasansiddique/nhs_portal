import Cookies from 'js-cookie';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  LikesIcon,
  OffersIcon,
  ProfileFilledIcon,
  MySalesIcon,
  PaymentIcon,
  ShippingIcon,
  CommentsIcon,
  FeedbackIcon,
  FollowersIcon,
  BulkUploadIcon,
  AddNewPropIcon,
  SavedSearchesIcon,
  LogoutIcon,
  MyOrdersIcon,
  DashboardIcon,
  DisputesIcon,
  DashboardBellIcon,
  SvgAuctionIcon,
} from '@your-props/client/icons';
import { PaymentCheck } from '@your-props/client/utils';

import defaultProfileImage from '../theme/assets/images/avatar/user-img.png';
import { LocationSelector } from './LocationSelector';

type SidebarNavItem = {
  icon: React.ComponentType<{ fill?: string }>;
  field: string;
  key: string;
  /** Absolute app path (e.g. `/dashboard`, `/appointments/book`) */
  href?: string;
};

const widgetSidebarData: { id: number; title: string; content: SidebarNavItem[] }[] = [
  {
    id: 0,
    title: 'YourProps',
    content: [
      {
        icon: DashboardIcon,
        field: 'Dashboard',
        key: 'dashboard',
        href: '/dashboard',
      },
      {
        icon: DashboardBellIcon,
        field: 'Notifications',
        key: 'notification',
      },
    ],
  },
  {
    id: 1,
    title: 'Appointments',
    content: [
      {
        icon: BulkUploadIcon,
        field: 'Booked',
        key: 'appointments',
      },
      {
        icon: FollowersIcon,
        field: 'Patients',
        key: 'patients',
      },
      {
        icon: MySalesIcon,
        field: 'Doctors',
        key: 'doctors',
      },
      /*{
        icon: SavedSearchesIcon,
        field: 'Saved Searches',
        key: 'saved-searches',
      },*/
    ],
  },
 /* {
    id: 2,
    title: 'Trading',
    content: [
      {
        icon: SvgAuctionIcon,
        field: 'Auctions',
        key: 'auctions',
      },
      {
        icon: MySalesIcon,
        field: 'My Sales',
        key: 'sales',
      },
      {
        icon: MyOrdersIcon,
        field: 'My Orders',
        key: 'orders',
      },
      {
        icon: OffersIcon,
        field: 'Offers',
        key: 'offers',
      },
      {
        icon: DisputesIcon,
        field: 'Disputes',
        key: 'disputes',
      },
    ],
  },
  {
    id: 3,
    title: 'Engagement',
    content: [
      {
        icon: CommentsIcon,
        field: 'Comments',
        key: 'comments',
      },
      {
        icon: FeedbackIcon,
        field: 'Feedback',
        key: 'feedback',
      },
      {
        icon: LikesIcon,
        field: 'Likes',
        key: 'likes',
      },
      {
        icon: FollowersIcon,
        field: 'Followers',
        key: 'follows',
      },
      // {
      //   icon: MessagesIcon,
      //   field: 'Messages',
      //   key: 'messages',
      // },
    ],
  },*/
  {
    id: 4,
    title: 'Settings',
    content: [
      {
        icon: ProfileFilledIcon,
        field: 'Edit Profile',
        key: 'profile',
      },
      {
        icon: PaymentIcon,
        field: 'Payment',
        key: 'payment',
      },
      {
        icon: LogoutIcon,
        field: 'Logout',
        key: 'logout',
      },
    ],
  },
];

function isNavItemActive(item: SidebarNavItem, pathname: string) {
  if (item.href) {
    const base = item.href.replace(/\/$/, '');
    const p = pathname.replace(/\/$/, '');
    return p === base;
  }
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  return last === item.key;
}

function goToNavItem(
  item: SidebarNavItem,
  navigate: ReturnType<typeof useNavigate>,
  userId: string | undefined,
  logoutUser: () => void
) {
  if (item.key === 'logout') {
    logoutUser();
    return;
  }
  if (item.key === 'profile') {
    if (userId) navigate(`/user/${userId}/edit`);
    return;
  }
  if (item.href) {
    navigate(item.href);
    return;
  }
  navigate(`/dashboard/${item.key}`);
}

export const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id;

  const logoutUser = () => {
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <>
      <div className="flex items-center">
        <div className="rounded-[10px] w-[69px] h-[69px] border-[1px] bg-[#303030] overflow-hidden">
          <img
            src={currentUser?.avatar || defaultProfileImage}
            className="avatar w-full h-full object-cover"
            alt="user"
          />
        </div>

        <div className="ml-4">
          <p className="font-bold leading-[22px] mb-[5px] text-[18px] text-[#EBEBEB]">
            {currentUser?.username}
          </p>
          <p className="font-normal text-[15px] leading-[20px] text-[#C5B6B3]">{`Joined: Jan 2025`}</p>
        </div>
      </div>

      <div className="border-[1px] mt-[40px] mb-[10px] border-[#393939] bg-[#393939] h-1" />

      <LocationSelector />

      <div id="side-bar" className="side-bar">
        {widgetSidebarData.map((item, index) => (
          <div
            className={`${
              index === widgetSidebarData.length - 1
                ? 'mt-[30px]'
                : 'my-[30px] '
            }`}
            key={index}
          >
            <div className="content-wg-category">
              <p
                className={`text-[15px] ${
                  item.id === 0 ? 'font-normal text-[#C5B6B3]' : 'font-semibold'
                } leading-[26px] uppercase mb-[12px]`}
              >
                {item.title}
              </p>
              {item.content.map((itemm, index) => {
                const active = isNavItemActive(itemm, location.pathname);
                return itemm.key === 'add-item' ? (
                  <PaymentCheck addShowcaseAllowed key={index}>
                    <div
                      onClick={() => goToNavItem(itemm, navigate, userId, logoutUser)}
                      className={`flex cursor-pointer items-center hover:text-[#EF6A3B] ${
                        active ? 'bg-[#222222] py-[10px] px-[20px] rounded-[10px]' : 'my-[10px]'
                      }`}
                    >
                      <itemm.icon fill={active ? '#EF6A3B' : '#C5B6B3'} />
                      <p
                        className={`ml-[12px] text-[18px] ${
                          active ? 'font-semibold text-[#ffffff]' : 'font-medium text-[#C5B6B3]'
                        }`}
                      >
                        {itemm.field}
                      </p>
                    </div>
                  </PaymentCheck>
                ) : (
                  <div
                    key={index}
                    onClick={() => goToNavItem(itemm, navigate, userId, logoutUser)}
                    className={`flex cursor-pointer items-center hover:text-[#EF6A3B] ${
                      active ? 'bg-[#222222] py-[10px] px-[20px] rounded-[10px]' : 'my-[10px]'
                    }`}
                  >
                    <itemm.icon fill={active ? '#EF6A3B' : '#C5B6B3'} />
                    <p
                      className={`ml-[12px] text-[18px] ${
                        active ? 'font-semibold text-[#ffffff]' : 'font-medium text-[#C5B6B3]'
                      }`}
                    >
                      {itemm.field}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
