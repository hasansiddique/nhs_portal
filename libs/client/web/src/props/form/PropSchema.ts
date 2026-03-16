// propSchema.ts
import { z } from 'zod';

export const shippingMethods = [
  { id: 'self_collect', label: 'Local Pickup' },
  { id: 'domestic', label: 'Domestic Shipping' },
  { id: 'international', label: 'International Delivery' },
] as const;

export const propSchema = z
  .object({
    listing_type: z.string(),
    file: z
      .union([
        z.array(z.any()).min(1, 'Please upload at least one file'),
        z.object({}).optional(),
      ])
      .refine((value) => Array.isArray(value) || typeof value === 'object', {
        message: 'Invalid file input. Please upload a valid file.',
      }),
    character: z.string().min(1).max(2000).optional(),
    title: z
      .string()
      .min(6, 'Title must be at least 6 characters.')
      .max(60, 'Title cannot exceed 60 characters.'),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters.')
      .max(2000, 'Description cannot exceed 2000 characters.'),
    product_type: z.string().min(1, 'Please select a product type'),
    product_category: z.string().min(1, 'Please select a product category'),
    movie_id: z.string().min(1, 'Please select a movie'),

    stock: z.string().optional(),

    // accepting offers only
    minimum_offer: z
      .string()
      .refine((value) => Number.isInteger(Number(value)), {
        message: 'Price must be a whole number.',
      })
      .optional(),
    character_name: z.string().optional(),

    // buy it now only
    price: z
      .string()
      .refine((value) => Number.isInteger(Number(value)), {
        message: 'Price must be a whole number.',
      })
      .optional(),

    // auctions only
    starting_bid: z
      .string()
      .refine((value) => Number.isInteger(Number(value)), {
        message: 'Price must be a whole number.',
      })
      .optional(),
    reserve_price: z.string().optional(),
    duration: z.number().optional(),
    scheduled_start: z.boolean().optional(),
    start_date: z.string().optional(),

    // shipping
    shipping_self_collect: z.boolean().optional(),
    ...Object.fromEntries(
      shippingMethods
        .filter((method) => method.id !== 'self_collect') // Skip self_collect, it's not a shipping option
        .flatMap((method) => [
          [`shipping_${method.id}`, z.boolean().optional()],
          [`shipping_${method.id}_days`, z.number().optional()],
          [
            `shipping_${method.id}_fee`,
            z
              .string()
              .optional()
              .refine((value) => !value || parseFloat(value) >= 0, {
                message: 'Shipping fee must be at least 0',
              })
              .refine((value) => Number.isInteger(Number(value)), {
                message: 'Price must be a whole number.',
              }),
          ],
        ])
    ),
  })
  .superRefine((data, ctx) => {
    if (
      data.listing_type === 'accepting_offer' &&
      data.minimum_offer &&
      parseInt(data.minimum_offer) < 1
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['minimum_offer'],
        message: 'Minimum offer must be at least $1.',
      });
    }

    if (
      data.listing_type === 'sell_on_site' &&
      (!data.price || parseInt(data.price) < 1)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['price'],
        message: 'Price must be at least $1.',
      });
    }

    if (data.product_type === '2' && (!data.stock || data.stock < 1)) {
      ctx.addIssue({
        code: 'custom',
        path: ['stock'],
        message: 'Stock must be at least 1 units.',
      });
    }

    if (data.listing_type === 'bidding') {
      if (!data.starting_bid || parseInt(data.starting_bid) < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['starting_bid'],
          message: 'Starting bid must be at least $1.',
        });
      }

      if (data.scheduled_start === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['scheduled_start'],
          message: 'Scheduled start is required.',
        });
      }

      if (!data.duration || Number(data.duration) < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['duration'],
          message: 'Please select an auction duration.',
        });
      }
    }

    if (data.listing_type === 'bidding' && data.scheduled_start) {
      if (!data.start_date) {
        ctx.addIssue({
          code: 'custom',
          path: ['start_date'],
          message: 'Start date is required.',
        });
      } else {
        const startDateTime = new Date(data.start_date);
        const oneHourLater = new Date();
        oneHourLater.setHours(oneHourLater.getHours() + 1);

        if (startDateTime <= oneHourLater) {
          ctx.addIssue({
            code: 'custom',
            path: ['start_date'],
            message: 'Start date must be at least 1 hour in the future.',
          });
        }
      }
    }

    shippingMethods.forEach((method) => {
      if (method.id !== 'self_collect' && data[`shipping_${method.id}`]) {
        if (!data[`shipping_${method.id}_days`]) {
          ctx.addIssue({
            code: 'custom',
            path: [`shipping_${method.id}_days`],
            message: 'Days required when shipping is enabled.',
          });
        }
        if (
          !data[`shipping_${method.id}_fee`] ||
          data[`shipping_${method.id}_fee`] === ''
        ) {
          ctx.addIssue({
            code: 'custom',
            path: [`shipping_${method.id}_fee`],
            message: 'Fee required when shipping is enabled.',
          });
        }
      }
    });
  });

// Define the TypeScript type for PropSchema
export type PropSchema = z.infer<typeof propSchema>;
