import * as React from 'react';

import { cn } from '@your-props/client/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  withError?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, withError, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[4px] border border-solid border-white/10 bg-[#222222] px-4 py-3 text-base text-[#EBEBEB] ring-offset-background placeholder:text-[#C5B6B3] focus-visible:border-[var(--primary-color3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition',
          withError && 'border-destructive',

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
