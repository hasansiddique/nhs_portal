import { z } from 'zod';

export declare const shippingMethods: readonly [{
    readonly id: "self_collect";
    readonly label: "Local Pickup";
}, {
    readonly id: "domestic";
    readonly label: "Domestic Shipping";
}, {
    readonly id: "international";
    readonly label: "International Delivery";
}];
export declare const propSchema: z.ZodEffects<z.ZodObject<any, "strip", z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>, {
    [x: string]: any;
}, {
    [x: string]: any;
}>;
export type PropSchema = z.infer<typeof propSchema>;
