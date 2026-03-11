import { Modal } from 'react-bootstrap';
import React, { Dispatch, SetStateAction } from 'react';

export const ScreenMatchPop = ({
  showModal,
  setShowModal,
  handleDelete,
}: {
  showModal: boolean;
  handleDelete: () => void;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Modal
      size="lg"
      centered={true}
      show={showModal}
      backdrop="static"
      scrollable={true}
      className="bg-[#393939B2]"
    >
      <div className="p-0 modal-header">
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => {
            setShowModal(false);
          }}
        ></button>
      </div>

      <div className="modal-body pd-40">
        <h2 className="text-[28px] leading-[44px] font-semibold justify-center flex pb-6 text-center">
          Screen Match
        </h2>

        <p className="text-[16px] leading-[130%] text-center">
          "screen-matched" means this EXACT item (and not an identical item) can
          be IDENTIFIED on screen due to scratches, marks, dents, flaws, etc..
          If you do not state the identifiable marks in the description, we will
          REMOVE the screen-matched status!
        </p>

        <div className="flex items-center justify-center w-full mt-12">
          <div className="w-[40%]">
            <button
              onClick={() => {
                handleDelete();
                setShowModal(false);
              }}
              className="p-0 submit rounded-[10px] h-[48px] w-full focus:text-white hover:text-white hover:opacity-90"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
