import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();
  const { items, toggleCart } = useCart();
  const { data: user } = useAuth();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="font-display text-3xl font-bold tracking-tighter hover:opacity-80 transition-opacity text-white">
            DXD4
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors duration-200",
                  location === link.href ? "text-white" : "text-zinc-500 hover:text-white"
                )}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            
            {user ? (
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  location === "/dashboard"
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-white border-white/10 hover:border-white/30"
                )}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">DASHBOARD</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                LOGIN
              </Link>
            )}
            
            <button 
              onClick={toggleCart}
              className="relative group p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleCart}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-black"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block text-lg font-medium",
                    location === link.href ? "text-white" : "text-zinc-500"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    "block text-lg font-medium",
                    location === "/dashboard" ? "text-white" : "text-zinc-500"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block text-lg font-medium text-white"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
