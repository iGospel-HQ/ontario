import { Database, ShieldCheck, UserCheck } from "lucide-react";
import { LegalCallout, LegalDocument, SupportEmail, type LegalSection } from "@/components/legal/legal-document";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how iGospel collects, uses, and protects your personal information on our digital gospel platform.",
  path: "/privacy",
});

const HIGHLIGHTS = [
  { icon: Database, title: "What we collect", text: "Account details, usage activity and payment status." },
  { icon: ShieldCheck, title: "What we never do", text: "Sell your personal data or store card and bank details." },
  { icon: UserCheck, title: "Your control", text: "Access, correct or delete your data at any time." },
];

const SECTIONS: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <h3>a. Personal Information</h3>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Profile information</li>
        </ul>
        <h3>b. Usage Information</h3>
        <ul>
          <li>Device information</li>
          <li>IP address</li>
          <li>App interactions</li>
          <li>Download and streaming activity</li>
        </ul>
        <h3>c. Payment Information</h3>
        <ul>
          <li>Transaction references</li>
          <li>Payment status</li>
        </ul>
        <LegalCallout>
          <strong>Note:</strong> We do not store card or bank details.
        </LegalCallout>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    body: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Create and manage user accounts</li>
          <li>Process payments and artist/minister/ministry support</li>
          <li>Improve platform features</li>
          <li>Send notifications and updates</li>
          <li>Prevent fraud and ensure security</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    body: (
      <>
        <p>We may share data with:</p>
        <ul>
          <li>Payment processors</li>
          <li>Analytics providers</li>
          <li>Legal authorities when required by law</li>
        </ul>
        <LegalCallout>
          <strong>We do not sell your personal data.</strong>
        </LegalCallout>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data Security",
    body: (
      <p>
        We implement reasonable technical and organizational measures to protect your data. However, no system is
        100% secure.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    body: <p>iGospel may use cookies or similar technologies to enhance user experience and analytics.</p>,
  },
  {
    id: "user-rights",
    title: "User Rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request account deletion</li>
          <li>Withdraw consent where applicable</li>
        </ul>
        <p>
          Requests can be sent to <SupportEmail />.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    body: (
      <p>
        We retain personal data only as long as necessary to fulfill the purposes outlined in this Policy or as
        required by law.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    body: <p>iGospel does not knowingly collect data from children under 13 without parental consent.</p>,
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    body: (
      <p>Our Platform may contain links to third-party sites. We are not responsible for their privacy practices.</p>
    ),
  },
  {
    id: "changes",
    title: "Changes to Privacy Policy",
    body: <p>We may update this Privacy Policy periodically. Any changes will be posted on the Platform.</p>,
  },
  {
    id: "contact",
    title: "Contact Us",
    body: (
      <p>
        If you have questions about this Privacy Policy, email <SupportEmail />.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      description="How iGospel collects, uses, and protects your information."
      path="/privacy"
      updated="January 6, 2026"
      intro={
        <>
          <p>
            Your privacy is important to us. This Privacy Policy explains how iGospel collects, uses, and protects
            your information.
          </p>
          <div className="!mt-8 grid gap-3 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-rule bg-shade p-4">
                <Icon className="size-5 text-accent" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-text">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-meta">{text}</p>
              </div>
            ))}
          </div>
        </>
      }
      sections={SECTIONS}
      closing={<p>By using iGospel, you acknowledge that you have read and understood this Privacy Policy.</p>}
    />
  );
}
