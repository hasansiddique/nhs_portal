import { CalendarEvent } from './event-calendar/types';

type CalendarState = {
    currentSelectedEvent?: CalendarEvent | null;
};
export declare const useCalendarState: () => CalendarState;
export declare const useCalendarActions: () => {
    updateSelectedEvent: (calendarEvent: CalendarEvent) => void;
    resetSelectedEvent: () => void;
};
export {};
