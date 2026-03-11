import { type SVGProps } from 'react';

export const ProfileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1.9C9.16 1.9 10.1 2.84 10.1 4C10.1 5.16 9.16 6.1 8 6.1C6.84 6.1 5.9 5.16 5.9 4C5.9 2.84 6.84 1.9 8 1.9ZM8 10.9C10.97 10.9 14.1 12.36 14.1 13V14.1H1.9V13C1.9 12.36 5.03 10.9 8 10.9ZM8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 9C5.33 9 0 10.34 0 13V16H16V13C16 10.34 10.67 9 8 9Z"
      fill="white"
    />
  </svg>
);
export const ProfileFilledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
  >
    <path
      d="M13.0007 13.0002C15.3948 13.0002 17.334 11.061 17.334 8.66683C17.334 6.27266 15.3948 4.3335 13.0007 4.3335C10.6065 4.3335 8.66732 6.27266 8.66732 8.66683C8.66732 11.061 10.6065 13.0002 13.0007 13.0002ZM13.0007 15.1668C10.1082 15.1668 4.33398 16.6185 4.33398 19.5002V21.6668H21.6673V19.5002C21.6673 16.6185 15.8932 15.1668 13.0007 15.1668Z"
      fill={props.fill}
    />
  </svg>
);
