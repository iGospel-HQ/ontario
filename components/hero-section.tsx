"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";



export function HeroSection({post}: any) {


  return (
    <section className="relative bg-background text-white">
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
               src={post.featured_image}
                    alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto">
              <p className="text-red-400 text-sm uppercase tracking-wider mb-2">
                Brand New
              </p>
              <h1 className="text-5xl md:text-7xl font-black mb-2">
               {post.title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-200 mb-3 truncate">
                {post.excerpt}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-6">
                {post.author}
              </p>
              <Link href={`/blog/${post.slug}`} className="flex items-center w-fit gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-7 py-3.5 rounded-full font-bold uppercase text-sm tracking-wider transition">
                <ArrowRight className="w-5 h-5" />
                View
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
