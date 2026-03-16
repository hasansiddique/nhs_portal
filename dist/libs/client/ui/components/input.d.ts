import * as React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    withError?: boolean;
    disable?: boolean;
    prefix?: string;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export { Input };
