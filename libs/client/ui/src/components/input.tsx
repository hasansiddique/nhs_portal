import * as React from 'react';

import { cn } from '@your-props/client/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  withError?: boolean;
  disable?: boolean;
  prefix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, withError, prefix, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <>
        {type !== 'password' ? (
          <div
            className="flex relative items-stretch flex-grow"
            tabIndex={-1} // Ensures the div itself doesn't steal focus
            onWheel={(e) => e.preventDefault()}
          >
            {prefix && (
              <div
                className={cn(
                  'absolute top-1 left-1 bottom-1 flex items-center justify-center rounded-l-[4px] text-[#C5B6B3] border-r border-solid border-white/10 bg-[#222222] px-[10px] min-w-[40px] text-[18px] font-bold transition'
                )}
              >
                {prefix}
              </div>
            )}
            <input
              type={type}
              className={cn(
                'flex h-10 w-full rounded-[4px] border border-solid border-white/10 bg-[#222222] px-3 text-base text-[#EBEBEB] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#C5B6B3] focus-visible:border-[var(--primary-color3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition',
                withError && 'border-destructive focus-visible:border-destructive',
                prefix && '!pl-[60px]',
                className
              )}
              ref={ref}
              {...props}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        ) : (
          <div className="relative">
            <input
              type={showPassword ? 'text' : type}
              className={cn(
                'h-10 w-full rounded-[4px] border border-solid border-white/10 bg-[#222222] px-3 text-base text-[#EBEBEB] placeholder:text-[#C5B6B3] focus-visible:border-[var(--primary-color3)] focus-visible:outline-none transition',
                withError && 'border-destructive focus-visible:border-destructive',
                className
              )}
              ref={ref}
              {...props}
            />
            {/* show and hide password btn */}
            <div
              className="absolute right-[10px] top-[20px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <span
                  className="fa fa-fw fa-eye fa-eye-slash text-[12px]"
                  id="basic-addon2"
                ></span>
              ) : (
                <span className="fa fa-fw fa-eye text-[12px]" id="basic-addon2"></span>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
);
Input.displayName = 'Input';

export { Input };
