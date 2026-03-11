import React from 'react';

import { PlusIcon, SvgGhost } from '@your-props/client/icons';
import { PaymentCheck } from '@your-props/client/utils';

export const NoContentPage = ({
  subText,
  showBackgroundColor = true,
  isHeight = false,
  showButton = false,
  isSpacing = true,
  headingText = 'Nothing to see here',
}: {
  showBackgroundColor?: boolean;
  isHeight?: boolean;
  showButton?: boolean;
  isSpacing?: boolean;
  headingText?: string;
  subText: string;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[8px] py-20 px-[1.5rem] ${
        isSpacing ? 'mt-[1rem]' : 'mt-0'
      } ${showBackgroundColor ? 'bg-[#393939]/40' : ''} ${
        isHeight ? 'h-full' : ''
      }`}
    >
      <SvgGhost />

      <h2 className="text-[28px] font-bold leading-[44px] pt-12">
        {headingText}
      </h2>
      <p className="text-[20px] leading-[28px] text-[#C5B6B3]">{subText}</p>

      {showButton && (
        <PaymentCheck addShowcaseAllowed>
          <button className="mt-5 flex flex-row items-center h-[38px] px-[15px] py-[12px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none">
            <PlusIcon />
            <span className="ml-[5px] font-medium">Add New Item</span>
          </button>
        </PaymentCheck>
      )}
    </div>
  );
};
