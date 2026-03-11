import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from './button';
import { cn } from '@your-props/client/utils';

export interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  return (
    <div
      className={cn(
        'flex w-full flex-col-reverse items-center justify-between gap-3 overflow-auto py-2 text-base text-slate-300 sm:flex-row sm:gap-4',
        className
      )}
      {...props}
    >
      <div className="flex-1 whitespace-nowrap text-xs text-slate-500" />
      <div className="flex items-center gap-3">
        <Button
          aria-label="Go to previous page"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full border border-slate-700/80 bg-slate-900/80 text-slate-200 hover:bg-slate-800/80"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <div className="flex items-center justify-center text-base">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button
          aria-label="Go to next page"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full border border-slate-700/80 bg-slate-900/80 text-slate-200 hover:bg-slate-800/80"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

