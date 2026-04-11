import { CalendarEvent } from './index';

interface DayViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventCreate: (startTime: Date) => void;
}
export declare function DayView({ currentDate, events, onEventCreate }: DayViewProps): import("react/jsx-runtime").JSX.Element;
export {};
