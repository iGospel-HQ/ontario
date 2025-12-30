// app/sign-up/page.tsx
import { Metadata } from "next";
import SignUpClient from "./_client";
export const metadata: Metadata = {
  title: "Sign Up - iGospel",
  description: "Create an account on iGospel to access exclusive gospel music, posts, and community features.",
  openGraph: {
    title: "Sign Up to iGospel",
    description: "Join the iGospel community for uplifting gospel content.",
//     images: ["/og-image.jpg"],
  },
};

export default function SignUpPage() {
  return <SignUpClient />;
}