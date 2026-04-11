import { RouterOutputs } from '@train-on/client-utils';

type E = RouterOutputs["service"]["event"]["getEventById"];
type EventClients = E["clients"];
type EventData = E["event"];
type Props = {
    clickedTimeSlot?: Date | undefined;
    eventClients?: EventClients;
    eventData?: EventData;
    /** When opening from reservations day view, the space (court) that was clicked */
    selectedSpaceId?: string;
};
export declare const CalendarSidebar: ({ clickedTimeSlot, eventClients, eventData, selectedSpaceId, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
