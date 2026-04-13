import { CalendarEvent } from './index';

export interface EventCalendarProps {
    events?: CalendarEvent[];
    isLoading?: boolean;
    onEventUpdate?: (event: CalendarEvent) => void;
}
export declare function EventCalendar({ events, isLoading, onEventUpdate }: EventCalendarProps): import("react/jsx-runtime").JSX.Element;
