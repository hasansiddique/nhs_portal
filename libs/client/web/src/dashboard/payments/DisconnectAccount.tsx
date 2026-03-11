import React, { useState } from 'react';

import { SvgInfoIcon } from '@your-props/client/icons';
import { request, useAuthDialogStore } from '@your-props/client/utils';
import { toast } from 'sonner';

export const DisconnectAccount = () => {
  const { toggleDialogVisibility } = useAuthDialogStore();

  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  const [validatingUser, setValidatingUser] = useState(false);

  const disconnectPaypalAccount = async () => {
    setValidatingUser(true);
    try {
      const { data } = await request.put(`/vendor-disconnect`, {});

      const updatedUser = {
        ...currentUser,
        paypalMerchantAccount: null,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Your PayPal account was unlinked successfully!');
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response.data.message);
      toggleDialogVisibility(false, null);
      window.location.reload();
    } finally {
      setValidatingUser(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center w-full">
        <div className="w-[68px] h-[68px] rounded-[80px] flex items-center justify-center bg-[red]/20">
          <div className="w-[50px] h-[50px] rounded-[80px] flex items-center justify-center bg-red-700">
            <SvgInfoIcon fill="white" />
          </div>
        </div>
      </div>

      <div className="flex flex-col pt-4 pb-[26px]">
        <h2 className="text-[28px] leading-[44px] font-bold justify-center flex pb-10">
          Warning!
        </h2>
        <p className="text-[#C5B6B3] text-[20px] leading-[28px] text-center">
          Disconnecting your PayPal account will prevent you from offering
          PayPal services and products on your website. Do you wish to continue?
        </p>
      </div>

      <button
        disabled={validatingUser}
        onClick={disconnectPaypalAccount}
        className="p-0 submit rounded-[10px] h-[48px] w-full focus:text-white hover:text-white hover:opacity-90"
      >
        {validatingUser ? 'Validating...' : 'Confirm'}
      </button>
    </div>
  );
};
