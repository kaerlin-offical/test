# Quick Setup Guide

## ✅ All Fixed!

Your Shop-Flow application is now ready to run without a database.

## 🚀 Start the Application

```bash
npm install
npm run dev
```

The app will start on: **http://localhost:5000**

## ✨ What's Configured

- ✅ **SellAuth Shop ID**: 196453 (dxd4)
- ✅ **API Key**: Already configured
- ✅ **No Database Required**: Contacts won't be saved, but everything else works
- ✅ **Windows Compatible**: Fixed npm scripts with cross-env

## 🎯 Features Working

1. **Products** - Fetched from your SellAuth shop
2. **Shopping Cart** - Add products to cart
3. **Checkout** - Creates orders via SellAuth API
4. **Customer Login** - Email verification (code shown in console)
5. **Dashboard** - View order history after login

## 📝 Important Notes

### Verification Codes
When logging in, the 6-digit code will be printed in the console where you ran `npm run dev`. Look for:
```
[AUTH] Verification code for email@example.com: 123456
```

### Contact Form
Contact form submissions will be logged to console but not saved (no database).

### First Time Setup
1. Run `npm install` to install dependencies (including cross-env)
2. Run `npm run dev` to start the server
3. Open http://localhost:5000 in your browser

## 🛒 Test the Flow

1. Browse products at `/shop`
2. Add items to cart
3. Click checkout
4. Enter your email
5. Complete payment via SellAuth
6. Login at `/login` with your email
7. View orders at `/dashboard`

## 🔧 If You Get Errors

**"cross-env not found"**
```bash
npm install
```

**"Cannot find module"**
```bash
npm install
```

**Port already in use**
- Change PORT in `.env` file

## 📚 More Info

See `README_SELLAUTH.md` for detailed documentation.
