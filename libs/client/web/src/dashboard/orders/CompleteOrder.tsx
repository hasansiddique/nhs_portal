import { toast } from 'sonner';
import React, { useState } from 'react';

import {Input, Textarea} from '@your-props/client/ui';
import { request, useAuthDialogStore } from '@your-props/client/utils';

export const CompleteOrder = ({
  orderId,
  getOrderDetails,
}: {
  orderId: string;
  getOrderDetails: () => void;
}) => {
  const { toggleMessageDialogVisibility } = useAuthDialogStore();

  const [updatingOffer, setUpdatingOffer] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const updateOfferData = async () => {
    setUpdatingOffer(true);

    try {
      const { data } = await request.post(`/complete-order`, {
        order_id: orderId,
        tracking_number: trackingNumber,
      });
      toast.success(data?.message || 'Order has been marked as completed!');
      toggleMessageDialogVisibility(false, null);
      getOrderDetails();
    } catch (err: any) {
      toast.error(err.response?.data.message || err.response?.data.messages?.error || err.message || 'Something went wrong.');
    } finally {
      setUpdatingOffer(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-[1rem] py-[3rem] sm:p-[4rem]">
      <div className="flex flex-col w-full py-[26px]">
        <h2 className="text-[28px] leading-[44px] font-bold flex">
          Mark order as complete?
        </h2>
        {/* input field for reason */}
        <p className="text-[16px] leading-[22px] font-[400] mt-3 mb-5">
          Please only mark the order as complete once you have shipped the order. Failing to do so may result in unnecessary disputes and complications
        </p>

        <Input
          type="text"
          value={trackingNumber}
          placeholder="Shipping Tracking Number"
          className="h-[48px]"
          onChange={(e) => setTrackingNumber(e.target.value)}
        />

        <p className="bg-[#c41a1a99] border border-solid border-[#c41a1a] rounded-lg py-1 font-bold text-[16px] text-center mt-4">
          This action cannot be undone
        </p>
      </div>

      <div className="flex gap-8 w-full sm:w-auto flex-col sm:flex-row mt-10">
        <button
          disabled={updatingOffer}
          onClick={updateOfferData}
          className="sm:w-80 submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
        >
          Complete Order
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
