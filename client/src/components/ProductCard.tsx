import { SellAuthProduct } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: SellAuthProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass-card rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-white/20"
      >
        <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden group-hover:bg-zinc-700/50 transition-colors">
          {/* Product Image */}
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          
          {/* Placeholder if no image or image fails */}
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-display font-bold text-2xl tracking-widest opacity-20 group-hover:opacity-30 transition-opacity">
            DXD4
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
             <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                <span className="text-white font-mono font-bold text-sm">
                  {typeof product.price === 'string' ? `$${product.price}` : `$${product.price.toFixed(2)}`}
                </span>
             </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-display font-bold text-white mb-2 leading-tight group-hover:text-zinc-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-zinc-400 text-sm line-clamp-2 mb-6 flex-1">
            {product.description || "Premium digital product available for instant delivery."}
          </p>
          
          <button
            onClick={handleAddToCart}
            className="w-full mt-auto py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm group-hover/btn:scale-105"
          >
            <ShoppingCart className="w-4 h-4" />
            ADD TO CART
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
