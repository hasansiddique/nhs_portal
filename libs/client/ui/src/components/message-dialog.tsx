import React from 'react';
import { Modal } from 'react-bootstrap';

import { cn, useAuthDialogStore } from '@your-props/client/utils';

export const ModalDialog = ({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) => {
  const { dialogContent, dialogClasses } = useAuthDialogStore();

  return (
    <Modal
      size="lg"
      scrollable={true}
      show={show}
      onHide={onHide}
      centered={true}
      backdrop="static"
      className="bg-[#393939B2]"
      dialogClassName={dialogClasses}
    >
      <Modal.Header className="p-0" closeButton></Modal.Header>

      <div className={cn('modal-body px-[15px] py-0 rounded-[10px]')}>
        {dialogContent}
      </div>
    </Modal>
  );
};
