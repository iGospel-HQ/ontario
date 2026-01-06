"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfUseClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <div className="rounded-md bg-black p-2 text-xl font-bold tracking-wider">
              <img src="/logo.png" alt="logo" className="h-16 w-auto" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Terms of Use
          </motion.h2>
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Last updated: January 06, 2026
          </motion.p> */}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="prose prose-lg max-w-none text-gray-700"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to iGospel
              </h3>
              <p className="mb-6">
                iGospel is a digital gospel platform that allows users to stream
                and download gospel music, sermons, videos, devotionals, support
                gospel artists financially, and engage with faith-based content.
              </p>
              <p className="mb-8">
                By accessing or using iGospel, you agree to be bound by these
                Terms of Use. If you do not agree, please do not use the
                Platform.
              </p>
            </motion.div>

            <motion.ol variants={itemVariants} className="space-y-10">
              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1. Eligibility
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 13 years old to use iGospel.</li>
                  <li>
                    If you are under 18, you confirm that you have parental or
                    guardian consent.
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  2. User Accounts
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your login credentials.
                  </li>
                  <li>
                    You agree to provide accurate, current, and complete
                    information.
                  </li>
                  <li>
                    iGospel reserves the right to suspend or terminate accounts
                    that violate these Terms.
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  3. Acceptable Use
                </h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Use the Platform for unlawful or fraudulent purposes</li>
                  <li>
                    Upload or share offensive, defamatory, or non-gospel-related
                    content
                  </li>
                  <li>Infringe intellectual property rights</li>
                  <li>Attempt to hack, disrupt, or misuse the Platform</li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  4. Content Ownership & Licensing
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    All content uploaded by artists remains their property.
                  </li>
                  <li>
                    By uploading content, you grant iGospel a non-exclusive,
                    royalty-free license to host, distribute, and promote such
                    content on the Platform.
                  </li>
                  <li>
                    iGospel content (logos, branding, design, software) is
                    protected by copyright and may not be reused without
                    permission.
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  5. Artist Support & Payments
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    iGospel enables users to financially support gospel
                    artists/ministers/ministries through tips, donations, or
                    paid content.
                  </li>
                  <li>
                    Payments are processed via third-party payment providers.
                  </li>
                  <li>
                    iGospel does not store sensitive payment card details.
                  </li>
                  <li>
                    All transactions are non-refundable unless explicitly
                    stated.
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  6. Downloads & Streaming
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Downloaded content is for personal, non-commercial use only.
                  </li>
                  <li>
                    Redistribution or resale of downloaded content is strictly
                    prohibited.
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  7. Termination
                </h3>
                <p>We reserve the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    Suspend or terminate your account at any time for violations
                  </li>
                  <li>
                    Remove content that breaches these Terms or applicable laws
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  8. Disclaimers
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    iGospel is provided on an "as-is" and "as-available" basis.
                  </li>
                  <li>
                    We do not guarantee uninterrupted or error-free service.
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  9. Limitation of Liability
                </h3>
                <p>
                  To the fullest extent permitted by law, iGospel shall not be
                  liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Loss of data, revenue, or spiritual interpretations</li>
                  <li>Indirect, incidental, or consequential damages</li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  10. Governing Law
                </h3>
                <p>
                  These Terms shall be governed by and interpreted in accordance
                  with the laws of the Federal Republic of Nigeria, without
                  regard to conflict of law principles.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  11. Changes to Terms
                </h3>
                <p>
                  We may update these Terms from time to time. Continued use of
                  iGospel constitutes acceptance of the revised Terms.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  12. Contact Information
                </h3>
                <p>
                  For questions or concerns: <br />
                  <a
                    href="mailto:support@igospel.ng"
                    className="text-red-600 hover:underline"
                  >
                    support@igospel.ng
                  </a>
                </p>
              </li>
            </motion.ol>

            <motion.div
              variants={itemVariants}
              className="mt-16 text-center text-gray-600"
            >
              <p>Thank you for being part of the iGospel family.</p>
              <p className="mt-4 font-medium text-gray-800">
                To God be the glory!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
