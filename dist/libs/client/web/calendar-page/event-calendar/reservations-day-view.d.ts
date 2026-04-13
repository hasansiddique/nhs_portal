import { CalendarEvent } from './index';

interface ReservationsDayViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventCreate: (startTime: Date, spaceId?: string) => void;
}
export declare function ReservationsDayView({ currentDate, events, onEventCreate, }: ReservationsDayViewProps): import("react/jsx-runtime").JSX.Element;
export {};
