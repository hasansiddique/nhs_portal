import * as React from 'react';
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    withError?: boolean;
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export { Textarea };
