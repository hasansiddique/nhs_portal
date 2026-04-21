import Cookies from 'js-cookie';
import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  ProfileFilledIcon,
  MySalesIcon,
  PaymentIcon,
  FollowersIcon,
  BulkUploadIcon,
  AddNewPropIcon,
  LogoutIcon,
  DashboardIcon,
  GridIcon,
} from '@your-props/client/icons';
import { PaymentCheck } from '@your-props/client/utils';

import defaultProfileImage from '../theme/assets/images/avatar/user-img.png';
import { LocationSelector } from './LocationSelector';

type SidebarNavItem = {
  icon: React.ComponentType<{ fill?: string }>;
  field: string;
  key: string;
  href?: string;
};

type SidebarSection = { id: number; title: string; content: SidebarNavItem[] };

function readSessionUser(): {
  role?: string;
  username?: string;
  displayName?: string;
  name?: string;
  email?: string;
  avatar?: string;
  id?: string;
} {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

function sidebarForRole(role: string | undefined): SidebarSection[] {
  const baseSettings: SidebarNavItem[] = [
    { icon: ProfileFilledIcon, field: 'Edit Profile', key: 'profile' },
    { icon: PaymentIcon, field: 'Payment', key: 'payment' },
    { icon: LogoutIcon, field: 'Logout', key: 'logout' },
  ];

  if (role === 'PATIENT') {
    return [
      {
        id: 0,
        title: 'YourNHS',
        content: [
          { icon: DashboardIcon, field: 'My appointments', key: 'dashboard', href: '/dashboard' },
          { icon: GridIcon, field: 'Analytics', key: 'data-insights', href: '/dashboard/data-insights' },
          { icon: BulkUploadIcon, field: 'Book appointment', key: 'book', href: '/appointments/book' },
        ],
      },
      { id: 4, title: 'Settings', content: baseSettings },
    ];
  }

  if (role === 'PRACTITIONER') {
    return [
      {
        id: 0,
        title: 'YourNHS',
        content: [
          { icon: DashboardIcon, field: 'Dashboard', key: 'dashboard', href: '/dashboard' },
          { icon: BulkUploadIcon, field: 'Booked', key: 'appointments' },
          { icon: FollowersIcon, field: 'Patients', key: 'patients' },
          { icon: AddNewPropIcon, field: 'Availability', key: 'availability', href: '/dashboard/availability' },
        ],
      },
      { id: 4, title: 'Settings', content: baseSettings },
    ];
  }

  if (role === 'ADMIN') {
    return [
      {
        id: 0,
        title: 'YourNHS',
        content: [
          { icon: DashboardIcon, field: 'Dashboard', key: 'dashboard', href: '/dashboard' },
          { icon: BulkUploadIcon, field: 'Booked', key: 'appointments' },
          { icon: FollowersIcon, field: 'Patients', key: 'patients' },
          { icon: MySalesIcon, field: 'Doctors', key: 'doctors' },
          { icon: AddNewPropIcon, field: 'Availability', key: 'availability', href: '/dashboard/availability' },
          { icon: AddNewPropIcon, field: 'Add patient', key: 'admin-patient', href: '/dashboard/admin/patients/new' },
          { icon: AddNewPropIcon, field: 'Add doctor', key: 'admin-doctor', href: '/dashboard/admin/doctors/new' },
        ],
      },
      { id: 4, title: 'Settings', content: baseSettings },
    ];
  }

  return [
    {
      id: 0,
      title: 'YourNHS',
      content: [
        { icon: DashboardIcon, field: 'Dashboard', key: 'dashboard', href: '/dashboard' },
        { icon: GridIcon, field: 'Analytics', key: 'data-insights', href: '/dashboard/data-insights' },
      ],
    },
    { id: 4, title: 'Settings', content: baseSettings },
  ];
}

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
  const currentUser = readSessionUser();
  const userId = currentUser?.id;
  const role = currentUser?.role;
  const displayLabel =
    currentUser?.username || currentUser?.displayName || currentUser?.name || currentUser?.email || 'User';

  const widgetSidebarData = useMemo(() => sidebarForRole(role), [role]);

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

        <div className="ml-4 min-w-0">
          <p className="font-bold leading-[22px] mb-[5px] text-[18px] text-[#EBEBEB] truncate">{displayLabel}</p>
          <p className="font-normal text-[13px] leading-[18px] text-[#C5B6B3] truncate">
            {role ? role.charAt(0) + role.slice(1).toLowerCase() : 'Guest'}
          </p>
        </div>
      </div>

      <div className="border-[1px] mt-[40px] mb-[10px] border-[#393939] bg-[#393939] h-1" />

      <LocationSelector />

      <div id="side-bar" className="side-bar">
        {widgetSidebarData.map((item, index) => (
          <div
            className={`${index === widgetSidebarData.length - 1 ? 'mt-[30px]' : 'my-[30px] '}`}
            key={item.id}
          >
            <div className="content-wg-category">
              <p
                className={`text-[15px] ${
                  item.id === 0 ? 'font-normal text-[#C5B6B3]' : 'font-semibold'
                } leading-[26px] uppercase mb-[12px]`}
              >
                {item.title}
              </p>
              {item.content.map((itemm, idx) => {
                const active = isNavItemActive(itemm, location.pathname);
                return itemm.key === 'add-item' ? (
                  <PaymentCheck addShowcaseAllowed key={idx}>
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
                    key={`${itemm.key}-${idx}`}
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
