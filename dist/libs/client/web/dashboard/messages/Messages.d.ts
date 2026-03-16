import { z } from 'zod';

export declare const messageSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export type MessageSchema = z.infer<typeof messageSchema>;
export declare const MessagesPage: () => import("react/jsx-runtime").JSX.Element;
