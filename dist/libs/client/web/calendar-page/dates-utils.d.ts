export { ranges, type RangeType } from '../components/calendar/calendar-controls';
export declare const services: readonly ["event", "shifts", "all", "reservations"];
export type ServiceType = (typeof services)[number];
/** For reservations view: "all" or space id */
export declare const RESERVATIONS_SPACE_ALL: "all";
export type SelectedSpaceId = string;
export declare const eventTypes: readonly ["reservation", "service", "shift", "event"];
export type EventType = (typeof eventTypes)[number];
export declare function useSelectedAddEventType(): any;
export declare function useDatesHandler(): any;
