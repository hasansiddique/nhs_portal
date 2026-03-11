import React from 'react';

interface CardProps {
  icon: any;
  title: string;
  count: number;
}

export const StatsCard = (item: CardProps) => {
  return (
    <div className="bg-[#393939]/40 p-[24px] rounded-[10px] flex flex-row">
      <div className="w-[54px] h-[56px] rounded-[10px] p-[14px] bg-[#393939]">
        <item.icon />
      </div>

      <div className="pl-[18px] flex flex-col justify-between">
        <p className="leading-[150%] text-[16px] whitespace-nowrap font-medium text-[#C5B6B3]">
          {item.title}
        </p>

        <p className="leading-[150%] text-[24px] font-medium text-white">
          {item.count}
        </p>
      </div>
    </div>
  );
};
