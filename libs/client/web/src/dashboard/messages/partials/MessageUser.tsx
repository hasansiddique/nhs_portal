import React from 'react';

import defaultProfileImage from '../../../theme/assets/images/avatar/user-img.png';
import { format, parse } from 'date-fns';
import { useInboxActions, useInboxState } from '@your-props/client/utils';

export const MessagesUser = ({
  chatData,
  onClick,
}: {
  chatData: any;
  onClick?: () => void;
}) => {
  const { setActiveChat } = useInboxActions();
  const { activeChat } = useInboxState();

  const handleClick = () => {
    setActiveChat(chatData.id);
    if (onClick) onClick(); // Call onClick if provided
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex cursor-pointer hover:bg-[#393939]/90 rounded-[10px] p-6 mb-2 ${
          chatData.id === activeChat ? '!bg-[#393939]/90' : activeChat === null ? '' : ''
        }`}
      >
        <div className="flex w-full items-center">
          <img
            alt="User"
            width={40}
            height={40}
            src={chatData?.recipientAvatar || defaultProfileImage}
            className={`w-[36px] h-[36px] object-cover rounded-[10px] default_image `}
          />

          <div className="flex flex-col justify-between pl-3 flex-grow overflow-hidden">
            <div className="flex items-center justify-between w-full gap-3">
              <div className="text-[14px] leading-[18px] font-bold flex-grow truncate">
                {chatData?.recipientUsername}
              </div>

              <div className="text-[12px] leading-[18px] font-normal text-[#C5B6B3] flex-shrink-0">
                {chatData?.lastMessageTime ? (
                  format(parse(chatData.lastMessageTime, 'yyyy-MM-dd HH:mm:ss', new Date()), 'h:mm a')
                ) : (
                  <>-</>
                )}
              </div>
            </div>

            <p className="text-[13px] text-[#C5B6B3] leading-[20px] truncate">
              {chatData?.lastMessage}
            </p>
          </div>

          {Number(chatData.unreadCount) > 0 && (
            <div className="w-6 h-6 bg-[#ef6a3b] rounded-full ml-4 animate-pulse flex-shrink-0 flex justify-center items-center">{Number(chatData.unreadCount) > 9 ? '9+' : chatData.unreadCount}</div>
          )}
        </div>
      </div>
    </>
  );
};
