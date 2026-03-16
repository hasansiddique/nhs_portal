import { toast } from 'sonner';
import React, { useState } from 'react';

import { Textarea } from '@your-props/client/ui';
import { request, useAuthDialogStore } from '@your-props/client/utils';

export const RejectOrder = ({
  orderId,
  getOrderDetails,
}: {
  orderId: string;
  getOrderDetails: () => void;
}) => {
  const { toggleMessageDialogVisibility } = useAuthDialogStore();

  const [updatingOffer, setUpdatingOffer] = useState(false);
  const [reason, setReason] = useState('');

  const updateOfferData = async () => {
    setUpdatingOffer(true);

    try {
      const { data } = await request.post(`/cancel-order?order_id=${orderId}`, {
        order_id: orderId,
        reason: reason,
      });
      toast.success(data?.message || 'Order has been rejected!');
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
      <div className="flex flex-col w-full py-[26px]">
        <h2 className="text-[28px] leading-[44px] font-bold flex">
          Cancel Order?
        </h2>
        {/* input field for reason */}
        <p className="text-[14px] leading-[22px] font-[400] mt-3">
          Reason for canceling the order? (Optional)
        </p>
        <Textarea
          rows={5}
          name="bio"
          value={reason}
          placeholder="Reason"
          className="mt-2 border-[#8a8aa04d] text-white text-[14px]"
          onChange={(e) => setReason(e.target.value)}
        />

        <p className="text-[#C5B6B3] text-[16px] leading-[28px]">
          <small>This can not be undone</small>
        </p>
      </div>

      <div className="flex gap-8 w-full sm:w-auto flex-col sm:flex-row mt-10">
        <button
          disabled={updatingOffer}
          onClick={updateOfferData}
          className="sm:w-80 submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
        >
          Cancel Order
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
