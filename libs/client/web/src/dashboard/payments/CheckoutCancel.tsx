import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { request } from '@your-props/client/utils';
import { Spinner } from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';

export const CheckoutCancel = () => {
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
    setOrderPaymentCancel();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const [isErrorValidating, setIsErrorValidating] = useState(false);
  const [validatingUser, setValidatingUser] = useState(false);

  const setOrderPaymentCancel = async () => {
    setValidatingUser(true);
    setIsErrorValidating(false);

    const urlSearch = location.search;
    const params = new URLSearchParams(urlSearch);
    const paymentToken = params.get('token');

    try {
      const { data } = await request.post(`/payment-cancel`, {
        paymentToken: paymentToken,
      });
      console.log('Response from payment-success', data)
      console.log('Response Token', paymentToken);
      toast.warning('Payment Cancelled or Denied, Please try again to complete your purchase');
      navigate('/dashboard/checkout');
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
            <button onClick={setOrderPaymentCancel} disabled={validatingUser}>
              {validatingUser ? 'Validating...' : 'Retry Verification'}
            </button>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
};
