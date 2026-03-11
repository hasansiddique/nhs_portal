import React from 'react';
import {format, parseISO} from "date-fns";

export const MessagesReply = ({
  isReceived,
  messageText,
  messageTime,
}: {
  isReceived?: boolean;
  messageTime: string;
  messageText: string;
}) => {
  let isoTimestamp = messageTime;

  if (!/Z|([+-]\d{2}:\d{2})$/.test(messageTime)) {
    isoTimestamp += 'Z';
  }

  const parsedTime = parseISO(isoTimestamp);
  const formattedTime = isNaN(parsedTime.getTime()) ? 'Invalid Time' : format(parsedTime, 'h:mm a');

  return (
    <div
      className={`${
        isReceived ? 'self-start bg-[#222222]/90' : 'self-end bg-[#393939]/90'
      } rounded-[10px] max-w-[70%] px-[20px] py-[16px] mt-8 whitespace-break-spaces break-words group relative`}
    >
      <p
        className="text-[14px]"
      >{messageText}</p>
      <p className={`absolute text-[12px] leading-[14px] font-normal text-[#C5B6B3] mt-2 bottom-[-16px] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap ${!isReceived ? 'right-2' : 'left-2'}`}>
        {isReceived ? 'Received' : 'Sent'} @ {formattedTime}
      </p>
    </div>
  );
};
