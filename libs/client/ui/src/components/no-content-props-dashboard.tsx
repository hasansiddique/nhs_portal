import React from 'react';

import {PlusIcon, SvgGhost} from '@your-props/client/icons';
import {Link} from "react-router-dom";

export const NoContentPropsDashboard = ({
  subText,
  showBackgroundColor = true,
  headingText = 'Nothing to see here',
}: {
  showBackgroundColor?: boolean;
  headingText?: string;
  subText: string;
}) => {
  return (

    <div
      className={`flex flex-col items-center justify-center py-20 px-[1.5rem] mt-[1rem] ${
        showBackgroundColor ? 'bg-[#393939]/40' : ''
      } mx-6 h-[79vh]`}
    >
      <SvgGhost/>

      <h2 className="text-[28px] font-bold leading-[44px] pt-12">
        {headingText}
      </h2>
      <p className="text-[20px] leading-[28px] text-[#C5B6B3]">{subText}</p>

      <p className="text-[20px] leading-[28px] text-[#C5B6B3]">
      <Link to={`/dashboard/add-item`}>
        <button
          className="flex flex-row items-center mt-[15px] h-[38px] px-[15px] py-[12px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none">
          <PlusIcon/>
          <span className="ml-[5px] font-medium">Add Item</span>
        </button>
      </Link>
      </p>
    </div>
  );
};
