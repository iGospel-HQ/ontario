import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundImage: "url(/bg-back.jpg)",
        backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
      className="flex min-h-screen flex-col items-center justify-center p-4"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3">
          <Link
            href="/"
            className="text-xl font-bold tracking-wider bg-black p-2 rounded-md"
          >
            <img src="/logo.png" alt="logo" className="w-full h-12" />
          </Link>
        </div>
        {/* <p className="text-gray-600 mt-2 text-lg">Welcome back</p> */}
      </div>
      {children}
      {/* Footer */}
      <div className="mt-10 text-center text-sm text-gray-500">
        <p>© 2025 iGospel Media Connect</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-red-600">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-red-600">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-red-600">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
