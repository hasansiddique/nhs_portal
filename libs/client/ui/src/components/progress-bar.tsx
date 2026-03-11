import React from 'react';
import * as Progress from '@radix-ui/react-progress';

export const ProgressBar = ({
  color,
  progress,
}: {
  color?: string;
  progress: number;
}) => {
  const barColor = `bg-[${color}]` || 'bg-[#676767]';

  return (
    <Progress.Root
      className={`relative overflow-hidden bg-[#676767] rounded-full w-full h-[6px]`}
      style={{
        transform: 'translateZ(0)',
      }}
      value={progress}
    >
      <Progress.Indicator
        className="bg-[#FFBD0C] w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};
