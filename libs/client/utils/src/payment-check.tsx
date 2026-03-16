import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthDialogStore } from './store/use-dialog-store';
import { SvgExclamationIcon } from '@your-props/client/icons';

export const PaymentCheck = ({
  children,
  addShowcaseAllowed,
}: {
  children: React.ReactElement;
  addShowcaseAllowed: boolean;
}) => {
  const { toggleDialogVisibility } = useAuthDialogStore();
  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  return (currentUser?.paypalMerchantAccount && currentUser.countryId) ||
    addShowcaseAllowed ? (
    <Link to={`/dashboard/add-item`}>{children}</Link>
  ) : currentUser?.paypalMerchantAccount === null ? (
    React.cloneElement(children, {
      onClick: () => toggleDialogVisibility(true, <PaymentCheckPopup />),
    })
  ) : (
    React.cloneElement(children, {
      onClick: () => toggleDialogVisibility(true, <CountryCheckPopup />),
    })
  );
};

export const PaymentCheckPopup = ({
  isAcceptOffer,
}: {
  isAcceptOffer?: boolean;
}) => {
  const navigate = useNavigate();
  const { toggleDialogVisibility } = useAuthDialogStore();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-full text-center">
        <h2 className="text-[28px] leading-[44px] font-bold">Payment Check</h2>
        <p className="text-white text-[18px] mt-6">
          {`No payment account connected with your profile.
          Please connect your PayPal account to ${
            isAcceptOffer ? 'accept offers' : 'add props with this listing type'
          }.`}
        </p>
      </div>

      <div className="flex gap-8 w-full sm:w-auto flex-col sm:flex-row mt-16">
        <button
          onClick={() => {
            toggleDialogVisibility(false, null);
            navigate('/dashboard/payment');
          }}
          className="sm:w-80 submit rounded-[10px] border-0 focus:text-white hover:text-white hover:opacity-90"
        >
          Add Account
        </button>

        <button
          onClick={() => toggleDialogVisibility(false, null)}
          className="sm:w-80 rounded-[10px] bg-[#676767] border-[#676767] whitespace-nowrap hover:bg-[#676767] focus:text-white hover:text-white hover:opacity-90"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const CountryCheckPopup = () => {
  const navigate = useNavigate();
  const { toggleDialogVisibility } = useAuthDialogStore();

  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id;

  return (
    <div className="flex flex-col items-center ">
      <div className="flex justify-center items-center w-full">
        <div className="w-[55px] h-[55px] rounded-[80px] flex items-center justify-center bg-[red]/20">
          <div className="w-[40px] h-[40px] rounded-[80px] flex items-center justify-center bg-red-700">
            <SvgExclamationIcon />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full text-center">
        <h2 className="text-[28px] leading-[44px] font-bold">Required</h2>
        <p className="text-white text-[18px] mt-6">
          It looks like your country is not set. <br />
          Please update your profile to add props.
        </p>
      </div>

      <div className="flex gap-8 w-full flex-col sm:flex-row mt-16">
        <button
          onClick={() => {
            toggleDialogVisibility(false, null);
            navigate(`/user/${userId}/edit`);
          }}
          className="w-full submit rounded-[10px] border-0 focus:text-white hover:text-white hover:opacity-90"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};
