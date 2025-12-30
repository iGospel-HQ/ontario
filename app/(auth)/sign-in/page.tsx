// app/sign-in/page.tsx
import { Metadata } from "next";
import SignInClient from "./_client";

export const metadata: Metadata = {
  title: "Sign In - iGospel",
  description: "Login to your iGospel account to access gospel music, posts, playlists, and more.",
  openGraph: {
    title: "Sign In to iGospel",
    description: "Access your account for exclusive gospel content and community.",
//     images: ["/og-image.jpg"], // Replace with your actual OG image
  },
};

export default function SignInPage() {
  return <SignInClient />;
}