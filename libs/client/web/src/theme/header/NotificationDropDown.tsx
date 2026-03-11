import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import { timeAgo, useNotificationActions } from '@your-props/client/utils';
import defaultProfileImage from '../../theme/assets/images/avatar/user-img.png';
import {BellIcon} from "@your-props/client/icons";

interface Notification {
  id: number;
  categoryId: number;
  message: string;
  isRead: string;
  url: string;
  image: string;
  createdAt: string;
}

interface NotificationDropDownProps {
  isLoggedIn: boolean,
  animateIcon: boolean,
  unreadNotificationsCount: number,
  notifications: Notification[];
}

export const NotificationDropDown: React.FC<NotificationDropDownProps> = ({
  isLoggedIn,
  animateIcon,
  unreadNotificationsCount,
  notifications,
}) => {
  const navigate = useNavigate();

  const { markAsRead, markAllAsRead } = useNotificationActions();

  const [showDropdown, setShowDropdown] = useState(false);

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

    setShowDropdown(false);
  }

  return (
    <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
      <Dropdown.Toggle
        id="dropdown-autoclose-inside"
        className="dropdown notify p-0 ml-[12px]"
      >
        {isLoggedIn && unreadNotificationsCount > 0 && (
          <div
            className={`w-8 h-8 bg-[#ef6a3b] text-white absolute top-[-8px] right-[-8px] rounded-[100px] flex justify-center items-center text-[12px] font-bold z-50 ${
              animateIcon ? 'animate-count' : ''
            }`}
          >
            <div>{unreadNotificationsCount}</div>
          </div>
        )}
        <div>
          <BellIcon />
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="w-[311px] px-0 pt-4 pb-3 bg-[#393939] rounded-[10px]"
        style={{ margin: 0 }}
      >
        <Dropdown.Item className="p-0 hover:bg-transparent focus:bg-transparent px-4">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-[#C5B6B3] text-[20px]">Notifications</h5>
            <Link to={`/dashboard/notification`}>
              <p className="text-[14px] hover:!text-[#ef6a3b] transition">View All</p>
            </Link>
          </div>
        </Dropdown.Item>

        {notifications?.length ? (
          <>
            {notifications.map((notification, index) => {
              if (index > 4) return null;

              return (
                <Dropdown.Item
                  className="py-4 px-4 hover:bg-[#2a2a2a] whitespace-normal focus:bg-transparent"
                  key={notification.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(notification)
                  }}
                >
                  <div className="flex items-start gap-3 w-full">
                    <img
                      alt="user"
                      width={32}
                      height={32}
                      src={notification?.image || defaultProfileImage}
                      className="w-[32px] h-[32px] rounded-[10px] object-cover deafult_image"
                    />

                    <div className="flex flex-col w-full overflow-hidden">
                      <p className="text-[14px] leading-[18px] break-words">
                        {notification.message}
                      </p>
                      <p className="text-[#C5B6B3] text-[12px] break-words">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>

                    {notification.isRead === "0" && (
                      <div className="bg-[#ef6a3b] rounded-full w-3 h-3 mt-4 animate-pulse"></div>
                    )}
                  </div>
                </Dropdown.Item>
              );
            })}

            <div
              className="text-center cursor-pointer"
              onClick={() => {
                markAllAsRead();
                setShowDropdown(false);
              }}
            >
              <p className="text-[14px] hover:!text-[#ef6a3b] transition pt-2">Mark All As Read</p>
            </div>
          </>
        ) : (
          <div className="py-4 text-center text-[#C5B6B3] text-[16px]">
            No new notifications found.
          </div>
        )}

      </Dropdown.Menu>
    </Dropdown>
  );
};
