"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Arrow } from "@radix-ui/react-tooltip";

const slide= 
  {
    id: 1,
    banner: {
      title: "TAGE",
      subtitle: "The Amazing Grace Experience",
      artist: "Gospel Force",
      image: "/tage-banner.jpg", // your real banner
    },
    cards: [
      {
        title: "Holy One",
        artist: "Israel Ssali",
        date: "November 20, 2025",
        tag: "Ugandan Gospel",
      },
      {
        title: "Oluwa Ti Segun",
        artist: "Gospel Force",
        date: "November 14, 2025",
        tag: "New Single",
      },
      {
        title: "Thank You Jesus",
        artist: "Joe Praize",
        date: "November 13, 2025",
        tag: "Official Video Out",
      },
    ],
  }

export function HeroSection() {
  // const [current, setCurrent] = useState(0);
  // const slide = slides[current];

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrent((prev) => (prev + 1) % slides.length);
  //   }, 7000);
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <section className="relative bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Compact Banner */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img
              // src={slide.banner.image || "/abstract-soundscape.png"}
              src={"/abstract-soundscape.png"}
              // alt={slide.banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto">
              <p className="text-red-400 text-sm uppercase tracking-wider mb-2">
                Brand New Album
              </p>
              <h1 className="text-5xl md:text-7xl font-black mb-2">
                {slide.banner.title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-200 mb-3">
                {slide.banner.subtitle}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-6">
                {slide.banner.artist}
              </p>
              <button className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-7 py-3.5 rounded-full font-bold uppercase text-sm tracking-wider transition">
                <ArrowRight className="w-5 h-5" />
                See More
              </button>
            </div>
          </div>

          {/* Compact 3-Card Grid */}
          <div className="max-w-7xl mx-auto px-6 py-10 -mt-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {slide.cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-900/30 transition group cursor-pointer border border-gray-800"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-700/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-5xl text-gray-600 group-hover:text-red-500 transition">
                        ▶
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg line-clamp-1">
                      {card.title}
                    </h3>
                    <p className="text-red-400 font-medium text-sm mt-1">
                      {card.artist}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">{card.tag}</p>
                    <p className="text-gray-600 text-xs mt-1">{card.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Minimal Arrows */}
      {/* <button
        onClick={() =>
          setCurrent((p) => (p - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 p-2 rounded-full backdrop-blur"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrent((p) => (p + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 p-2 rounded-full backdrop-blur"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Tiny Dots */}
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-8 bg-red-500" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>  */}
    </section>
  );
}
