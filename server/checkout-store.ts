import { supabase } from "./supabase";
import { type CreateCheckoutRequest } from "@shared/schema";

interface CheckoutSession {
  id?: number;
  email: string;
  cart: any[];
  payment_gateway: string;
  total_amount: string;
  currency: string;
  status: string;
  sellauth_invoice_id?: string;
  sellauth_checkout_url?: string;
  paypal_payment_id?: string;
  paypal_approval_url?: string;
  created_at?: string;
  updated_at?: string;
}

export async function createCheckoutSession(
  data: CreateCheckoutRequest,
  sellauthResponse: any
): Promise<CheckoutSession> {
  if (!supabase) {
    console.log("[Checkout] No Supabase - skipping session storage");
    return {
      email: data.email,
      cart: data.cart,
      payment_gateway: data.gateway || "STRIPE",
      total_amount: sellauthResponse.total || "0.00",
      currency: sellauthResponse.currency || "USD",
      status: "pending",
      sellauth_invoice_id: sellauthResponse.invoice_id,
      sellauth_checkout_url: sellauthResponse.url,
    };
  }

  const session: Partial<CheckoutSession> = {
    email: data.email,
    cart: data.cart,
    payment_gateway: data.gateway || "STRIPE",
    total_amount: sellauthResponse.total || "0.00",
    currency: sellauthResponse.currency || "USD",
    status: "pending",
    sellauth_invoice_id: sellauthResponse.invoice_id,
    sellauth_checkout_url: sellauthResponse.url,
  };

  const { data: result, error } = await supabase
    .from("checkout_sessions")
    .insert(session)
    .select()
    .single();

  if (error || !result) {
    console.error("[Checkout] Failed to create session in Supabase", error);
    throw new Error("Failed to create checkout session");
  }

  console.log("[Checkout] Session created in Supabase:", result.id);
  return result;
}

export async function updateCheckoutSession(
  invoiceId: string,
  updates: Partial<CheckoutSession>
): Promise<void> {
  if (!supabase) {
    console.log("[Checkout] No Supabase - skipping session update");
    return;
  }

  const { error } = await supabase
    .from("checkout_sessions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("sellauth_invoice_id", invoiceId);

  if (error) {
    console.error("[Checkout] Failed to update session in Supabase", error);
  }
}

export async function getCheckoutSessions(email: string): Promise<CheckoutSession[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("checkout_sessions")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Checkout] Failed to fetch sessions from Supabase", error);
    return [];
  }

  return data || [];
}

export async function createOrder(sellauthInvoice: any): Promise<void> {
  if (!supabase) {
    console.log("[Order] No Supabase - skipping order storage");
    return;
  }

  const order = {
    sellauth_invoice_id: sellauthInvoice.id?.toString(),
    customer_email: sellauthInvoice.email,
    customer_id: sellauthInvoice.customer_id,
    cart: sellauthInvoice.products || sellauthInvoice.cart,
    total_amount: sellauthInvoice.total,
    currency: sellauthInvoice.currency || "USD",
    status: sellauthInvoice.status || "pending",
    payment_gateway: sellauthInvoice.payment_gateway || "STRIPE",
    paid_at: sellauthInvoice.paid_at || sellauthInvoice.created_at,
  };

  const { error } = await supabase
    .from("orders")
    .upsert(order, { onConflict: "sellauth_invoice_id" });

  if (error) {
    console.error("[Order] Failed to create order in Supabase", error);
  }
}

export async function getCustomerOrders(email: string): Promise<any[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Order] Failed to fetch orders from Supabase", error);
    return [];
  }

  return data || [];
}
