"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
const bgImage = "/assets/generated_images/abstract_dark_blue_geometric_background_for_saas_login_page.png";
const safyroLogo = "/assets/safyro_logo_dark_notext_1764501336415.png";

// Schema
const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form data:", data);
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
          <img
            src={safyroLogo}
            alt="SAFYRO"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-white font-bold text-3xl tracking-tight">
          SAFYRO
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-white text-center">
              Create your account
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Get started with SAFYRO today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wider">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wider">
                        Email Address
                      </FormLabel>
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wider">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Create a password"
                            type={showPassword ? "text" : "password"}
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 pr-10 transition-all"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setPasswordStrength(
                                calculateStrength(e.target.value),
                              );
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <div className="space-y-2 mt-3">
                        <div className="flex h-1 w-full overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className={`h-full ${
                              passwordStrength <= 25
                                ? "bg-red-500"
                                : passwordStrength <= 50
                                  ? "bg-orange-500"
                                  : passwordStrength <= 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 flex justify-between">
                          <span>Strength</span>
                          <span
                            className={`${
                              passwordStrength <= 25
                                ? "text-red-400"
                                : passwordStrength <= 50
                                  ? "text-orange-400"
                                  : passwordStrength <= 75
                                    ? "text-yellow-400"
                                    : "text-green-400"
                            }`}
                          >
                            {passwordStrength <= 25
                              ? "Weak"
                              : passwordStrength <= 50
                                ? "Fair"
                                : passwordStrength <= 75
                                  ? "Good"
                                  : "Strong"}
                          </span>
                        </p>
                      </div>
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0A0F1C] px-2 text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-200"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="google"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                    >
                      <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                      ></path>
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-200"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="microsoft"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="currentColor"
                        d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"
                      ></path>
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/5 pt-6">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

