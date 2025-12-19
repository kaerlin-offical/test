import { z } from 'zod';
import { insertContactSchema, contacts, sellAuthProductSchema, createCheckoutSchema, checkoutResponseSchema, customerSchema, invoiceSchema, loginSchema, verifyEmailSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(sellAuthProductSchema),
        500: errorSchemas.internal,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: sellAuthProductSchema,
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    },
  },
  checkout: {
    create: {
      method: 'POST' as const,
      path: '/api/checkout',
      input: createCheckoutSchema,
      responses: {
        200: checkoutResponseSchema,
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contacts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginSchema,
      responses: {
        200: z.object({ message: z.string(), emailSent: z.boolean() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    verify: {
      method: 'POST' as const,
      path: '/api/auth/verify',
      input: verifyEmailSchema,
      responses: {
        200: z.object({ customer: customerSchema, token: z.string() }),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
        500: errorSchemas.internal,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: customerSchema,
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  invoices: {
    list: {
      method: 'GET' as const,
      path: '/api/invoices',
      responses: {
        200: z.array(invoiceSchema),
        401: z.object({ message: z.string() }),
        500: errorSchemas.internal,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/invoices/:id',
      responses: {
        200: invoiceSchema,
        401: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type SellAuthProduct = z.infer<typeof sellAuthProductSchema>;
