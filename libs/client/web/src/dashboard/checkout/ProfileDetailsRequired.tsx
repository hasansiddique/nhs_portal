import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SvgExclamationIcon } from '@your-props/client/icons';
import {
  useAuthDialogStore,
  useSidebarActions,
} from '@your-props/client/utils';

export const ProfileDetailsRequired = () => {
  const { closeSidebar } = useSidebarActions();
  const navigate = useNavigate();
  const { toggleDialogVisibility } = useAuthDialogStore();

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id;

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center w-full">
        <div className="w-[55px] h-[55px] rounded-[80px] flex items-center justify-center bg-[red]/20">
          <div className="w-[40px] h-[40px] rounded-[80px] flex items-center justify-center bg-red-700">
            <SvgExclamationIcon />
          </div>
        </div>
      </div>

      <div className="flex flex-col py-[26px]">
        <h2 className="text-[28px] leading-[44px] font-bold justify-center flex">
          Required!
        </h2>
        <p className="text-[#C5B6B3] text-[20px] leading-[28px] text-center">
          Please update your profile and add your address details to proceed to
          checkout page.
        </p>
      </div>

      <div className="flex flex-row">
        <button
          onClick={() => {
            closeSidebar();
            toggleDialogVisibility(false, null);
            navigate(`/user/${userId}/edit`);
          }}
          className="w-full submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};
