import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Shop() {
  const { data: products, isLoading, error } = useProducts();
  const [search, setSearch] = useState("");

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Group products by category
  const groupedProducts = filteredProducts?.reduce((groups, product) => {
    const groupName = product.group?.name || "Uncategorized";
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(product);
    return groups;
  }, {} as Record<string, typeof filteredProducts>);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-display font-bold text-white mb-4">Shop</h1>
            <p className="text-zinc-400 max-w-md">
              Browse our complete collection of premium digital assets. 
              Secure checkout provided by SellAuth.
            </p>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="relative w-full md:w-80"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
            <p className="text-zinc-500">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-red-500/20 bg-red-500/5 rounded-xl">
             <h3 className="text-red-500 font-bold mb-2">Error loading products</h3>
             <p className="text-zinc-400">Please try again later.</p>
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-zinc-500">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedProducts || {}).map(([groupName, items]) => (
              <motion.section
                key={groupName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-bold text-white">
                    {groupName}
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-white to-transparent mt-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {items?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
