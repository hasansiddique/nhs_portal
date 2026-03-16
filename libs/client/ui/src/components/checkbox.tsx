import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { LuCheck } from 'react-icons/lu';

import { cn } from '@your-props/client/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'appearance-none peer h-5 w-5 shrink-0 rounded-sm border border-[#19C4CF]/20 bg-transparent ring-offset-background focus-visible:ring-2 focus-visible:ring-[#19C4CF]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#19C4CF] data-[state=checked]:text-white',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-white')}
    >
      <LuCheck className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
