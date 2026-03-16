import React from 'react';

import 'react-tabs/style/react-tabs.css';
import { SvgSuccess } from '@your-props/client/icons';
import { useAuthDialogStore } from '@your-props/client/utils';

export const BidSubmitted = () => {
  const { toggleDialogVisibility } = useAuthDialogStore();

  return (
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
          Success!
        </h2>
        <p className="text-[#C5B6B3] text-[20px] leading-[28px] text-center">
          Your bid has been added successfully.<br/> Stay tuned for updates.
        </p>
      </div>

      <button
        onClick={() => toggleDialogVisibility(false, null)}
        className="w-full submit rounded-[10px]  border-0 focus:text-white hover:text-white hover:opacity-90"
      >
        Done
      </button>
    </div>
  );
};
