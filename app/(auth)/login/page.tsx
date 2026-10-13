import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import SignInClient from "./_client";

export const metadata = pageMetadata({
  title: "Log In",
  description: "Log in to your iGospel account to access gospel music, posts, playlists, and more.",
  path: "/login",
  noIndex: true,
});

export default function SignInPage() {
  // The form reads ?email= and ?verified= from the URL.
  return (
    <Suspense>
      <SignInClient />
    </Suspense>
  );
}
