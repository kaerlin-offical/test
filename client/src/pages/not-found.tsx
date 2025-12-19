import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="glass-card p-12 rounded-2xl text-center max-w-md mx-4">
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="h-16 w-16 text-white/50" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-zinc-400 mb-8">
          The page you are looking for does not exist in this reality.
        </p>
        <Link href="/">
          <button className="futuristic-button w-full">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
