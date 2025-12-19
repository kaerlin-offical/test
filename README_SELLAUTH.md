# SellAuth Integration Guide

This application is fully integrated with SellAuth for payment processing and customer management.

## Features

### ✅ Implemented Features

1. **Product Management**
   - Fetches products from SellAuth API
   - Displays product categories/groups
   - Shows product details with variants
   - Real-time stock information

2. **Authentication System**
   - Email-based login with verification codes
   - Session-based authentication
   - Customer dashboard
   - Automatic customer creation on first purchase

3. **Checkout & Payments**
   - Secure checkout via SellAuth
   - Multiple payment gateway support (Stripe, PayPal, etc.)
   - Guest and authenticated checkout
   - Automatic invoice creation

4. **Customer Dashboard**
   - View order history
   - Track invoice status
   - See total spent and order count
   - View account balance

## Setup Instructions

### 1. Get Your SellAuth Credentials

1. Log in to your [SellAuth Dashboard](https://sellauth.com)
2. Navigate to **Account > API**
3. Your credentials:
   - Shop ID: **196453** (dxd4)
   - API Key: Already configured in `.env.example`

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=your_database_url

# SellAuth Configuration
SELLAUTH_SHOP_ID=196453
SELLAUTH_API_KEY=your_api_key_from_sellauth_dashboard

# Session Secret (generate a random string)
SESSION_SECRET=your-random-secret-key-here

# Server
PORT=5000
NODE_ENV=production
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Database Migrations

```bash
npm run db:push
```

### 5. Start the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Authentication
- `POST /api/auth/login` - Send verification code to email
- `POST /api/auth/verify` - Verify code and login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Checkout
- `POST /api/checkout` - Create checkout session

### Invoices
- `GET /api/invoices` - List user's invoices (requires auth)
- `GET /api/invoices/:id` - Get invoice details (requires auth)

## How It Works

### Customer Flow

1. **Browse Products**: Users can browse products fetched from SellAuth
2. **Add to Cart**: Products are added to local cart storage
3. **Checkout**: 
   - Authenticated users: Email is auto-filled
   - Guest users: Must provide email
4. **Payment**: Redirected to SellAuth checkout page
5. **Confirmation**: After payment, customer is created in SellAuth
6. **Login**: Customers can login with email verification
7. **Dashboard**: View order history and account details

### Authentication Flow

1. User enters email on login page
2. Server generates 6-digit verification code
3. Code is logged to console (in production, send via email service)
4. User enters code to verify
5. Server checks if customer exists in SellAuth
6. Session is created for authenticated user

### Checkout Flow

1. User adds items to cart
2. Clicks checkout button
3. If not logged in, prompted for email
4. Server creates checkout session via SellAuth API
5. User is redirected to SellAuth payment page
6. After payment, SellAuth handles delivery and invoice creation

## Development Notes

### Mock Data
If `SELLAUTH_API_KEY` is not set, the app returns mock product data for development preview.

### Verification Codes
In development, verification codes are logged to the console. In production, integrate with an email service (SendGrid, AWS SES, etc.) to send codes via email.

### Session Storage
Currently uses in-memory session storage. For production with multiple servers, use a persistent session store like Redis or PostgreSQL.

## SellAuth API Documentation

Full API documentation: https://docs.sellauth.com/api-documentation

### Key Endpoints Used

- **GET /v1/shops/{shopId}/products** - Fetch products
- **GET /v1/shops/{shopId}/products/{productId}** - Get product details
- **POST /v1/shops/{shopId}/checkout** - Create checkout session
- **GET /v1/shops/{shopId}/customers** - List customers
- **GET /v1/shops/{shopId}/invoices** - List invoices

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Session Secret**: Use a strong, random secret in production
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Consider adding rate limiting to API endpoints

## Troubleshooting

### Products Not Loading
- Check `SELLAUTH_SHOP_ID` and `SELLAUTH_API_KEY` are correct
- Verify API key has proper permissions
- Check server logs for API errors

### Authentication Issues
- Ensure session middleware is configured
- Check verification code in server logs
- Verify customer exists in SellAuth after first purchase

### Checkout Fails
- Verify products have variants with prices
- Check payment gateways are enabled in SellAuth
- Ensure customer email is valid

## Support

For SellAuth-specific issues, contact: https://sellauth.com/support
For application issues, check the server logs and console errors.
