import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-bg flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3">
          <Link
            href="/"
            className="text-xl font-bold tracking-wider bg-black p-2 rounded-md"
          >
            <Image src={logo} alt="iGospel home" width={194} height={48} className="w-full h-12 object-contain" priority />
          </Link>
        </div>
      </div>
      <main className="contents">{children}</main>
      {/* Footer */}
      <div className="mt-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} iGospel Media Connect</p>
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
