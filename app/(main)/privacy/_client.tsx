// app/privacy/PrivacyPolicyClient.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicyClient() {
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
            Privacy Policy
          </motion.h2>
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Last Updated: January 2026
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
            <motion.p variants={itemVariants} className="mb-8">
              Your privacy is important to us. This Privacy Policy explains how iGospel collects, uses, and protects your information.
            </motion.p>

            <motion.ol variants={itemVariants} className="space-y-10">
              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h3>
                <h4 className="text-lg font-semibold mb-2">a. Personal Information</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Profile information</li>
                </ul>

                <h4 className="text-lg font-semibold mt-4 mb-2">b. Usage Information</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device information</li>
                  <li>IP address</li>
                  <li>App interactions</li>
                  <li>Download and streaming activity</li>
                </ul>

                <h4 className="text-lg font-semibold mt-4 mb-2">c. Payment Information</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Transaction references</li>
                  <li>Payment status</li>
                </ul>
                <p className="mt-2 text-gray-600">
                  <strong>Note:</strong> We do not store card or bank details.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h3>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Create and manage user accounts</li>
                  <li>Process payments and artist/minister/ministry support</li>
                  <li>Improve platform features</li>
                  <li>Send notifications and updates</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Data Sharing</h3>
                <p>We may share data with:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Payment processors</li>
                  <li>Analytics providers</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p className="mt-4 font-medium">We do not sell your personal data.</p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h3>
                <p>
                  We implement reasonable technical and organizational measures to protect your data. However, no system is 100% secure.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Cookies & Tracking</h3>
                <p>
                  iGospel may use cookies or similar technologies to enhance user experience and analytics.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. User Rights</h3>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request account deletion</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
                <p className="mt-4">
                  Requests can be sent to{" "}
                  <a href="mailto:support@igospel.ng" className="text-red-600 hover:underline">
                    support@igospel.ng
                  </a>
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h3>
                <p>
                  We retain personal data only as long as necessary to fulfill the purposes outlined in this Policy or as required by law.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8. Children’s Privacy</h3>
                <p>
                  iGospel does not knowingly collect data from children under 13 without parental consent.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">9. Third-Party Links</h3>
                <p>
                  Our Platform may contain links to third-party sites. We are not responsible for their privacy practices.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">10. Changes to Privacy Policy</h3>
                <p>
                  We may update this Privacy Policy periodically. Any changes will be posted on the Platform.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h3>
                <p>
                  If you have questions about this Privacy Policy: <br />
                  <a href="mailto:support@igospel.ng" className="text-red-600 hover:underline">
                    support@igospel.ng
                  </a>
                </p>
              </li>
            </motion.ol>

            <motion.div
              variants={itemVariants}
              className="mt-16 text-center text-gray-600"
            >
              <p>By using iGospel, you acknowledge that you have read and understood this Privacy Policy.</p>
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