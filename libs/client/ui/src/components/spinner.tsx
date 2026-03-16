import * as React from 'react';
import { type SVGProps } from 'react';

import { clsx } from '@your-props/client/utils';
import { SvgLoaderIcon } from '@your-props/client/icons';

export const Spinner = ({
  className,
  loadingText = 'loading...',
}: {
  className?: string;
  loadingText?: string;
}) => (
  <div className="flex gap-1 justify-center items-center">
    <SvgLoaderIcon
      className={clsx('animate-spin fill-white', className)}
      width={24}
    />
    <p className="text-[15px] font-semibold">{loadingText}</p>
  </div>
);

export const SpinnerSm = ({ className }: { className?: string }) => (
  <div className="flex justify-center items-center">
    <SvgLoaderIcon
      className={clsx('animate-spin fill-white', className)}
      width={18}
    />
  </div>
);

export const FullPageSpinner = ({
  className,
  loadingText = 'loading...',
  parentClassName = 'absolute top-[80px] right-0 left-0 bottom-0 z-[110] flex items-center justify-center bg-[#222222] text-[32px] font-bold',
}: {
  className?: string;
  loadingText?: string;
  parentClassName?: string;
}) => (
  <div className={parentClassName}>
    <Spinner loadingText={loadingText} className={className} />
  </div>
);

export const DotRevolve = ({
  width = 24,
  height = 24,
  dur = '0.75s',
  color = '#ef6a3b',
  className,
}: SVGProps<SVGElement>) => {
  return (
    <svg
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <circle cx="12" cy="2.5" r="1.5">
        <animateTransform
          dur={dur}
          type="rotate"
          repeatCount="indefinite"
          attributeName="transform"
          values="0 12 12;360 12 12"
        />
      </circle>
    </svg>
  );
};
