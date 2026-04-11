export interface Profile {
    id: string;
    fullName: string;
    imageUrl: string | null;
}
export declare function CalendarAvatar({ people, hidePlus, hideName, }: {
    people: Profile[];
    hidePlus?: boolean;
    hideName?: boolean;
}): import("react/jsx-runtime").JSX.Element;
