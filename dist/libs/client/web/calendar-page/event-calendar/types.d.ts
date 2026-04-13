export type CalendarViewTypes = "month" | "week" | "day";
export interface CalendarEvent {
    room: string;
    title: string;
    description: string;
    actualPay: string;
    class: string;
    confirmed: boolean;
    endTime: string;
    id: string;
    isReceptionist: boolean;
    people: {
        attendanceState: string;
        name: string;
        imageUrl: string;
        id: string;
    }[];
    profile: {
        id: string;
        fullName: string;
        imageUrl: string | null;
    };
    serviceIsFree?: boolean;
    serviceIsManyClientsAllowed?: boolean;
    serviceName: string;
    startTime: string;
    status: string;
    totalPay: string;
    trainerId: string;
    trainerName: string;
    isShift?: string;
    dateKey: string;
    color: string;
    start: Date;
    end: Date;
}
export type EventColor = "blue" | "orange" | "violet" | "rose" | "emerald";
