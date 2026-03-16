import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { Input, Textarea } from '@your-props/client/ui';
import { request, useAuthDialogStore } from '@your-props/client/utils';

export const DisputeForm = ({
  orderId,
  getOrderDetails,
}: {
  orderId: string;
  getOrderDetails: () => void;
}) => {
  const { toggleMessageDialogVisibility } = useAuthDialogStore();

  const [updatingOffer, setUpdatingOffer] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const updateOfferData = async () => {
    setUpdatingOffer(true);

    try {
      const { data } = await request.post(`/dispute-open`, {
        description: description,
        order_id: orderId,
        subject: subject,
      });
      toast.success(
        data?.message ||
          'Dispute has been submitted successfully. Please wait for admin to respond!'
      );
      toggleMessageDialogVisibility(false, null);
      navigate('/dashboard/disputes/' + data.disputeId + '/details/buyer');
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setUpdatingOffer(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-[1rem] py-[3rem] sm:p-[4rem]">
      <div className="flex flex-col w-full pb-[26px]">
        <h2 className="text-[28px] leading-[44px] font-bold flex">
          Create Dispute
        </h2>
      </div>

      <div className="flex flex-col w-full pb-[26px]">
        <p className="text-[14px] leading-[22px] font-bold mt-3">Subject</p>
        <Input
          onChange={(e) => setSubject(e.target.value)}
          className="h-[48px] mt-2"
          placeholder="Subject"
          value={subject}
          defaultValue={1}
          type="text"
          min={1}
        />
      </div>

      <div className="flex flex-col w-full pb-[26px]">
        <p className="text-[14px] leading-[22px] font-bold mt-3">
          Reason for creating dispute? (Optional)
        </p>
        <Textarea
          rows={5}
          name="description"
          value={description}
          placeholder="Reason"
          className="mt-2 border-[#8a8aa04d] text-white text-[14px]"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-8 w-full sm:w-auto flex-col sm:flex-row mt-10">
        <button
          disabled={updatingOffer}
          onClick={updateOfferData}
          className="sm:w-[180px] rounded-[10px] border-0 focus:text-white hover:text-white hover:opacity-90 disabled:opacity-50"
        >
          Create Dispute
        </button>

        <button
          disabled={updatingOffer}
          onClick={() => toggleMessageDialogVisibility(false, null)}
          className="sm:w-[180px] rounded-[10px] bg-[#676767] border-[#676767] whitespace-nowrap hover:bg-[#676767] focus:text-white hover:text-white hover:opacity-90"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
