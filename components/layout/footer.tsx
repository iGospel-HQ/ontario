import Link from "next/link";
import Image from "next/image";
import { Mail, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/site";
import logo from "@/public/logo.png";

const social = [
  { name: "iGospel on X (Twitter)", href: siteConfig.social.twitter, icon: Twitter },
  { name: "iGospel on Instagram", href: "#", icon: Instagram },
  { name: "iGospel on Facebook", href: siteConfig.social.facebook, icon: Facebook },
  { name: "iGospel on LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
  { name: "Email iGospel", href: `mailto:${siteConfig.emails.contact}`, icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary py-12 mb-20 md:mb-0">
      <div className="px-4 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-wider bg-black p-2 rounded-md block w-fit mb-4"
            >
              <Image src={logo} alt="iGospel home" width={146} height={36} className="w-auto h-9" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover music, read stories, explore artists.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Explore">
            <h2 className="font-semibold mb-4">Explore</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-accent">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/music" className="hover:text-accent">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent">
                  Login to account
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h2 className="font-semibold mb-4">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-accent">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h2 className="font-semibold mb-4">Follow</h2>
            <div className="flex gap-4">
              {social.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="hover:text-accent"
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} iGospel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
