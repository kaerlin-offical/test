import { supabase } from "./supabase";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Simple email service using Supabase Edge Functions or external service
// For now, we'll simulate email sending with console logs
// In production, you'd integrate with a real email service like Resend, SendGrid, or Supabase Auth emails

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const subject = "Shop-Flow - Verification Code";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up for Shop-Flow. To complete your login, please use the verification code below:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #333;">${code}</span>
        </div>
        <p>This code will expire in 10 minutes for security reasons.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The Shop-Flow Team
        </p>
      </div>
    `;
    
    const text = `Shop-Flow - Verification Code\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.`;

    // For development, just log the email
    console.log(`[EMAIL] Verification email sent to ${email}`);
    console.log(`[EMAIL] Code: ${code}`);
    console.log(`[EMAIL] Subject: ${subject}`);
    
    // In production, you would use a real email service:
    // await resend.emails.send({ to: email, subject, html });
    // or use Supabase Edge Functions
    
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send verification email:", error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(email: string, orderDetails: any): Promise<boolean> {
  try {
    const subject = "Shop-Flow - Order Confirmation";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hi there,</p>
        <p>Thank you for your order! Your order has been successfully placed.</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderDetails.invoiceId}</p>
          <p><strong>Total:</strong> ${orderDetails.total} ${orderDetails.currency}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.gateway}</p>
        </div>
        <p>You'll receive another email when your order ships.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The Shop-Flow Team
        </p>
      </div>
    `;
    
    console.log(`[EMAIL] Order confirmation sent to ${email}`);
    console.log(`[EMAIL] Order ID: ${orderDetails.invoiceId}`);
    
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send order confirmation:", error);
    return false;
  }
}
