import { z } from 'zod';

export declare const signInSchema: z.ZodObject<{
    username: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type ClientSignInSchema = z.infer<typeof signInSchema>;
export declare const signUpSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    password: string;
}, {
    email: string;
    username: string;
    password: string;
}>;
export type ClientSignUpSchema = z.infer<typeof signUpSchema>;
export declare const signUpSchema2: z.ZodObject<{
    first_name: z.ZodString;
    last_name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}>;
export type ClientSignUpSchema2 = z.infer<typeof signUpSchema2>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type ClientForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export declare const setPasswordSchema: z.ZodEffects<z.ZodObject<{
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    confirmPassword: string;
}, {
    password: string;
    confirmPassword: string;
}>, {
    password: string;
    confirmPassword: string;
}, {
    password: string;
    confirmPassword: string;
}>;
export type ClientSetPasswordSchema = z.infer<typeof setPasswordSchema>;
export declare const getUserId: () => string | null;
