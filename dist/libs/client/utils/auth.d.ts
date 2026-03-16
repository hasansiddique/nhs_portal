import { ReactElement } from 'react';

type HoCReturnType = () => ReactElement;
export declare const withProtectedRoute: (RouteComponent: () => ReactElement | null) => HoCReturnType;
export {};
