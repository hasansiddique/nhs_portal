import { toast } from 'sonner';
import React, { useState } from 'react';

import { Input } from '@your-props/client/ui';
import { request, useAuthDialogStore } from '@your-props/client/utils';
import {reactSelectStyles} from "../../props/partials/utils";
import ReactSelect from "react-select";

export const CreateQuoteForm = ({
  orderId,
  getOrderDetails,
}: {
  orderId: string;
  getOrderDetails: () => void;
}) => {
  const [shippingCost, setShippingCost] = useState('');
  const [deliveryIn, setDeliveryIn] = useState<number | null>(null);
  const [updatingOffer, setUpdatingOffer] = useState(false);

  const { toggleMessageDialogVisibility } = useAuthDialogStore();
  const duration = [3, 7, 14, 30, 60];

  const updateOfferData = async () => {
    setUpdatingOffer(true);

    try {
      const { data } = await request.post(`/set-shipping-quote`, {
        order_id: orderId,
        amount: shippingCost,
        shipping_days: deliveryIn
      });

      toast.success(data?.message || 'Shipping quote set successfully!');
      toggleMessageDialogVisibility(false, null);
      getOrderDetails();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data.messages?.error || err.message || 'Something went wrong.');
    } finally {
      setUpdatingOffer(false);
    }
  };

  const handleOnChange = (e: any) => {
    let value = e.target.value;
    if (value < 1) value = '';
    setShippingCost(value);
  };

  return (
    <div className="flex flex-col items-center px-[1rem] py-[3rem] sm:p-[4rem]">
      <h2 className="text-[28px] leading-[44px] font-bold justify-center flex">
        Shipping Quote
      </h2>

      <div className="pt-[18px] pb-[26px] w-full sm:w-[61%]">


        <p className="text-[20px] leading-[26px] font-bold my-[8px]">Delivery in</p>
        <div className="relative">
          <ReactSelect
            placeholder="Estimated shipping days"
            isSearchable={false}
            classNamePrefix={
              'custom-select'
            }
            className="rounded-[10px] !bg-[#222222] absolute whitespace-nowrap"
            onChange={(option) => setDeliveryIn(option?.value ?? null)}
            options={
              duration.map((t) => ({
                value: t,
                label: t + ' Days',
              })) || []
            }
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary50: '#EF6A3B95',
                primary25: '#EF6A3B95',
                primary: '#EF6A3B',
              },
            })}
            styles={reactSelectStyles}
          />
        </div>

        <p className="text-[20px] leading-[26px] font-bold my-[8px]">Cost</p>
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
          value={shippingCost}
          className="h-[48px]"
          type="number"
          min={1}
        />
      </div>

      <div className="flex gap-8 w-full sm:w-auto flex-col sm:flex-row mt-10">
        <button
          disabled={updatingOffer}
          onClick={updateOfferData}
          className="sm:w-80 submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
        >
          Set Quote
        </button>

        <button
          disabled={updatingOffer}
          onClick={() => toggleMessageDialogVisibility(false, null)}
          className="sm:w-80 rounded-[10px] bg-[#676767] border-[#676767] whitespace-nowrap hover:bg-[#676767] focus:text-white hover:text-white hover:opacity-90"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
