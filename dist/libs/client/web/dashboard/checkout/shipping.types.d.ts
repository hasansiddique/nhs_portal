import { z } from 'zod';

export declare const shippingFormSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodString;
    country: z.ZodString;
    state: z.ZodString;
    city: z.ZodOptional<z.ZodString>;
    zipcode: z.ZodString;
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    address: string;
    state: string;
    country: string;
    phone: string;
    firstName: string;
    lastName: string;
    zipcode: string;
    city?: string | undefined;
}, {
    address: string;
    state: string;
    country: string;
    phone: string;
    firstName: string;
    lastName: string;
    zipcode: string;
    city?: string | undefined;
}>;
export type ShippingSchema = z.infer<typeof shippingFormSchema>;
