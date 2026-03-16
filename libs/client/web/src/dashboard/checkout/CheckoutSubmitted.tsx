import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { SvgSuccess } from '@your-props/client/icons';

export const CheckoutSubmitted = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <Modal
      show={true}
      centered={true}
      backdrop="static"
      scrollable={true}
      className="bg-[#393939B2]"
      onHide={() => closeModal()}
      dialogClassName="w-auto m-[20px] md:my-[30px] md:mx-auto md:w-[600px]"
    >
      <Modal.Header className="p-0"></Modal.Header>

      <div className="modal-body py-[30px] sm:py-[50px] px-[20px] sm:px-[50px]">
        <div className="flex flex-col">
          <div className="flex justify-center items-center w-full">
            <div className="w-[78px] h-[78px] rounded-[80px] flex items-center justify-center bg-[#109A2E]/20">
              <div className="w-[58px] h-[58px] rounded-[80px] flex items-center justify-center bg-[#109A2E]">
                <SvgSuccess />
              </div>
            </div>
          </div>

          <div className="flex flex-col py-[26px]">
            <h2 className="text-[28px] leading-[44px] font-bold justify-center flex">
              Request Sent!
            </h2>
            <p className="text-[#C5B6B3] text-[20px] leading-[28px] text-center">
              The seller will now review your details and provide a shipping
              quote soon.
            </p>
          </div>

          <button
            onClick={() => {
              closeModal();
              navigate('/dashboard/orders');
            }}
            className="w-full submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
