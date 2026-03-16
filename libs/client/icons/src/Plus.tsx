import { type SVGProps } from 'react';

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    {...props}
  >
    <path
      d="M16.4997 11.9166H11.9163V16.4999C11.9163 17.0041 11.5038 17.4166 10.9997 17.4166C10.4955 17.4166 10.083 17.0041 10.083 16.4999V11.9166H5.49967C4.99551 11.9166 4.58301 11.5041 4.58301 10.9999C4.58301 10.4958 4.99551 10.0833 5.49967 10.0833H10.083V5.49992C10.083 4.99575 10.4955 4.58325 10.9997 4.58325C11.5038 4.58325 11.9163 4.99575 11.9163 5.49992V10.0833H16.4997C17.0038 10.0833 17.4163 10.4958 17.4163 10.9999C17.4163 11.5041 17.0038 11.9166 16.4997 11.9166Z"
      fill={props.fill || 'white'}
    />
  </svg>
);
export const SubtractIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="12"
    width="10.5"
    fill="#fff"
    viewBox="0 0 448 512"
  >
    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
  </svg>
);
