/** biome-ignore lint/a11y/noStaticElementInteractions: table rows are clickable containers */
/** biome-ignore lint/a11y/useKeyWithClickEvents: rows are informational only in this context */
import * as React from 'react';
import { flexRender, type Row, type Table as TanstackTable } from '@tanstack/react-table';

import { cn } from '@your-props/client/utils';

type DataTableMode = 'pagination' | 'infinite';

export interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  rowClassName?: string;
  cellClassName?: string;
  highlightOnHover?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  mode?: DataTableMode;
  isLoading?: boolean;
}

const LOAD_DELAY = 500;

export function DataTable<TData>({
  table,
  actionBar,
  rowClassName,
  cellClassName,
  children,
  className,
  highlightOnHover = true,
  onRowClick,
  mode = 'infinite',
  isLoading,
  ...props
}: DataTableProps<TData>) {
  const [visiblePages, setVisiblePages] = React.useState<number[]>([0]);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);

  React.useEffect(() => {
    if (mode !== 'infinite') return;
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && table.getCanNextPage() && !isFetchingMore) {
          setIsFetchingMore(true);
          await new Promise((r) => setTimeout(r, LOAD_DELAY));
          const next = table.getState().pagination.pageIndex + 1;
          table.setPageIndex(next);
          setVisiblePages((prev) => (prev.includes(next) ? prev : [...prev, next]));
          setIsFetchingMore(false);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [mode, table, isFetchingMore]);

  const visibleRows =
    mode === 'infinite'
      ? visiblePages.flatMap((pageIndex) => {
          const { pageSize } = table.getState().pagination;
          const start = pageIndex * pageSize;
          const end = start + pageSize;
          return table.getPrePaginationRowModel().rows.slice(start, end);
        })
      : table.getRowModel().rows;

  const columns = table.getVisibleFlatColumns();

  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...props}
    >
      {children}

      <div className="overflow-hidden rounded-[12px] border border-slate-700/80 bg-slate-900/70">
        <div className="max-h-[460px] overflow-auto">
          <table className="min-w-full text-left text-lg text-slate-100/80">
            <thead className="border-b border-slate-700/80 bg-slate-900/90 text-base uppercase tracking-wide text-slate-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const width = header.getSize();
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: `${width}px`,
                          minWidth: header.column.columnDef.minSize
                            ? `${header.column.columnDef.minSize}px`
                            : undefined,
                          maxWidth: header.column.columnDef.maxSize
                            ? `${header.column.columnDef.maxSize}px`
                            : undefined,
                        }}
                        className="px-4 py-3 font-semibold"
                      >
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'cursor-pointer select-none hover:text-slate-50',
                            'flex items-center gap-x-1.5'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    highlightOnHover && 'hover:bg-slate-800/70',
                    'border-b border-slate-800/80 last:border-b-0',
                    rowClassName
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const width = cell.column.getSize();
                    return (
                      <td
                        key={cell.id}
                        className={cn('px-4 py-3 align-top text-lg', cellClassName)}
                        style={{
                          width: `${width}px`,
                          minWidth: cell.column.columnDef.minSize
                            ? `${cell.column.columnDef.minSize}px`
                            : undefined,
                          maxWidth: cell.column.columnDef.maxSize
                            ? `${cell.column.columnDef.maxSize}px`
                            : undefined,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {visibleRows.length === 0 && !isFetchingMore && !isLoading && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No data available
                  </td>
                </tr>
              )}

              {(isLoading || isFetchingMore) && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-4 text-center text-sm text-slate-300"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300/70 [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300/70 [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300/70" />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mode === 'infinite' && <div ref={loaderRef} className="h-6" />}

      {mode === 'pagination' && (
        <div className="flex flex-col gap-2.5">
          {/* Pagination controls are provided by DataTablePagination in the web app */}
          {actionBar}
        </div>
      )}
    </div>
  );
}

