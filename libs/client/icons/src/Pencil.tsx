import { type SVGProps } from 'react';

export const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="22"
    viewBox="0 0 23 22"
    fill="none"
    {...props}
  >
    <path
      d="M13.4108 8.26833L14.2541 9.11167L5.94913 17.4167H5.10579V16.5733L13.4108 8.26833ZM16.7108 2.75C16.4816 2.75 16.2433 2.84167 16.0691 3.01583L14.3916 4.69333L17.8291 8.13083L19.5066 6.45333C19.8641 6.09583 19.8641 5.51833 19.5066 5.16083L17.3616 3.01583C17.1783 2.8325 16.9491 2.75 16.7108 2.75ZM13.4108 5.67417L3.27246 15.8125V19.25H6.70996L16.8483 9.11167L13.4108 5.67417Z"
      fill={props.fill || 'white'}
    />
  </svg>
);
