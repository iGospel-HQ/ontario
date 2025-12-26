import Link from "next/link";
import { Mail, Github, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary py-12">
      <div className="px-4 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-wider bg-black p-2 rounded-md block w-fit mb-4"
            >
              <img src="/logo.png" alt="logo" className="w-auto h-9" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover music, read stories, explore artists.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
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
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-accent">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/igospelmediaconnect" className="hover:text-accent">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/igospelmediaconnect" className="hover:text-accent">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:igospelmediaconnect@gmail.com" className="hover:text-accent">
                <Mail className="h-5 w-5" />
              </a>
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
