import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import {
  saveVerificationCode,
  fetchVerificationCode,
  deleteVerificationCode,
  isCodeExpired,
} from "./verification-store";
import {
  createCheckoutSession,
  updateCheckoutSession,
  getCheckoutSessions,
  createOrder,
  getCustomerOrders,
} from "./checkout-store";
import { sendVerificationEmail } from "./email-service";

const SELLAUTH_API_URL = "https://api.sellauth.com/v1";

// Helper to fetch from SellAuth
async function fetchSellAuth(endpoint: string, options: RequestInit = {}) {
  const shopId = process.env.SELLAUTH_SHOP_ID;
  const apiKey = process.env.SELLAUTH_API_KEY;

  if (!shopId || !apiKey) {
    throw new Error("Missing SELLAUTH_SHOP_ID or SELLAUTH_API_KEY environment variables");
  }

  const url = `${SELLAUTH_API_URL}/shops/${shopId}${endpoint}`;
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SellAuth API Error [${response.status}]: ${errorText}`);
    throw new Error(`SellAuth API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.customerId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Products List
  app.get(api.products.list.path, async (req, res) => {
    try {
      const data = await fetchSellAuth("/products");
      const products = data.data || data;
      
      // Transform SellAuth products to simpler format for frontend
      const transformed = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        path: p.path,
        price: p.variants?.[0]?.price || "0.00",
        currency: p.currency || "USD",
        description: p.description || "",
        image: p.images?.[0]?.url || null,
        stock_count: p.stock_count,
        group: p.group ? { id: p.group.id, name: p.group.name } : null,
      }));
      
      res.json(transformed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Product Details
  app.get(api.products.get.path, async (req, res) => {
    try {
      const product = await fetchSellAuth(`/products/${req.params.id}`);
      
      // Transform SellAuth product to simpler format
      const transformed = {
        id: product.id,
        name: product.name,
        path: product.path,
        price: product.variants?.[0]?.price || "0.00",
        currency: product.currency || "USD",
        description: product.description || "",
        image: product.images?.[0]?.url || null,
        stock_count: product.stock_count,
        group: product.group ? { id: product.group.id, name: product.group.name } : null,
        variants: product.variants,
      };
      
      res.json(transformed);
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: "Product not found" });
    }
  });

  // Checkout - Create order from cart
  app.post(api.checkout.create.path, async (req, res) => {
    try {
      const input = api.checkout.create.input.parse(req.body);
      
      // Fetch product details to get variant IDs
      const cartItems = await Promise.all(
        input.cart.map(async (item: any) => {
          const product = await fetchSellAuth(`/products/${item.productId}`);
          const variantId = item.variantId || product.variants?.[0]?.id;
          
          if (!variantId) {
            throw new Error(`No variant found for product ${item.productId}`);
          }
          
          return {
            productId: item.productId,
            variantId: variantId,
            quantity: item.quantity,
          };
        })
      );

      let checkoutData;
      let checkoutUrl;
      let invoiceId;

      if (input.gateway === "PAYPAL") {
        // PayPal checkout - create redirect URL to PayPal
        // Fetch product details to get prices
        const cartWithPrices = await Promise.all(
          cartItems.map(async (item: any) => {
            const product = await fetchSellAuth(`/products/${item.productId}`);
            const price = parseFloat(product.price || "0");
            return {
              ...item,
              price: price,
              subtotal: price * item.quantity
            };
          })
        );
        
        const total = cartWithPrices.reduce((sum: number, item: any) => {
          return sum + item.subtotal;
        }, 0);

        // Create PayPal payment URL (simplified - in production you'd use PayPal API)
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=kaerlin.offical@gmail.com&item_name=Shop-Flow Purchase&amount=${total.toFixed(2)}&currency_code=EUR&return=http://localhost:5000/checkout/success&cancel_return=http://localhost:5000/checkout/cancel`;

        checkoutUrl = paypalUrl;
        invoiceId = `paypal-${Date.now()}`;

        // Store in Supabase
        const session = await createCheckoutSession(input, {
          url: paypalUrl,
          invoice_id: invoiceId,
          total: total.toFixed(2),
          currency: "EUR",
        });

        res.json({
          url: paypalUrl,
          invoiceId: invoiceId,
          message: "Redirecting to PayPal...",
          gateway: "PAYPAL"
        });
      } else {
        // SellAuth checkout (STRIPE, etc.)
        checkoutData = await fetchSellAuth("/checkout", {
          method: "POST",
          body: JSON.stringify({
            email: input.email,
            cart: cartItems,
            gateway: input.gateway || "STRIPE",
          }),
        });

        checkoutUrl = checkoutData.checkout_url || checkoutData.url;
        invoiceId = checkoutData.invoice_id || checkoutData.id;

        // Store in Supabase
        const session = await createCheckoutSession(input, checkoutData);

        res.json({
          url: checkoutUrl,
          invoiceId: invoiceId,
          message: "Checkout session created successfully"
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.'),
        });
      }
      console.error("Checkout error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Contact Form
  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const contact = await storage.createContact(input);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth: Login (send verification email)
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in session (fallback)
      req.session.pendingEmail = input.email;
      req.session.verificationCode = verificationCode;
      
      // Try to store in Supabase
      const saved = await saveVerificationCode(input.email, verificationCode);
      
      // Send verification email
      const emailSent = await sendVerificationEmail(input.email, verificationCode);
      
      if (saved) {
        console.log("[Auth] Verification code stored in Supabase for:", input.email);
      } else {
        console.log("[Auth] Verification code stored in session for:", input.email);
      }
      
      if (emailSent) {
        console.log("[Auth] Verification email sent to:", input.email);
      } else {
        console.log("[Auth] Failed to send verification email to:", input.email);
      }
      
      res.json({ message: "Verification code sent", emailSent: emailSent });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });

  // Auth: Verify email code
  app.post(api.auth.verify.path, async (req, res) => {
    try {
      const input = api.auth.verify.input.parse(req.body);
      
      const record = await fetchVerificationCode(input.email);

      if (record) {
        if (isCodeExpired(record)) {
          await deleteVerificationCode(input.email);
          return res.status(401).json({ message: "Verification code expired" });
        }

        if (record.code !== input.code) {
          return res.status(401).json({ message: "Invalid verification code" });
        }
      } else {
        if (!req.session.pendingEmail || !req.session.verificationCode) {
          return res.status(401).json({ message: "No pending verification" });
        }

        if (req.session.pendingEmail !== input.email) {
          return res.status(401).json({ message: "Email mismatch" });
        }

        if (req.session.verificationCode !== input.code) {
          return res.status(401).json({ message: "Invalid verification code" });
        }
      }
      
      try {
        const customersData = await fetchSellAuth("/customers", {
          method: "GET",
        });
        
        const customers = customersData.data || customersData;
        const customer = customers.find((c: any) => c.email === input.email);
        
        if (!customer) {
          return res.status(401).json({ 
            message: "No customer found. Please make a purchase first." 
          });
        }
        
        // Set session
        req.session.customerId = customer.id;
        req.session.customerEmail = customer.email;

        delete req.session.pendingEmail;
        delete req.session.verificationCode;

        if (record) {
          await deleteVerificationCode(input.email);
        }

        res.json({
          customer,
          token: "session-based",
          persistence: record ? "supabase" : "session",
        });
      } catch (error) {
        console.error("Failed to fetch customer:", error);
        return res.status(500).json({ message: "Failed to verify customer" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Verification failed" });
    }
  });

  // Auth: Get current user
  app.get(api.auth.me.path, requireAuth, async (req, res) => {
    try {
      const customersData = await fetchSellAuth("/customers");
      const customers = customersData.data || customersData;
      const customer = customers.find((c: any) => c.id === req.session.customerId);
      
      if (!customer) {
        return res.status(401).json({ message: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      console.error("Failed to fetch customer:", error);
      res.status(500).json({ message: "Failed to fetch customer data" });
    }
  });

  // Auth: Logout
  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Invoices: List user's invoices
  app.get(api.invoices.list.path, requireAuth, async (req, res) => {
    try {
      const invoicesData = await fetchSellAuth("/invoices");
      const allInvoices = invoicesData.data || invoicesData;
      
      // Filter invoices by customer email
      const customerInvoices = allInvoices.filter(
        (inv: any) => inv.email === req.session.customerEmail
      );
      
      res.json(customerInvoices);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Invoices: Get specific invoice
  app.get(api.invoices.get.path, requireAuth, async (req, res) => {
    try {
      const invoice = await fetchSellAuth(`/invoices/${req.params.id}`);
      
      // Verify the invoice belongs to the logged-in customer
      if (invoice.email !== req.session.customerEmail) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.json(invoice);
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
      res.status(404).json({ message: "Invoice not found" });
    }
  });

  return httpServer;
}
