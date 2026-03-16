import React, { useEffect, useState } from 'react';

import { DashboardLayout } from '../Dashboard';
import { request, useAuthDialogStore } from '@your-props/client/utils';
import { toast } from 'sonner';
import { Spinner } from '@your-props/client/ui';
import { DisconnectAccount } from './DisconnectAccount';

export const PaymentsPage = () => {
  useEffect(() => {
    getProfileDetails();
  }, []);

  const { toggleDialogVisibility } = useAuthDialogStore();

  const [validatingUser, setValidatingUser] = useState(false);

  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    userDetails: {
      merchantId: '',
      paypalMerchantAccount: '',
    },
  });

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id as string;

  const getProfileDetails = async () => {
    setFetchingProfile(true);

    try {
      const { data } = await request.post(`/profile/${userId}`, {
        listing_type: 'all',
      });
      setProfileData(data?.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleOnboardVendor = async () => {
    setValidatingUser(true);
    try {
      const { data } = await request.post(`/vendor-onboard`, {
        user_id: currentUser?.id,
        returnUrl: 'https://yourprops.devletes.com/verify-paypal',
        cancelUrl: 'https://yourprops.devletes.com/verify-paypal',
      });
      if (data?.referralUrl) {
        window.location.href = data?.referralUrl;
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setValidatingUser(false);
    }
  };

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
      label: 'Payment',
      isActive: true,
    },
  ];

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        <div className="bg-[#3939394D] p-[60px] rounded-[8px] text-center">
          <div className="mb-5">
            {!profileData?.userDetails?.merchantId ? (
              <>
                <i className="text-[60px] mb-4 fal fa-exclamation-circle text-warning"></i>
                <h3 className="mg-bt-10">PayPal is not connected</h3>
              </>
            ) : (
              <>
                <i className="text-[60px] mb-4 fal fa-check-circle text-success"></i>
                <h3 className="mg-bt-10">PayPal is Connected</h3>
                <p className="mg-bt-10">
                  Email connected:{' '}
                  <span className="text-orange-400">
                    {' '}
                    {profileData?.userDetails?.paypalMerchantAccount}{' '}
                  </span>
                </p>
              </>
            )}
          </div>

          {validatingUser || fetchingProfile ? (
            <div className="flex justify-center items-center my-10 w-full">
              <Spinner />
            </div>
          ) : profileData?.userDetails?.merchantId ? (
            <button
              className="hover:text-white hover:opacity-90 focus:text-white rounded-[10px]"
              onClick={() =>
                toggleDialogVisibility(true, <DisconnectAccount />)
              }
              disabled={validatingUser}
            >
              {validatingUser ? 'Validating...' : 'Disconnect'}
            </button>
          ) : (
            <button
              onClick={handleOnboardVendor}
              className="hover:text-white hover:opacity-90 focus:text-white rounded-[10px]"
              disabled={validatingUser}
            >
              {validatingUser
                ? 'Validating...'
                : 'Connect your PayPal account now'}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
