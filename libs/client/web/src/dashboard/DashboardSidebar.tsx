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

const widgetSidebarData = [
  {
    id: 0,
    title: 'YourProps',
    content: [
      {
        icon: DashboardIcon,
        field: 'Dashboard',
        key: 'props',
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
    title: 'Props',
    content: [
      // {
      //   icon: YourPropsIcon,
      //   field: 'Dashboard',
      //   key: 'stats',
      // },
      {
        icon: BulkUploadIcon,
        field: 'Bulk Upload',
        key: 'bulk-upload',
      },
      {
        icon: AddNewPropIcon,
        field: 'Add Item',
        key: 'add-item',
      },
      {
        icon: SavedSearchesIcon,
        field: 'Saved Searches',
        key: 'saved-searches',
      },
    ],
  },
  {
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
  },
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
        icon: ShippingIcon,
        field: 'Shipping',
        key: 'shipping',
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

export const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = location.pathname.split('/').pop();
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
              {item.content.map((itemm, index) =>
                itemm.key === 'add-item' ? (
                  <PaymentCheck addShowcaseAllowed>
                    <div
                      key={index}
                      onClick={() => navigate(`/dashboard/${itemm.key}`)}
                      className={`flex items-center cursor-pointer hover:text-[#EF6A3B] bg-[${
                        currentRoute === itemm.key ? '#222222' : ''
                      }] ${
                        currentRoute === itemm.key
                          ? 'py-[10px] px-[20px] rounded-[10px]'
                          : 'my-[10px]'
                      }`}
                    >
                      <itemm.icon
                        fill={
                          currentRoute === itemm.key ? '#EF6A3B' : '#C5B6B3'
                        }
                      />
                      <p
                        className={`ml-[12px] text-[18px]  ${
                          currentRoute === itemm.key
                            ? 'font-semibold'
                            : 'font-medium'
                        } text-[${
                          currentRoute === itemm.key ? '#ffffff' : '#C5B6B3'
                        }]`}
                      >
                        {itemm.field}
                      </p>
                    </div>
                  </PaymentCheck>
                ) : (
                  <div
                    key={index}
                    onClick={() =>
                      itemm.key === 'logout'
                        ? logoutUser()
                        : itemm.key === 'profile'
                        ? navigate(`/user/${userId}/edit`)
                        : navigate(`/dashboard/${itemm.key}`)
                    }
                    className={`flex items-center cursor-pointer hover:text-[#EF6A3B] bg-[${
                      currentRoute === itemm.key ? '#222222' : ''
                    }] ${
                      currentRoute === itemm.key
                        ? 'py-[10px] px-[20px] rounded-[10px]'
                        : 'my-[10px]'
                    }`}
                  >
                    <itemm.icon
                      fill={currentRoute === itemm.key ? '#EF6A3B' : '#C5B6B3'}
                    />
                    <p
                      className={`ml-[12px] text-[18px]  ${
                        currentRoute === itemm.key
                          ? 'font-semibold'
                          : 'font-medium'
                      } text-[${
                        currentRoute === itemm.key ? '#ffffff' : '#C5B6B3'
                      }]`}
                    >
                      {itemm.field}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
