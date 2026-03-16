import { z } from 'zod';

export declare const contactSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type ContactSchema = z.infer<typeof contactSchema>;
export declare const Footer: () => import("react/jsx-runtime").JSX.Element;
