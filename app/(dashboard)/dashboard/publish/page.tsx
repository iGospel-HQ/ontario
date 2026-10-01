"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Mic2, Mail, ArrowRight } from "lucide-react";

export default function PublishContentPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen py-3 md:py-12">
      <div className="max-w-4xl mx-auto sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 md:space-y-16"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to Upload Your Gospel Content on iGospel
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              iGospel is a growing gospel media platform designed to help gospel creators reach wider audiences, build community, and receive direct support from listeners.
            </p>
          </motion.div>

          {/* Content Types */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                  <Music className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Music Content</h3>
              </div>
              <p className="text-gray-700">Submitted by Gospel Artists</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Mic2 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sermon Content</h3>
              </div>
              <p className="text-gray-700">Submitted by Ministers, Pastors, and Ministries</p>
            </div>
          </motion.div>

          {/* Submission Steps */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              How Content Submission Works
            </h2>

            <ol className="space-y-8 list-decimal list-inside marker:text-red-600 marker:font-bold marker:text-xl">
          

              <li className="bg-white rounded-xl p-6 shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Submit Your Content via Email</h3>
                <p className="text-base text-gray-700 mb-4">
                  All music and sermon content should be sent to our official submission email:
                </p>

                <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-center mb-6">
                  <p className="text-xl font-bold text-red-700 break-all">
                    igospelmediaconnect@gmail.com
                  </p>
                </div>

                <p className="text-base text-gray-700 mb-5">
                  Please ensure your submission follows the guidelines provided in your dashboard to avoid delays.<br />
                  Also, include the required details below in your email based on the type of content you are submitting.
                </p>

                {/* Music Requirements */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5" /> Music Submission Requirements
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-gray-700">
                    <li>Artist name</li>
                    <li>Profile ID (You can get it in the profile section in your dashboard)</li>
                    <li>Email address (used during account creation)</li>
                    <li>Phone number</li>
                    <li>Song title</li>
                    <li>Genre (e.g. Afro Gospel, Worship, Praise, Contemporary Gospel, etc.)</li>
                    <li>Artwork / cover image</li>
                    <li>Content description (short description of the song)</li>
                  </ul>
                </div>

                {/* Sermon Requirements */}
                <div>
                  <h4 className="text-lg font-bold text-orange-700 mb-4 flex items-center gap-2">
                    <Mic2 className="w-5 h-5" /> Sermon Submission Requirements
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-gray-700">
                    <li>Minister / Ministry name</li>
                    <li>Profile ID (You can get it in the profile section in your dashboard)</li>
                    <li>Email address (used during account creation)</li>
                    <li>Phone number</li>
                    <li>Category (e.g. Faith, Finance, Prayer, Leadership, Family, etc.)</li>
                    <li>Artwork / cover image</li>
                    <li>Content description (short description of the sermon)</li>
                  </ul>
                </div>
              </li>

              <li className="bg-white rounded-xl p-6 shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Review & Publishing</h3>
                <p className="text-base text-gray-700">
                  All submitted content is reviewed and published within 24 to 72 hours, provided it meets iGospel’s content standards.
                </p>
              </li>
            </ol>
          </motion.div>

         
        </motion.div>
      </div>
    </div>
  );
}
