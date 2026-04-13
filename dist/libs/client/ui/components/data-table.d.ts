import { Row, Table as TanstackTable } from '@tanstack/react-table';
/** biome-ignore lint/a11y/noStaticElementInteractions: table rows are clickable containers */
/** biome-ignore lint/a11y/useKeyWithClickEvents: rows are informational only in this context */
import * as React from 'react';
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
export declare function DataTable<TData>({ table, actionBar, rowClassName, cellClassName, children, className, highlightOnHover, onRowClick, mode, isLoading, ...props }: DataTableProps<TData>): import("react/jsx-runtime").JSX.Element;
export {};
