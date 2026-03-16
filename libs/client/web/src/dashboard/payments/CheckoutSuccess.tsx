import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { request } from '@your-props/client/utils';
import { Spinner } from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';

export const CheckoutSuccess = () => {
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
    setOrderPaymentSuccess();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const [isErrorValidating, setIsErrorValidating] = useState(false);
  const [validatingUser, setValidatingUser] = useState(false);

  const setOrderPaymentSuccess = async () => {
    setValidatingUser(true);
    setIsErrorValidating(false);

    const urlSearch = location.search;
    const params = new URLSearchParams(urlSearch);
    const paymentToken = params.get('token');

    try {
      const { data } = await request.post(`/payment-success`, {
        paymentToken: paymentToken,
      });
      console.log('Response from payment-success', data);
      console.log('Response Token', paymentToken);
      toast.success('Payment Successful, Thank you for your purchase');
      navigate(
        data.orderId
          ? `/dashboard/orders/${data.orderId}/details?type=buyer`
          : '/dashboard/orders'
      );
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
            <button onClick={setOrderPaymentSuccess} disabled={validatingUser}>
              {validatingUser ? 'Validating...' : 'Retry Verification'}
            </button>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
};
