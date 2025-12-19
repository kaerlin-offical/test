import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { Loader2, ArrowLeft, Check, Shield, Zap } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product) return;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl text-white font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-zinc-400 hover:text-white underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative border border-white/5"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-black/20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl font-display font-bold text-white/5">DXD4</span>
             </div>
             {/* If we had real images, they would go here */}
          </motion.div>

          {/* Info Section */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex flex-col justify-center"
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{product.name}</h1>
              <div className="inline-block bg-white/10 px-4 py-2 rounded-full border border-white/5">
                <span className="text-2xl font-mono text-white font-bold">
                  {typeof product.price === 'string' ? `$${product.price}` : `$${product.price.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="prose prose-invert prose-lg text-zinc-400 mb-12">
              <p>{product.description || "No description available."}</p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <span>Instant automated delivery</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
                   <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <span>Premium quality guarantee</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 futuristic-button"
              >
                ADD TO CART
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
