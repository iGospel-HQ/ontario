// app/upload/UploadPageClient.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Mic2, ArrowRight, LogIn, UserPlus, Heart, Globe, Wallet } from "lucide-react";

export default function UploadPageClient() {
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
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-red-50/20">
      {/* Hero – Compact & Mobile-Friendly */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-red-600/95 to-orange-600 text-white">
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Upload Your Gospel Content
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-95 leading-relaxed"
          >
            Reach thousands of gospel lovers, grow your ministry, and receive direct support from your audience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="default"
              className="bg-white text-red-700 hover:bg-gray-100 text-base sm:text-lg font-semibold px-8 py-5 sm:py-6 rounded-full shadow-lg"
              asChild
            >
              <Link href="/signup">
                <UserPlus className="mr-2 h-5 w-5" />
                Create Free Account
              </Link>
            </Button>

            <Button
              size="default"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg font-semibold px-8 py-5 sm:py-6 rounded-full"
              asChild
            >
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Login to Upload
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12 md:space-y-16"
          >
            {/* Intro */}
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                How to Upload Your Gospel Content on iGospel
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                iGospel is a growing gospel media platform designed to help gospel creators reach wider audiences, build community, and receive direct support from listeners.
              </p>
            </motion.div>

            {/* Content Types */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-red-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                    <Music className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Music Content</h3>
                </div>
                <p className="text-gray-700 mb-5 text-base">
                  Submitted by Gospel Artists
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Mic2 className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Sermon Content</h3>
                </div>
                <p className="text-gray-700 mb-5 text-base">
                  Submitted by Ministers, Pastors, and Ministries
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Submission Steps */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
                How Content Submission Works
              </h3>

              <ol className="space-y-8">
                <li className="bg-white rounded-xl p-6 shadow-md border relative border-gray-100">
                  <div className="flex items-start gap-5">
                    <div className="absolute -top-4 -left-4 md:relative w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-1 text-xl font-bold text-red-600">
                      1
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Create an Account</h4>
                      <p className="text-base text-gray-700 mb-5">
                        You must sign up or log in to your iGospel account before submitting any content.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="sm" asChild>
                          <Link href="/signup">Sign Up Now</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/login">Already have an account? Login</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="bg-white rounded-xl p-6 shadow-md border relative border-gray-100">
                  <div className="flex items-start gap-5">
                    <div className="absolute -top-4 -left-4 md:relative w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-1 text-xl font-bold text-red-600">
                      2
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Go to Your Dashboard</h4>
                      <p className="text-base text-gray-700">
                        After logging in, navigate to your dashboard and click on “Publish Content.”<br />
                        You’ll see clear instructions on how to submit your content.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="bg-white rounded-xl p-6 shadow-md border relative border-gray-100">
                  <div className="flex items-start gap-5">
                    <div className="absolute -top-4 -left-4 md:relative w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-1 text-xl font-bold text-red-600">
                      3
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Submit Your Content via Email</h4>
                      <p className="text-base text-gray-700 mb-4">
                        All music and sermon content should be sent to our official submission email:
                      </p>

                      <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-center mb-5">
                        <p className="text-lg sm:text-xl font-bold text-red-700 break-all">
                          igospelmediaconnect@gmail.com
                        </p>
                      </div>

                      <p className="text-base text-gray-700 mb-5">
                        Please ensure your submission follows the guidelines provided in your dashboard to avoid delays. Also, include the required details below in your email based on the type of content you are submitting.
                      </p>

                      {/* Music Requirements */}
                      <div className="mb-6">
                        <h5 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                          <Music className="w-5 h-5" /> Music Submission Requirements
                        </h5>
                        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
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
                        <h5 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
                          <Mic2 className="w-5 h-5" /> Sermon Submission Requirements
                        </h5>
                        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
                          <li>Minister / Ministry name</li>
                          <li>Profile ID (You can get it in the profile section in your dashboard)</li>
                          <li>Email address (used during account creation)</li>
                          <li>Phone number</li>
                          <li>Category (e.g. Faith, Finance, Prayer, Leadership, Family, etc.)</li>
                          <li>Artwork / cover image</li>
                          <li>Content description (short description of the sermon)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="bg-white rounded-xl p-6 shadow-md border relative border-gray-100">
                  <div className="flex items-start gap-5">
                    <div className="absolute -top-4 -left-4 md:relative w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-1 text-xl font-bold text-red-600">
                      4
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Review & Publishing</h4>
                      <p className="text-base text-gray-700">
                        All submitted content is reviewed and published within 24 to 72 hours, provided it meets iGospel’s content standards.
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </motion.div>

            {/* Why Publish Section */}
            <motion.div variants={itemVariants} className="mt-16">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                Why Publish on iGospel?
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-red-100 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
                    <Globe className="w-7 h-7 text-red-600" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">Reach a Growing Gospel Audience</h4>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li>• Access a community of over 4,000 active gospel content consumers on Telegram</li>
                    <li>• Enjoy exposure from over 10,000 daily visitors across the platform</li>
                  </ul>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-orange-100 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-5">
                    <Heart className="w-7 h-7 text-orange-600" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">Receive Direct Support from Listeners</h4>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li>• Every published content page includes a “Support This Artist” or “Support This Ministry” button</li>
                    <li>• Listeners can financially support your music or ministry directly</li>
                  </ul>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-red-100 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
                    <Wallet className="w-7 h-7 text-red-600" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">Creator Dashboard & Wallet</h4>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li>• Track all gifts and support received in real time</li>
                    <li>• View detailed records directly from your dashboard</li>
                    <li>• Withdraw your earnings instantly to your preferred account</li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 bg-white p-6 md:p-8 rounded-2xl shadow-md border border-orange-100">
                <h4 className="text-xl font-bold text-orange-700 mb-4">Transparent Platform Commission</h4>
                <p className="text-base text-gray-800">
                  iGospel takes a <strong className="text-red-600">10% platform commission</strong> on every gift received.<br />
                  <span className="text-sm">No hidden charges — what you see is what you earn.</span>
                </p>
              </div>
            </motion.div>

            {/* Why Creators Love Section */}
            <motion.div variants={itemVariants} className="mt-16">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                Why Creators Love iGospel
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    title: "Built for Gospel Creators",
                    desc: "iGospel is intentionally designed for gospel artists and ministries — no noise, no distractions, just Christ-centered content and the right audience.",
                  },
                  {
                    title: "Real Reach, Real Impact",
                    desc: "With thousands of active community members and daily visitors, your content reaches listeners who are genuinely hungry for gospel music and sermons.",
                  },
                  {
                    title: "Earn While You Minister",
                    desc: "Receive direct financial support from listeners through the Support This Artist or Support This Ministry feature, without needing external platforms.",
                  },
                  {
                    title: "Simple & Transparent Monetization",
                    desc: "Track every gift in your dashboard, withdraw instantly, and enjoy clear pricing with only a 10% platform commission.",
                  },
                  {
                    title: "We Promote What You Publish",
                    desc: "New content gets visibility across the iGospel community, helping you grow your audience organically.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <h4 className="text-lg md:text-xl font-bold text-red-700 mb-3">{item.title}</h4>
                    <p className="text-sm md:text-base text-gray-700">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center py-12 bg-gradient-to-r from-red-50/50 to-orange-50/50 rounded-2xl border border-red-100"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Ready to Share Your Gospel Gift?
              </h3>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-base md:text-lg px-8 py-6 rounded-full shadow-md" asChild>
                  <Link href="/signup">
                    Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base md:text-lg px-8 py-6 border-red-600 !text-red-600  rounded-full" asChild>
                  <Link href="/login">
                    Already have an account? Login
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}