import { CalendarEvent } from './index';

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventCreate: (startTime: Date) => void;
}
export declare function WeekView({ currentDate, events, onEventCreate }: WeekViewProps): import("react/jsx-runtime").JSX.Element;
export {};
