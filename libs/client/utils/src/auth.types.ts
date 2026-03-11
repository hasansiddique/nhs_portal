import { z } from 'zod';

export const signInSchema = z.object({
  username: z
    .string()
    .nonempty('Username is required')
    .refine(
      (username) =>
        !username.includes('@') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username),
      {
        message: 'Invalid email format',
      }
    ),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export type ClientSignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email address'),
  username: z
    .string()
    .min(4, 'Username must be at least 4 characters long')
    .nonempty('Username is required'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
});

export type ClientSignUpSchema = z.infer<typeof signUpSchema>;

export const signUpSchema2 = z.object({
  first_name: z.string().nonempty('First name is required'),
  last_name: z.string().nonempty('Last name is required'),
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
});

export type ClientSignUpSchema2 = z.infer<typeof signUpSchema2>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email address'),
});

export type ClientForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'New password and confirm passwords do not match',
    path: ['confirmPassword'],
  });

export type ClientSetPasswordSchema = z.infer<typeof setPasswordSchema>;

export const getUserId = (): string | null => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') as string);
    return currentUser?.id || null;
  } catch {
    return null;
  }
};
