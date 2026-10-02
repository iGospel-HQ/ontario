import { pageMetadata } from "@/lib/seo";
import SignUpClient from "./_client";
export const metadata = pageMetadata({
  title: "Sign Up",
  description:
    "Create an account on iGospel to access exclusive gospel music, posts, and community features.",
  path: "/signup",
  noIndex: true,
});

export default function SignUpPage() {
  return <SignUpClient />;
}