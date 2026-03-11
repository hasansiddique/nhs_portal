import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { request } from '@your-props/client/utils';
import { Spinner } from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';

export const VerifyPayPal = () => {
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
      label: 'Reviews',
      isActive: true,
    },
  ];

  useEffect(() => {
    setPaypalMerchantId();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const [isErrorValidating, setIsErrorValidating] = useState(false);
  const [validatingUser, setValidatingUser] = useState(false);

  const setPaypalMerchantId = async () => {
    setValidatingUser(true);
    setIsErrorValidating(false);

    const urlSearch = location.search;
    const params = new URLSearchParams(urlSearch);
    const paypalMerchantId = params.get('merchantIdInPayPal');
    const currentUser = JSON.parse(localStorage.getItem('user') as string);

    try {
      const { data } = await request.post(`/set-merchant-id`, {
        merchant_id: paypalMerchantId,
      });
      const updatedUser = {
        ...currentUser,
        paypalMerchantAccount: data?.paypalMerchantAccount || '',
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate('/dashboard/payment');
      toast.success('Your Paypal Account is Connected');
    } catch (err: any) {
      setIsErrorValidating(true);
      toast.error(err.response.data.message);
    } finally {
      setValidatingUser(false);
    }
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
          {validatingUser ? (
            <div className="flex justify-center items-center my-10 w-full">
              <Spinner />
            </div>
          ) : isErrorValidating ? (
            <button onClick={setPaypalMerchantId} disabled={validatingUser}>
              {validatingUser ? 'Validating...' : 'Retry Verification'}
            </button>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
};
