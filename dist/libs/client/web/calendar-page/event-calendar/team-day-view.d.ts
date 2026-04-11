import { CalendarEvent } from './index';

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventCreate: (startTime: Date) => void;
}
export declare function TeamDayView({ currentDate, events, onEventCreate }: WeekViewProps): import("react/jsx-runtime").JSX.Element;
export {};
