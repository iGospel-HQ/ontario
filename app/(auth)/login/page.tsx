import { pageMetadata } from "@/lib/seo";
import SignInClient from "./_client";

export const metadata = pageMetadata({
  title: "Sign In",
  description:
    "Login to your iGospel account to access gospel music, posts, playlists, and more.",
  path: "/login",
  noIndex: true,
});

export default function SignInPage() {
  return <SignInClient />;
}