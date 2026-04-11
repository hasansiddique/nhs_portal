import { default as React } from 'react';

type ColumnAlign = 'left' | 'center' | 'right';
export type NhsDashboardColumn = {
    key: string;
    label: string;
    align?: ColumnAlign;
};
export type NhsDashboardRow = Record<string, React.ReactNode>;
type NhsDashboardTableProps = {
    columns: NhsDashboardColumn[];
    rows: NhsDashboardRow[];
};
export declare const NhsDashboardTable: React.FC<NhsDashboardTableProps>;
export {};
