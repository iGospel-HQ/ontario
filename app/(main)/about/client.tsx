// app/about/page.tsx  (or components/AboutPage.tsx)
"use client";

import { motion } from "framer-motion";
import { Music, Radio, Users, Heart, Mic, Globe, Sparkles, Mail } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* Compact Hero */}
      <section className="relative h-96 md:h-[500px] bg-gradient-to-br from-red-950 via-black to-orange-950 flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">iGospel</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Spreading African Gospel Fire Since 2019
          </p>
        </motion.div>
      </section>

      {/* Mission – Compact 2-column */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-5 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We amplify anointed African gospel voices, connect believers through powerful worship music, and preserve the rich heritage of praise across the continent and beyond.
            </p>
            <p className="text-gray-400 mt-4 text-sm">
              Latest releases • Lyrics • Downloads • Exclusive interviews • Free downloads — all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-64 md:h-80 rounded-xl overflow-hidden"
          >
            <Image
              src="/about-mission.jpg"
              alt="Worship"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Stats – Slim & Elegant */}
      <section className="py-12 bg-gradient-to-r from-red-900 to-orange-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { icon: Music, value: "12K+", label: "Songs" },
            { icon: Radio, value: "200K+", label: "Listeners" },
            { icon: Users, value: "1M+", label: "Visitors" },
            { icon: Heart, value: "∞", label: "Lives Touched" },
          ].map((stat, i) => (
            <div key={i} className="text-white">
              <stat.icon className="w-10 h-10 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs uppercase tracking-wider opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team – Compact Cards */}
      <section className="py-16 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Pastor Michael", role: "Founder", img: "/team1.jpg" },
              { name: "Grace Adebayo", role: "Content Lead", img: "/team2.jpg" },
              { name: "David Ike", role: "Tech & Design", img: "/team3.jpg" },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-red-600/20">
                  <Image src={member.img} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-red-400 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values – 3 Small Cards */}
      <section className="py-16 bg-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Anointing First" },
              { icon: Globe, title: "Global Family" },
              { icon: Mic, title: "Pure Worship" },
            ].map((v, i) => (
              <div key={i} className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <v.icon className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-bold text-lg">{v.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA – Compact */}
      <section className="py-16 bg-gradient-to-r from-red-900 to-orange-900 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg text-gray-200 mb-8">
            Artists · Worship Leaders · Music Lovers — This is home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/upload"
              className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" /> Submit Music
            </a>
            <a
              href="mailto:hello@gospelforce.com"
              className="px-8 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-black transition flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" /> Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}