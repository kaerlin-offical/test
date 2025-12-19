import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-display font-bold text-white mb-4">DXD4</h2>
            <p className="text-zinc-500 max-w-sm">
              The future of digital commerce. Premium assets, instant delivery, secure checkout.
              Powered by SellAuth.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-zinc-500 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="text-zinc-500 hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/contact" className="text-zinc-500 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">© 2024 DXD4. All rights reserved.</p>
          <div className="flex gap-4">
             {/* Social icons placeholder */}
             <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/5 hover:border-white/20 transition-colors cursor-pointer">X</div>
             <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/5 hover:border-white/20 transition-colors cursor-pointer">D</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
