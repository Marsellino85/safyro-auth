"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
const bgImage = "/assets/generated_images/abstract_dark_blue_geometric_background_for_saas_login_page.png";
const safyroLogo = "/assets/safyro_logo_dark_notext_1764501336415.png";

// Schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form data:", data);
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0F1C] relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0F1C] to-[#0A0F1C] pointer-events-none" />
      <div 
        className="absolute inset-0 w-full h-full opacity-30 bg-cover bg-center mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Logo Top Left */}
      <div className="absolute top-8 left-8 flex items-center gap-4 z-50">
        <div className="w-[72px] h-[72px] flex items-center justify-center">
          <img src={safyroLogo} alt="SAFYRO" className="w-full h-full object-contain" />
        </div>
        <span className="text-white font-bold text-3xl tracking-tight">SAFYRO</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-white text-center">Reset Password</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-lg">Check your email</h3>
                  <p className="text-slate-400 text-sm">
                    We've sent a password reset link to<br/>
                    <span className="text-white font-medium">{form.getValues("email")}</span>
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full border-white/10 text-white hover:bg-white/5 hover:text-white"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try another email
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wider">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="name@company.com" 
                            type="email"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 transition-all"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/5 pt-6">
            <Link href="/auth/login" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 text-sm">
              <ArrowLeft size={16} />
              Back to Sign in
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

