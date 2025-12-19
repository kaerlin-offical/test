import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll keep a local table for contact messages or something simple
// since the main data comes from SellAuth API.
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

// === SELLAUTH TYPES (External API) ===

export const sellAuthProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  path: z.string(), // slug
  description: z.string().nullable().optional(),
  price: z.string().or(z.number()), // SellAuth might return string or number
  currency: z.string().optional(),
  image: z.string().nullable().optional(), // Direct image URL
  stock_count: z.number().optional(),
  group: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable().optional(), // Product group/category
});

export type SellAuthProduct = z.infer<typeof sellAuthProductSchema>;

export const sellAuthReviewSchema = z.object({
  id: z.number(),
  rating: z.number(),
  comment: z.string().nullable(),
  created_at: z.string(),
  // Add other fields as needed
});

export type SellAuthReview = z.infer<typeof sellAuthReviewSchema>;

// Checkout Request
export const checkoutItemSchema = z.object({
  productId: z.number(),
  variantId: z.number().optional(),
  quantity: z.number().min(1),
});

export const createCheckoutSchema = z.object({
  cart: z.array(checkoutItemSchema),
  email: z.string().email(),
  gateway: z.string().default("STRIPE"), // Default gateway
  // Add optional fields
});

export type CreateCheckoutRequest = z.infer<typeof createCheckoutSchema>;

// Response for checkout might be a URL or object
export const checkoutResponseSchema = z.object({
  url: z.string().optional(), // redirect url
  invoiceId: z.string().or(z.number()).optional(),
  invoice_url: z.string().optional(),
  success: z.boolean().optional(),
});

// Customer/Auth schemas
export const customerSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  discord_id: z.string().nullable().optional(),
  discord_username: z.string().nullable().optional(),
  balance: z.number().optional(),
  total_completed: z.number().optional(),
  total_spent_usd: z.number().optional(),
  last_completed_at: z.string().nullable().optional(),
  newsletter_at: z.string().nullable().optional(),
});

export type Customer = z.infer<typeof customerSchema>;

// Invoice schema
export const invoiceSchema = z.object({
  id: z.number(),
  status: z.string(),
  email: z.string().email(),
  total: z.number(),
  currency: z.string(),
  created_at: z.string(),
  completed_at: z.string().nullable().optional(),
  products: z.array(z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
  })).optional(),
});

export type Invoice = z.infer<typeof invoiceSchema>;

// Auth request schemas
export const loginSchema = z.object({
  email: z.string().email(),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;
