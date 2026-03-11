import { type SVGProps } from 'react';

export const SvgPropShip = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    {...props}
  >
    <rect width="60" height="60" rx="10" fill="#DF4949" />
    <path
      d="M40 26H37V22H23C21.9 22 21 22.9 21 24V35H23C23 36.66 24.34 38 26 38C27.66 38 29 36.66 29 35H35C35 36.66 36.34 38 38 38C39.66 38 41 36.66 41 35H43V30L40 26ZM39.5 27.5L41.46 30H37V27.5H39.5ZM26 36C25.45 36 25 35.55 25 35C25 34.45 25.45 34 26 34C26.55 34 27 34.45 27 35C27 35.55 26.55 36 26 36ZM28.22 33C27.67 32.39 26.89 32 26 32C25.11 32 24.33 32.39 23.78 33H23V24H35V33H28.22ZM38 36C37.45 36 37 35.55 37 35C37 34.45 37.45 34 38 34C38.55 34 39 34.45 39 35C39 35.55 38.55 36 38 36Z"
      fill="white"
    />
  </svg>
);
