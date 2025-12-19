import { useAuth, useInvoices, useLogout } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2, LogOut, ShoppingBag, User, DollarSign, Package } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useAuth();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { mutate: logout } = useLogout();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!userLoading && !user) {
      setLocation("/login");
    }
  }, [user, userLoading, setLocation]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        });
        setLocation("/");
      },
    });
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  const completedInvoices = invoices?.filter((inv) => inv.status === "completed") || [];
  const totalSpent = completedInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Dashboard</h1>
            <p className="text-zinc-400">Welcome back, {user.email}</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{user.total_completed || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-white">
                  ${(user.total_spent_usd || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Balance</p>
                <p className="text-2xl font-bold text-white">${(user.balance || 0).toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-white/10 rounded-xl p-8"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6">Order History</h2>

          {invoicesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : invoices && invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-zinc-900 border border-white/5 rounded-lg p-6 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Invoice #{invoice.id}</p>
                      <p className="text-sm text-zinc-500">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono font-bold">
                        ${invoice.total.toFixed(2)} {invoice.currency}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : invoice.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {invoice.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {invoice.products && invoice.products.length > 0 && (
                    <div className="border-t border-white/5 pt-4">
                      <p className="text-sm text-zinc-400 mb-2">Products:</p>
                      <div className="space-y-2">
                        {invoice.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-zinc-300">
                              {product.name} x{product.quantity}
                            </span>
                            <span className="text-zinc-500 font-mono">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No orders yet</p>
              <button
                onClick={() => setLocation("/shop")}
                className="mt-4 text-white hover:text-zinc-300 underline"
              >
                Start shopping
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
