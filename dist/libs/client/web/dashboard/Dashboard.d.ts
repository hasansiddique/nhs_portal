import { ReactNode } from 'react';

export declare const DashboardLayout: ({ breadCrumbs, children, }: {
    children: ReactNode;
    breadCrumbs: {
        label: string;
        isActive: boolean;
        redirectUrl?: string;
    }[];
}) => import("react/jsx-runtime").JSX.Element;
