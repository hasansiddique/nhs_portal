import { CalendarEvent } from './index';

interface EventsPopupProps {
    date: Date;
    events: CalendarEvent[];
    position: {
        top: number;
        left: number;
    };
    onClose: () => void;
    onEventSelect: (event: CalendarEvent) => void;
}
export declare function EventsPopup({ date, events, position, onClose, onEventSelect }: EventsPopupProps): import("react/jsx-runtime").JSX.Element;
export {};
