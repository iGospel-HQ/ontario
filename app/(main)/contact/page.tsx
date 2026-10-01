import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import logo from "@/public/logo.png";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { FadeIn } from "@/components/shared/fade-in";
import { Reveal } from "@/components/shared/reveal";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the iGospel team",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-80 md:h-96 bg-gradient-to-br from-red-200 via-orange-100 to-pink-100 flex items-center justify-center text-center">
        <FadeIn className="px-6">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Touch
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">We usually reply the same day</p>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="py-16 bg-background text-foreground">
        <h2 className="text-3xl font-bold mb-8 px-6">Let&apos;s Connect</h2>
        <div className="w-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <Reveal x={-40} y={0}>
            <address className="space-y-5 not-italic">
              <Card>
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="p-3 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg text-white">
                    <Mail className="w-3 h-3 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href={`mailto:${siteConfig.emails.contact}`}
                      className="text-xs md:text-sm text-muted-foreground truncate"
                    >
                      {siteConfig.emails.contact}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-lg text-white">
                    <Phone className="w-3 h-3 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <a
                      href={siteConfig.whatsapp.href}
                      className="text-xs md:text-sm text-muted-foreground"
                    >
                      {siteConfig.whatsapp.display}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg text-white">
                    <MapPin className="w-3 h-3 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{siteConfig.location}</p>
                  </div>
                </CardContent>
              </Card>
            </address>
          </Reveal>

          {/* Contact form */}
          <Reveal x={40} y={0}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Footer banner */}
      <div className="py-20 bg-gradient-to-r from-red-200 to-orange-200 text-center">
        <Link
          href="/"
          className="text-xl font-bold tracking-wider bg-black p-2 rounded-md mx-auto block w-fit mb-3"
        >
          <Image src={logo} alt={`${siteConfig.name} home`} className="w-full h-10 object-contain" />
        </Link>
        <p className="text-2xl font-bold">{siteConfig.legalName}</p>
        <p className="text-muted-foreground mt-2">Music, Ministry. Always on.</p>
      </div>
    </>
  );
}
