import { z } from 'zod';

export declare const bulkUploadSchema: z.ZodObject<{
    file: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    file?: any;
}, {
    file?: any;
}>;
export type bulkUpload = z.infer<typeof bulkUploadSchema>;
export declare const BulkUpload: () => import("react/jsx-runtime").JSX.Element;
