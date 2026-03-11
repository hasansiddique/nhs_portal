import { toast } from 'sonner';
import { toNumber } from 'lodash';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { request } from '@your-props/client/utils';

import 'react-tabs/style/react-tabs.css';
import { Input } from '@your-props/client/ui';

export const OfferForm = ({
  productId,
  setOfferSubmitted,
  setIsOfferSubmit
}: {
  productId: string;
  setOfferSubmitted: Dispatch<SetStateAction<boolean>>;
  setIsOfferSubmit: Dispatch<SetStateAction<boolean>>;
}) => {
  const [offerAmount, setOfferAmount] = useState(1);
  const [fetchingLikes, setUpdatingOffer] = useState(false);
  const [likesData, setOfferData] = useState({ likes: [], totalLikes: 0 });

  const updateOfferData = async () => {
    setUpdatingOffer(true);

    try {
      const { data } = await request.post(`/send-offer`, {
        product_id: productId,
        amount: offerAmount,
      });

      setOfferData(data);
      setOfferSubmitted(true);
      setIsOfferSubmit(true);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setUpdatingOffer(false);
    }
  };

  const handleOnChange = (e: any) => {
    let value = e.target.value;
    if (value < 1) value = '';
    setOfferAmount(value);
  };

  return (
    <>
      <h2 className="text-[28px] leading-[44px] font-bold justify-center flex">
        Make an Offer
      </h2>

      <div className="py-[26px]">
        <Input
          onChange={handleOnChange}
          onKeyDown={(e) => {
            if (
              e.key === '-' ||
              e.key === 'e' ||
              e.key === '+' ||
              e.key === '.'
            ) {
              e.preventDefault();
            }
          }}
          placeholder="Enter Amount"
          value={offerAmount}
          className="h-[48px]"
          //defaultValue={1}
          type="number"
          min={1}
        />

        <div className="flex flex-col">
          <div className="flex flex-row justify-between w-full my-[8px]">
            <p className="text-[18px] leading-[28px] text-[#C5B6B3] font-normal">
              Your Offer:
            </p>
            <p className="text-[18px] leading-[28px] text-white font-extrabold">
              ${offerAmount}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={updateOfferData}
        className="w-full submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
      >
        Make Offer
      </button>
    </>
  );
};
