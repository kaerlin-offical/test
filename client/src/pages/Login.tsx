import { useState } from "react";
import { useLogin, useVerifyEmail } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: verify, isPending: isVerifying } = useVerifyEmail();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email },
      {
        onSuccess: (data) => {
          toast({
            title: "Verification code sent",
            description: data.message,
          });
          setStep("verify");
        },
        onError: (error) => {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(
      { email, code },
      {
        onSuccess: () => {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          setLocation("/dashboard");
        },
        onError: (error) => {
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              {step === "email" ? "Sign In" : "Verify Email"}
            </h1>
            <p className="text-zinc-400">
              {step === "email"
                ? "Enter your email to receive a verification code"
                : "Enter the 6-digit code sent to your email"}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full futuristic-button flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "SEND CODE"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="000000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying || code.length !== 6}
                className="w-full futuristic-button flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "VERIFY & LOGIN"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-zinc-500 hover:text-white transition-colors text-sm"
              >
                Use a different email
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-zinc-500">
            Don't have an account? Make a purchase to create one automatically.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
