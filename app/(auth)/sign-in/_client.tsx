// app/sign-in/SignInClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircleIcon, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api-client";
import { Alert, AlertTitle } from "@/components/ui/alert";

// Zod Schema for validation
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInClient() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: SignInFormData) => {
      // Replace with your actual login endpoint
      const res = await api.post("/account/login/", data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Redirect or store token here
      // router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      form.setError("root", {
        message:
          error.response?.data?.detail ||
          "Invalid credentials. Please try again.",
      });
    },
  });

  const onSubmit = (data: SignInFormData) => {
    loginMutation.mutate(data);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="w-full max-w-md">
      {/* Logo */}

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Login to your account
          </h2>

          {/* Server Error */}
          {form.formState.errors.root && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>{form.formState.errors.root.message}</AlertTitle>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
              {/* Email / Username */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Continue"}
              </Button>
            </form>
          </Form>

          {/* Social Login */}
          {/* <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12" disabled>
                  <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>

                <Button variant="outline" className="h-12" disabled>
                  <img src="/facebook-icon.png" alt="Facebook" className="w-5 h-5 mr-2" />
                  Continue with Facebook
                </Button>
              </div>
            </div> */}

          {/* Links */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Don’t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-red-600 hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
            <p className="mt-2">
              <Link
                href="/forgot-password"
                className="text-red-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
