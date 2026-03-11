import { toast } from 'sonner';
import React, { useState } from 'react';

import { request, useAuthDialogStore } from '@your-props/client/utils';

export const AcceptQuoteForm = ({
  orderId,
  getOrderDetails,
}: {
  orderId: string;
  getOrderDetails: () => void;
}) => {
  const [updatingOffer, setUpdatingOffer] = useState(false);

  const { toggleMessageDialogVisibility } = useAuthDialogStore();

  const updateOfferData = async () => {
    setUpdatingOffer(true);

    try {
      const { data } = await request.post(`/accept-shipping-quote`, {
        order_id: orderId,
      });
      toast.success(data?.message || 'Shipping quote accepted!');
      toggleMessageDialogVisibility(false, null);
      getOrderDetails();
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setUpdatingOffer(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-[1rem] py-[3rem] sm:p-[4rem]">
      <div className="flex flex-col py-[26px]">
        <h2 className="text-[28px] leading-[44px] font-bold justify-center flex">
          Shipping Quote
        </h2>
        <p className="text-[#C5B6B3] text-[20px] leading-[28px] text-center pt-[20px]">
          Are you sure you want to accept this quote request?
        </p>
      </div>

      <div className="flex gap-8 w-full sm:w-auto flex-col sm:flex-row mt-10">
        <button
          disabled={updatingOffer}
          onClick={updateOfferData}
          className="sm:w-80 submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
        >
          Accept
        </button>

        <button
          disabled={updatingOffer}
          onClick={() => toggleMessageDialogVisibility(false, null)}
          className="sm:w-80 rounded-[10px] bg-[#676767] border-[#676767] whitespace-nowrap hover:bg-[#676767] focus:text-white hover:text-white hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
};
