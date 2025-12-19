import { Link } from "wouter";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Loader2, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  
  // Take first 3 products for featured section
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-9xl font-display font-bold text-white tracking-tighter mb-6">
              DXD4
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light tracking-wide">
              Futuristische Technologie für morgen.
              <br/>
              <span className="text-zinc-600 text-lg">Premium digital assets for the modern era.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <button className="futuristic-button">
                  SHOP ENTDECKEN
                </button>
              </Link>
              <Link href="/shop">
                <button className="px-6 py-3 rounded-none border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-300">
                  ALLE PRODUKTE
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="border-y border-white/5 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Instant Delivery</h3>
                <p className="text-sm text-zinc-500">Automated processing via SellAuth</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Secure Payments</h3>
                <p className="text-sm text-zinc-500">Encrypted transactions globally</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">24/7 Support</h3>
                <p className="text-sm text-zinc-500">Always here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-2">Selected Works</h2>
              <p className="text-zinc-500">Our most popular digital products.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-white hover:text-zinc-300 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 md:hidden text-center">
            <Link href="/shop" className="inline-flex items-center gap-2 text-white hover:text-zinc-300 transition-colors border-b border-white pb-1">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter / CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Ready to upgrade?</h2>
           <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
             Join thousands of satisfied customers using DXD4 products to enhance their digital workflow.
           </p>
           <Link href="/shop">
             <button className="bg-white text-black px-8 py-4 font-bold rounded hover:scale-105 transition-transform">
               START BROWSING
             </button>
           </Link>
        </div>
      </section>
    </div>
  );
}
