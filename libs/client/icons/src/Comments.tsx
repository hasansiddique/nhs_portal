import { type SVGProps } from 'react';

export const CommentsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    {...props}
  >
    <path
      d="M23.8218 4.33341C23.8218 3.14175 22.8577 2.16675 21.666 2.16675H4.33268C3.14102 2.16675 2.16602 3.14175 2.16602 4.33341V17.3334C2.16602 18.5251 3.14102 19.5001 4.33268 19.5001H19.4993L23.8327 23.8334L23.8218 4.33341ZM19.4993 15.1667H6.49935V13.0001H19.4993V15.1667ZM19.4993 11.9167H6.49935V9.75008H19.4993V11.9167ZM19.4993 8.66675H6.49935V6.50008H19.4993V8.66675Z"
      fill={props.fill}
    />
  </svg>
);
