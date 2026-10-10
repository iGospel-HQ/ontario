import { FadeIn } from "@/components/shared/fade-in";
import { Reveal } from "@/components/shared/reveal";
import { Heart, Globe, Sparkles, Cross, Users, Radio, Mail } from "lucide-react";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "iGospel is a Nigerian gospel platform, founded in 2018, for gospel music, artist stories and devotionals. Learn about our mission, vision and values.",
  path: "/about",
});

const FOUNDED_YEAR = 2018;
// Computed at build time, so the count stays current with each deploy.
const YEARS_ACTIVE = new Date().getFullYear() - FOUNDED_YEAR;

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] bg-gradient-to-br from-red-100 via-white to-orange-100 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-white/50" />
        <FadeIn duration={0.8} className="relative z-10 px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              iGospel
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Spreading the Gospel of Jesus Christ Through Digital Media Since {FOUNDED_YEAR}
          </p>
        </FadeIn>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Reveal className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Who We Are</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              iGospel Media Connect is a digital gospel platform founded in <strong>{FOUNDED_YEAR}</strong> with a mission to spread the Gospel of our Lord Jesus Christ through edifying and spirit-filled content.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We provide access to gospel music, sermons, devotionals, and other inspirational resources designed to build faith and transform lives. We exist to leverage technology as a tool for ministry: connecting people across the world to Christ-centered content that inspires worship, strengthens faith, and nurtures spiritual growth.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              On iGospel, you can stream and download new releases, explore artist profiles, follow the top charts and
              discover curated playlists. Gospel artists and ministers can{" "}
              <Link href="/upload" className="font-semibold text-red-600 hover:underline">
                upload their songs
              </Link>{" "}
              to reach a wider audience, and listeners can support them directly through the platform.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          {/* Our Mission */}
          <Reveal x={-30} y={0} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to advance the Gospel of Jesus Christ through digital media, making sound, uplifting, and faith-building content easily accessible to believers everywhere.
            </p>
            <p className="text-gray-600 mt-4">
              Through music, teachings, and devotional resources, we aim to encourage spiritual growth and deepen personal relationships with God.
            </p>
          </Reveal>

          {/* Our Vision */}
          <Reveal x={30} y={0} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-100 rounded-full">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our vision is to become a leading digital gospel platform that impacts lives globally, fosters true worship, and supports the growth of the Christian faith through technology.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by these foundational principles
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Cross, title: "Christ-Centered Content", desc: "Jesus Christ remains the focus of everything we do" },
              { icon: Sparkles, title: "Edification", desc: "Content that builds faith and strengthens spiritual lives" },
              { icon: Heart, title: "Integrity", desc: "Upholding godly values in ministry and media" },
              { icon: Globe, title: "Global Reach", desc: "Using technology to reach lives beyond borders" },
            ].map((value, i) => (
              <Reveal
                key={value.title}
                delay={i * 0.1}
                className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-gray-200">
                <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 shadow-md">
                  <value.icon className="w-8 h-8 mx-auto text-red-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-red-100 to-orange-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { icon: Radio, value: "Global", label: "Reach" },
            { icon: Users, value: "Millions", label: "Lives Impacted" },
            { icon: Heart, value: `${YEARS_ACTIVE}+ Years`, label: "In This Assignment" },
            { icon: Globe, value: "Worldwide", label: "Community" },
          ].map((stat) => (
            <Reveal key={stat.label} y={0} scale={0.9} className="text-gray-900">
              <stat.icon className="w-10 h-10 mx-auto mb-4 text-red-600" />
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-sm uppercase tracking-wider opacity-80 mt-2">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-orange-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Partner With Us In Spreading The Gospel
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of believers experiencing spiritual growth through Christ-centered digital content.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/contact"
                className="px-10 py-4 bg-white text-red-600 rounded-full font-bold text-lg hover:bg-gray-100 transition flex items-center gap-3"
              >
                <Mail className="w-6 h-6" />
                Get In Touch
              </Link>
              <Link
                href="/blog"
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition"
              >
                Explore Content
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
