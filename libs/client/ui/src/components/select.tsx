import * as React from 'react';
import { LuCheck, LuChevronDown } from 'react-icons/lu';
import * as SelectPrimitive from '@radix-ui/react-select';

import { cn } from '@your-props/client/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    withError?: boolean;
    iconClassName?: string;
  }
>(({ className, children, withError, iconClassName, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex h-10 w-full items-center justify-between rounded-[4px] border border-solid border-white/10 bg-[#222222] px-3 py-1.5 text-base text-[#EBEBEB] ring-offset-background placeholder:text-[#C5B6B3] focus:border-[var(--primary-color3)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition',
      withError && 'border-destructive',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <LuChevronDown
        className={cn(
          'size-4 opacity-50 group-data-[state=open]:rotate-180',
          iconClassName
        )}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    viewportClassName?: string;
  }
>(
  (
    { className, children, position = 'popper', viewportClassName, ...props },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          'relative z-50 min-w-[8rem] max-h-[350px] overflow-hidden rounded-[4px] border border-white/10 bg-[#222222] py-2 text-[#EBEBEB] shadow-dropdown-shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
            viewportClassName
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    circleColor?: string | null;
    withIndicator?: boolean;
  }
>(
  (
    { className, children, circleColor, withIndicator = true, ...props },
    ref
  ) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-[4px] py-1.5 pl-8 pr-2 text-base text-[#EBEBEB] outline-none focus:bg-white/10 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        !withIndicator && 'pl-2',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        {circleColor ? (
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: circleColor }}
          />
        ) : null}
        {withIndicator ? (
          <SelectPrimitive.ItemIndicator>
            <LuCheck className="size-4" />
          </SelectPrimitive.ItemIndicator>
        ) : null}
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SearchableSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    searchable?: boolean;
  }
>(
  (
    { className, children, position = 'popper', searchable = true, ...props },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      setSearchQuery(inputValue);
    };

    const filteredChildren = React.Children.toArray(children).filter(
      (child) => {
        if (React.isValidElement(child)) {
          const reactElementChild = child as React.ReactElement;
          const childProps = reactElementChild.props;
          const childChildren =
            typeof childProps.children === 'string' ? childProps.children : '';

          // Now you can safely use childChildren
          if (typeof childChildren === 'string') {
            return childChildren
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
        }
        return false; // Exclude children that don't meet the criteria
      }
    );
    // Add ARIA attributes
    const ariaExpanded =
      searchable && filteredChildren.length > 0 ? 'true' : 'false';

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-input bg-popover py-2 text-popover-foreground shadow-dropdown-shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className
          )}
          position={position}
          {...props}
          aria-expanded={ariaExpanded} // ARIA attribute indicating the expanded state of the dropdown
          aria-haspopup="listbox" // ARIA attribute indicating that the dropdown has a listbox
        >
          {searchable && (
            <input
              id="searchInput"
              type="text"
              className="mb-2 w-full rounded-md border border-gray-300 bg-black px-3 py-1 text-white" // Add background and font color styles
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
              ref={inputRef}
              maxLength={30}
              aria-label="Search" // ARIA label for the search input
              role="search" // ARIA role for the search input
            />
          )}
          <SelectPrimitive.Viewport
            className={cn(
              'p-1',
              position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
            )}
          >
            {filteredChildren.length > 0 ? filteredChildren : children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }
);

SearchableSelectItem.displayName = SelectPrimitive.Content.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SearchableSelectItem,
};
