import { useCart } from "@/hooks/use-cart";
import { useCreateCheckout } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Loader2, CreditCard, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, clearCart } = useCart();
  const { mutate: createCheckout, isPending } = useCreateCheckout();
  const { data: user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const total = items.reduce((acc, item) => {
    // Ensure price is treated as a number
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    
    // Redirect to checkout page
    window.location.href = "/checkout";
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
        gateway: "PAYPAL"
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-display font-bold text-white">YOUR CART</h2>
              <button onClick={toggleCart} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
                  <CreditCard className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                    {/* Placeholder for image since SellAuth might not send one directly here easily without fetching */}
                    <div className="w-16 h-16 bg-zinc-800 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-zinc-500">IMG</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-white">${Number(item.price).toFixed(2)}</p>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-red-500 hover:text-red-400 mt-2 flex items-center gap-1 justify-end"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-2xl font-mono font-bold text-white">${total.toFixed(2)}</span>
                </div>
                
                {showEmailInput && !user ? (
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Email for order confirmation</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              proceedToCheckout(email);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowEmailInput(false)}
                        className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => proceedToCheckout(email)}
                        disabled={!email || isPending}
                        className="flex-1 px-4 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                            Processing...
                          </>
                        ) : (
                          "Proceed"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleCheckoutClick}
                      disabled={isPending}
                      className="w-full bg-white text-black font-semibold py-4 px-6 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Proceed to Checkout
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
