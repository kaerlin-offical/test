import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useCreateContact } from "@/hooks/use-contact";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Mail, MapPin, MessageSquare } from "lucide-react";

export default function Contact() {
  const { mutate, isPending } = useCreateContact();
  const { toast } = useToast();
  
  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertContact) => {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "We'll get back to you as soon as possible.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold text-white mb-6">Contact Us</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Have questions? Need support? Reach out to our team directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
          >
             <h2 className="text-2xl font-bold text-white mb-8">Get in Touch</h2>
             <div className="space-y-8">
                <div className="flex gap-6">
                   <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="text-white font-medium mb-1">Email</h3>
                      <p className="text-zinc-500">support@dxd4.shop</p>
                   </div>
                </div>
                
                <div className="flex gap-6">
                   <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                      <MessageSquare className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="text-white font-medium mb-1">Discord</h3>
                      <p className="text-zinc-500">Join our community server</p>
                   </div>
                </div>

                <div className="flex gap-6">
                   <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="text-white font-medium mb-1">Location</h3>
                      <p className="text-zinc-500">Digital World Wide</p>
                   </div>
                </div>
             </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-card p-8 rounded-2xl"
          >
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
                   <input 
                      {...form.register("name")}
                      className="w-full futuristic-input rounded-lg px-4 py-3"
                      placeholder="Your name"
                   />
                   {form.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                   )}
                </div>

                <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                   <input 
                      {...form.register("email")}
                      className="w-full futuristic-input rounded-lg px-4 py-3"
                      placeholder="your@email.com"
                   />
                   {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                   )}
                </div>

                <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                   <textarea 
                      {...form.register("message")}
                      rows={4}
                      className="w-full futuristic-input rounded-lg px-4 py-3 resize-none"
                      placeholder="How can we help?"
                   />
                   {form.formState.errors.message && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.message.message}</p>
                   )}
                </div>

                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full futuristic-button flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "SEND MESSAGE"}
                </button>
             </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
