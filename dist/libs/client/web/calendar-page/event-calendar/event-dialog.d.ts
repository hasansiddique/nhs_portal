import { CalendarEvent } from './index';

interface EventDialogProps {
    event: CalendarEvent | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete: (eventId: string) => void;
}
export declare function EventDialog({ event, isOpen, onClose, onSave, onDelete }: EventDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
