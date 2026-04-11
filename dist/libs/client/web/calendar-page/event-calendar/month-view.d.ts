import { CalendarEvent } from './index';

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventCreate: (startTime: Date) => void;
}
export declare function MonthView({ currentDate, events, onEventCreate }: MonthViewProps): import("react/jsx-runtime").JSX.Element;
export {};
