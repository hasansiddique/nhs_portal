import { Table } from '@tanstack/react-table';
import * as React from 'react';
export interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
    table: Table<TData>;
}
export declare function DataTablePagination<TData>({ table, className, ...props }: DataTablePaginationProps<TData>): import("react/jsx-runtime").JSX.Element;
