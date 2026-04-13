interface DroppableCellProps {
    id: string;
    date: Date;
    time?: number;
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}
export declare function DroppableCell({ id, date, time, children, className, onClick, }: DroppableCellProps): import("react/jsx-runtime").JSX.Element;
export {};
