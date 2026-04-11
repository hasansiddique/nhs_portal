export type EventType = {
    id: string;
    trainerName: string;
    trainerId: string;
    trainerImageUrl: string | null | undefined;
    confirmed: boolean;
    serviceName: string;
    serviceIsManyClientsAllowed: boolean;
    serviceIsFree: boolean;
    isReceptionist: boolean;
    people: {
        name: string;
        imageUrl: string | null;
        id: string;
    }[];
    status: string;
    class: string;
    totalPay: string;
    actualPay: string;
    startTime: Date;
    endTime: Date;
};
export type EventTypeForDay = {
    id: string;
    confirmed: boolean;
    serviceName: string;
    isReceptionist: boolean;
    people: {
        name: string;
        imageUrl: string | null;
        id: string;
    }[];
    trainerId: string;
    trainerName: string;
    class: string;
    totalPay: string;
    actualPay: string;
    startTime: Date;
    endTime: Date;
};
export declare const Timeline: ({ timeSlots, isDaySelected, }: {
    timeSlots: Map<string, EventType[]>;
    isDaySelected: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const TimelineForDayView: ({ timeSlots, isDaySelected, }: {
    timeSlots: Map<string, EventType[]>;
    isDaySelected: boolean;
}) => import("react/jsx-runtime").JSX.Element;
