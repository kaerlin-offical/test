import { useCart } from "@/hooks/use-cart";
import { useCreateCheckout } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, ShoppingBag, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "wouter";

export function Checkout() {
  const { items, clearCart } = useCart();
  const { mutate: createCheckout, isPending } = useCreateCheckout();
  const { data: user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const total = items.reduce((acc, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // If user is logged in, use their email
    if (user) {
      proceedToCheckout(user.email);
    } else {
      // Show email input for guest checkout
      setShowEmailInput(true);
    }
  };

  const proceedToCheckout = (checkoutEmail: string) => {
    if (!checkoutEmail || !checkoutEmail.includes('@')) {
      toast({ 
        title: "Invalid email", 
        description: "Please enter a valid email address",
        variant: "destructive" 
      });
      return;
    }

    createCheckout(
      {
        cart: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        email: checkoutEmail,
        gateway: "PAYPAL" // Only PayPal option
      },
      {
        onSuccess: (data) => {
          if (data.url) {
            window.location.href = data.url;
            clearCart();
          } else {
            toast({ title: "Order created", description: `Invoice ID: ${data.invoiceId}` });
          }
        },
        onError: (error) => {
          toast({ 
            title: "Checkout failed", 
            description: error.message, 
            variant: "destructive" 
          });
        }
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-zinc-400 mb-6">Add some products to continue</p>
            <Link href="/shop">
              <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-white/90 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/shop">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-zinc-400 text-sm">Quantity: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${(typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-zinc-800 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Input */}
          {!user && (
            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email for order confirmation</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-zinc-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="bg-zinc-800 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.8 4.2h-3.4l-2.1 11.6h3.4l2.1-11.6zm-7.6 0c-1.1 0-1.9.1-2.5.3-.6.2-1.1.6-1.5 1.1-.4.5-.7 1.1-.9 1.8-.2.7-.3 1.5-.3 2.4 0 .8.1 1.5.3 2.1.2.6.5 1.1.9 1.5.4.4.9.7 1.5.9.6.2 1.3.3 2.1.3.8 0 1.5-.1 2.1-.3.6-.2 1.1-.5 1.5-.9.4-.4.7-.9.9-1.5.2-.6.3-1.3.3-2.1 0-.9-.1-1.7-.3-2.4-.2-.7-.5-1.3-.9-1.8-.4-.5-.9-.9-1.5-1.1-.6-.2-1.3-.3-2.1-.3zm.9 7.3c-.1.4-.3.7-.5 1-.2.3-.5.5-.8.6-.3.1-.7.2-1.1.2-.4 0-.7-.1-1-.2-.3-.1-.5-.3-.7-.6-.2-.3-.3-.6-.4-1-.1-.4-.1-.8-.1-1.3 0-.5 0-.9.1-1.3.1-.4.2-.7.4-1 .2-.3.4-.5.7-.6.3-.1.6-.2 1-.2.4 0 .8.1 1.1.2.3.1.6.3.8.6.2.3.4.6.5 1 .1.4.1.8.1 1.3 0 .5 0 .9-.1 1.3zm12.9-7.3h-3.4l-2.1 11.6h3.4l2.1-11.6z" fill="white"/>
                    <path d="M35.2 4.2h-3.4l-2.1 11.6h3.4l2.1-11.6z" fill="white"/>
                    <path d="M42.8 4.2h-3.4l-2.1 11.6h3.4l2.1-11.6z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">PayPal</div>
                  <div className="text-zinc-400 text-sm">Pay securely with PayPal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isPending || (!user && !email)}
            className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.8 4.2h-3.4l-2.1 11.6h3.4l2.1-11.6zm-7.6 0c-1.1 0-1.9.1-2.5.3-.6.2-1.1.6-1.5 1.1-.4.5-.7 1.1-.9 1.8-.2.7-.3 1.5-.3 2.4 0 .8.1 1.5.3 2.1.2.6.5 1.1.9 1.5.4.4.9.7 1.5.9.6.2 1.3.3 2.1.3.8 0 1.5-.1 2.1-.3.6-.2 1.1-.5 1.5-.9.4-.4.7-.9.9-1.5.2-.6.3-1.3.3-2.1 0-.9-.1-1.7-.3-2.4-.2-.7-.5-1.3-.9-1.8-.4-.5-.9-.9-1.5-1.1-.6-.2-1.3-.3-2.1-.3zm.9 7.3c-.1.4-.3.7-.5 1-.2.3-.5.5-.8.6-.3.1-.7.2-1.1.2-.4 0-.7-.1-1-.2-.3-.1-.5-.3-.7-.6-.2-.3-.3-.6-.4-1-.1-.4-.1-.8-.1-1.3 0-.5 0-.9.1-1.3.1-.4.2-.7.4-1 .2-.3.4-.5.7-.6.3-.1.6-.2 1-.2.4 0 .8.1 1.1.2.3.1.6.3.8.6.2.3.4.6.5 1 .1.4.1.8.1 1.3 0 .5 0 .9-.1 1.3zm12.9-7.3h-3.4l-2.1 11.6h3.4l2.1-11.6z" fill="white"/>
                  <path d="M35.2 4.2h-3.4l-2.1 11.6h3.4l2.1-11.6z" fill="white"/>
                  <path d="M42.8 4.2h-3.4l-2.1 11.6h3.4l2.1-11.6z" fill="white"/>
                </svg>
                Pay with PayPal
              </>
            )}
          </button>

          {/* Terms */}
          <div className="text-center text-zinc-400 text-sm mt-6">
            By completing this order, you agree to our terms of service and privacy policy.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
