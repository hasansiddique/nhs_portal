import React from 'react';
import { Modal } from 'react-bootstrap';

import { cn, useAuthDialogStore } from '@your-props/client/utils';

export const Dialog = ({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) => {
  const { dialogContent, dialogClasses } = useAuthDialogStore();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered={true}
      backdrop="static"
      scrollable={true}
      className="bg-[#393939B2]"
      dialogClassName={
        dialogClasses
          ? dialogClasses
          : 'w-auto m-[20px] md:my-[30px] md:mx-auto md:w-[600px]'
      }
    >
      <Modal.Header className="p-0" closeButton></Modal.Header>

      <div
        className={cn(
          'modal-body py-[30px] sm:py-[50px] px-[20px] sm:px-[50px]'
        )}
      >
        {dialogContent}
      </div>
    </Modal>
  );
};
