import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Modal } from 'react-bootstrap';
import { DashboardLayout } from '../Dashboard';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { UserCommentsPage } from './UserComments';
import { RecievedCommentsPage } from './RecievedComments';

export const CommentsPage = () => {
  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Dashboard',
      isActive: false,
      redirectUrl: '/dashboard/props',
    },
    {
      label: 'Comments',
      isActive: true,
    },
  ];

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        <div className="flat-tabs themesflat-tabs tabs p-2 lg:p-0">
          <Tabs className="lg:mr-[10px] comment">
            <TabList>
              <Tab>Your Comments</Tab>
              <Tab>Recieved Comments</Tab>
            </TabList>

            <TabPanel>
              <UserCommentsPage/>
            </TabPanel>
            <TabPanel>
              <RecievedCommentsPage/>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export const DeletePopup = ({
  showModal,
  setShowModal,
  handleDelete,
  title,
  btnTitle,
  isSpacing = true,
}: {
  showModal: boolean;
  handleDelete: () => void;
  setShowModal: Dispatch<SetStateAction<string>>;
  title?: string;
  btnTitle?: string;
  isSpacing: boolean;
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
          onClick={() => setShowModal('')}
          type="button"
          className="btn-close"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body pd-40">
        <h2
          className={`text-[28px] leading-[44px] font-semibold justify-center flex ${
            isSpacing ? 'pb-6' : 'pb-0'
          } text-center`}
        >
          {title || 'Are you sure you want to delete?'}
        </h2>

        <div className="flex items-center justify-center w-full mt-12">
          <div className="w-[30%]">
            <button
              onClick={handleDelete}
              className="p-0 submit rounded-[10px] h-[48px] w-full focus:text-white hover:text-white hover:opacity-90"
            >
              {btnTitle || 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
