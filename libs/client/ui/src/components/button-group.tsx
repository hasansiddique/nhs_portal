import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

const toggleGroupItemClasses =
  'hover:bg-violet3 color-mauve11 data-[state=on]:bg-primary data-[state=on]:text-white flex px-[16px] py-[12px] w-full items-center justify-center bg-white text-base leading-4 border-r-[#D0D5DD] border-r-[1px] last:border-r-0 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none text-[#4B5768]';

export const ToggleButtonGroup = ({ items }: { items: any[] }) => (
  <ToggleGroup.Root
    type="single"
    defaultValue="center"
    aria-label="Text alignment"
    className="inline-flex bg-mauve6 rounded border-[#D0D5DD] border h-[48px]"
  >
    {items.map((item, index) => (
      <ToggleGroup.Item
        key={index}
        className={toggleGroupItemClasses}
        aria-label="Left aligned"
        value={item.key}
      >
        {item.label}
      </ToggleGroup.Item>
    ))}
  </ToggleGroup.Root>
);
