import { CalendarEvent } from './event-calendar';

export interface ReservationSpace {
    id: string;
    name: string;
    type: string;
}
/** Mock spaces (courts) for reservations calendar - no API yet */
export declare const MOCK_SPACES: ReservationSpace[];
/** Generate mock reservation events matching Figma (Pickleball, Tennis, 60 Mins, etc.) */
export declare function getMockReservationsForRange(startDate: Date, endDate: Date): CalendarEvent[];
