// app/sign-up/SignUpClient.tsx
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
import { useRouter } from "next/navigation";
import { Alert, AlertTitle } from "@/components/ui/alert";

// Zod Schema
const signUpSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpClient() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      // Replace with your actual signup endpoint
      const res = await api.post("/account/register/", data);
      return res.data;
    },
    onSuccess: (res) => {
      console.log("Registration successful:", res);
      router.push("/verify?email=" + encodeURIComponent(res.data.email));
      // Redirect to sign-in or dashboard
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        error.response?.data?.username?.[0] ||
        "Something went wrong. Please try again.";
      form.setError("root", { message: msg });
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    registerMutation.mutate(data);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="w-full max-w-md">
      {/* Sign Up Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Create an account
          </h2>

          {/* Social Buttons */}
          {/* <div className="grid grid-cols-2 gap-4 mb-6">
              <Button variant="outline" className="h-12" disabled>
                <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button variant="outline" className="h-12" disabled>
                <img src="/facebook-icon.png" alt="Facebook" className="w-5 h-5 mr-2" />
                Continue with Facebook
              </Button>
            </div> */}

          {/* <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or</span>
              </div>
            </div> */}

          {/* Server Error */}
          {form.formState.errors.root && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>{form.formState.errors.root.message}</AlertTitle>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          placeholder="Create a password"
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

              {/* Terms */}
              <p className="text-xs text-gray-600 text-center">
                By clicking on sign up, you agree to iGospel music's{" "}
                <Link href="/terms" className="text-red-600 hover:underline">
                  Terms of Condition Of Use
                </Link>
                .<br />
                Learn about how iGospel music collects, uses, shares and
                protects your personal data{" "}
                <Link href="/privacy" className="text-red-600 hover:underline">
                  privacy policy
                </Link>
                .
              </p>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "Creating account..."
                  : "Continue"}
              </Button>
            </form>
          </Form>

          {/* Sign In Link */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-red-600 hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
