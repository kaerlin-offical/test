# Supabase Integration Guide

This guide explains the Supabase integration in Shop-Flow and how to set it up.

## Overview

Shop-Flow uses Supabase as an optional database backend for:
- Contact form submissions
- Authentication verification codes
- Checkout session persistence
- Order history tracking
- Customer session management

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create a new project
5. Choose a database password and region
6. Wait for the project to be created

### 2. Get Your Credentials

From your Supabase project dashboard:
- Go to Settings → API
- Copy the **Project URL** (this is your `SUPABASE_URL`)
- Copy the **anon public** key (this is your `SUPABASE_ANON_KEY`)

### 3. Update Environment Variables

Add these to your `.env` file:

```env
# Supabase Configuration (Optional)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the SQL Schema

1. Open the Supabase SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the script

This will create all necessary tables with proper security policies.

## Tables Created

### 1. `contacts`
Stores contact form submissions:
- `id` - Primary key
- `name` - Contact name
- `email` - Contact email  
- `message` - Message content
- `created_at` - Timestamp

### 2. `auth_verifications`
Stores email verification codes:
- `email` - Primary key (email address)
- `code` - Verification code
- `expires_at` - Code expiry time
- `created_at` - Timestamp

### 3. `checkout_sessions`
Stores checkout session data:
- `id` - Primary key
- `email` - Customer email
- `cart` - Cart items (JSON)
- `payment_gateway` - Payment method used
- `total_amount` - Order total
- `currency` - Currency code
- `status` - Session status
- `sellauth_invoice_id` - SellAuth invoice ID
- `sellauth_checkout_url` - Checkout URL
- `paypal_payment_id` - PayPal payment ID
- `paypal_approval_url` - PayPal approval URL
- `created_at`, `updated_at` - Timestamps

### 4. `orders`
Stores completed orders:
- `id` - Primary key
- `sellauth_invoice_id` - Unique invoice ID
- `customer_email` - Customer email
- `customer_id` - SellAuth customer ID
- `cart` - Order items (JSON)
- `total_amount` - Order total
- `currency` - Currency code
- `status` - Order status
- `payment_gateway` - Payment method
- `paid_at` - Payment timestamp
- `created_at`, `updated_at` - Timestamps

### 5. `customer_sessions`
Tracks active user sessions:
- `id` - Primary key
- `session_id` - Session identifier
- `customer_id` - Customer ID
- `customer_email` - Customer email
- `ip_address` - User IP
- `user_agent` - Browser info
- `expires_at` - Session expiry
- `created_at` - Timestamp

### 6. `payment_methods`
Configures payment gateways:
- `id` - Primary key
- `gateway` - Gateway name (STRIPE, PAYPAL, etc.)
- `is_active` - Whether gateway is enabled
- `config` - Gateway configuration (JSON)
- `created_at`, `updated_at` - Timestamps

### 7. `product_cache`
Caches product data for performance:
- `id` - Product ID (primary key)
- `name` - Product name
- `path` - Product path
- `price` - Product price
- `currency` - Currency
- `description` - Product description
- `image_url` - Product image
- `stock_count` - Stock quantity
- `group_id` - Product group ID
- `group_name` - Product group name
- `variants` - Product variants (JSON)
- `created_at`, `updated_at` - Timestamps

## Security Policies

Row Level Security (RLS) is enabled with these policies:

- **Contacts**: Anyone can insert, authenticated users can read
- **Auth Verifications**: Users can only manage their own email
- **Checkout Sessions**: Users can only see their own sessions
- **Orders**: Users can only see their own orders
- **Customer Sessions**: Service role only
- **Payment Methods**: Read-only for everyone
- **Product Cache**: Read-only for everyone

## Features

### Contact Form Persistence
When Supabase is configured, contact form submissions are stored in the `contacts` table. Without Supabase, submissions are logged to console.

### Authentication Verification
Login verification codes are stored in Supabase with automatic expiry. Codes older than 10 minutes are automatically rejected.

### Checkout Persistence
All checkout sessions are persisted in Supabase, including:
- Cart contents
- Payment method
- Customer email
- Status tracking
- Integration with both SellAuth and PayPal

### Order History
Completed orders from SellAuth are synchronized to Supabase for customer order history.

## Fallback Behavior

If Supabase is not configured (missing URL or key):
- Contact forms log to console
- Verification codes stored in session only
- Checkout sessions not persisted
- Order history fetched directly from SellAuth API

## Testing

To test the integration:

1. Set up Supabase and run the SQL schema
2. Configure environment variables
3. Start the application
4. Submit a contact form - check Supabase `contacts` table
5. Login with email - check `auth_verifications` table
6. Create a checkout - check `checkout_sessions` table

## Troubleshooting

### Common Issues

1. **"No Supabase - skipping" messages**
   - Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
   - Verify the URL format: `https://project-id.supabase.co`

2. **Permission denied errors**
   - Ensure the SQL schema was run completely
   - Check RLS policies in Supabase dashboard

3. **Verification codes not working**
   - Check `auth_verifications` table for code storage
   - Verify `expires_at` is in the future

4. **Checkout sessions not saving**
   - Check `checkout_sessions` table
   - Verify Supabase connection in server logs

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=shop-flow:*
```

This will show detailed Supabase operation logs.
