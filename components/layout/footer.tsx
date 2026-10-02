import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { mainMenu } from "@/lib/navigation";
import logo from "@/public/logo.png";
import { SocialIcons } from "@/components/layout/social-icons";

function FooterTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 border-b border-white/15 pb-3 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-white">
      {children}
    </h2>
  );
}

const linkClass = "text-white/70 hover:text-accent hover:pl-1 transition-all";

/** Dark footer with widget columns and a copyright bar (phones get only the bar; links live in the More sheet). */
export function Footer() {
  const music = mainMenu.find((item) => item.href === "/music")?.children ?? [];

  return (
    <footer className="bg-topbar text-sm text-white/70">
      <div className="hidden gap-10 px-6 py-12 md:grid md:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div>
          <Link href="/" className="mb-4 block w-fit">
            <Image src={logo} alt={`${siteConfig.name} home`} width={146} height={36} className="h-9 w-auto" />
          </Link>
          <p className="leading-relaxed">
            Discover music, read stories, explore artists.
          </p>
          <SocialIcons className="mt-5 gap-4 text-white/80" iconClassName="h-4 w-4" />
        </div>

        {/* Music */}
        <nav aria-label="Music">
          <FooterTitle>Music</FooterTitle>
          <ul className="space-y-2.5">
            {music.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Explore */}
        <nav aria-label="Explore">
          <FooterTitle>Explore</FooterTitle>
          <ul className="space-y-2.5">
            <li><Link href="/blog" className={linkClass}>Explore</Link></li>
            <li><Link href="/upload" className={linkClass}>Upload Your Content</Link></li>
            <li><Link href="/login" className={linkClass}>Login to account</Link></li>
            <li><Link href="/feed.xml" className={linkClass}>RSS Feed</Link></li>
          </ul>
        </nav>

        {/* Legal */}
        <nav aria-label="Legal">
          <FooterTitle>Legal</FooterTitle>
          <ul className="space-y-2.5">
            <li><Link href="/privacy" className={linkClass}>Privacy</Link></li>
            <li><Link href="/terms" className={linkClass}>Terms</Link></li>
            <li><Link href="/contact" className={linkClass}>Contact</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10 bg-black px-6 py-4 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
