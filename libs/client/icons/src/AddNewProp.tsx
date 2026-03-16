import { type SVGProps } from 'react';

export const AddNewPropIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    {...props}
  >
    <path
      d="M20.5833 3.25H5.41667C4.21417 3.25 3.25 4.225 3.25 5.41667V20.5833C3.25 21.775 4.21417 22.75 5.41667 22.75H20.5833C21.775 22.75 22.75 21.775 22.75 20.5833V5.41667C22.75 4.225 21.775 3.25 20.5833 3.25ZM18.4167 14.0833H14.0833V18.4167H11.9167V14.0833H7.58333V11.9167H11.9167V7.58333H14.0833V11.9167H18.4167V14.0833Z"
      fill={props.fill}
    />
  </svg>
);
