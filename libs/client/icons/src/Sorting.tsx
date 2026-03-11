import React, { type SVGProps } from 'react';

export const SvgSortIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 7H21"
      stroke="#EF6A3B"
      strokeWidth="1.5"
      strokeLinecap="round"
    ></path>
    <path
      d="M6 12H18"
      stroke="#EF6A3B"
      strokeWidth="1.5"
      strokeLinecap="round"
    ></path>
    <path
      d="M10 17H14"
      stroke="#EF6A3B"
      strokeWidth="1.5"
      strokeLinecap="round"
    ></path>
  </svg>
);
