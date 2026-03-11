import { z } from 'zod';

export const shippingFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First Name is required.')
    .max(25)
    .regex(/^[a-zA-Z\s]+$/, 'First Name can only contain letters.'),
  lastName: z
    .string()
    .min(1, 'Last Name is required.')
    .max(25)
    .regex(/^[a-zA-Z\s]+$/, 'Last Name can only contain letters.'),
  phone: z
    .string()
    .min(7, 'Phone Number is required.')
    .max(15, 'Phone Number must be at most 15 digits.')
    .regex(/^[0-9]+$/, 'Phone Number must contain only digits.'),
  country: z.string().min(1, 'Country is required.').max(25),
  state: z.string().min(1, 'State is required.').max(25),
  city: z.string().max(25).optional(),
  zipcode: z
    .string()
    .min(1, 'Zip code is required.')
    .max(15)
    .regex(/^[0-9]+$/, 'Zip code must contain only digits.'),
  address: z.string().min(1, 'Address is required.').max(500),
});
export type ShippingSchema = z.infer<typeof shippingFormSchema>;
