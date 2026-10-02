import { LegalCallout, LegalDocument, SupportEmail, type LegalSection } from "@/components/legal/legal-document";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Read the Terms of Use for iGospel, the digital gospel platform for music, sermons, devotionals, and faith-based content.",
  path: "/terms",
});

const SECTIONS: LegalSection[] = [
  {
    id: "eligibility",
    title: "Eligibility",
    body: (
      <ul>
        <li>You must be at least 13 years old to use iGospel.</li>
        <li>If you are under 18, you confirm that you have parental or guardian consent.</li>
      </ul>
    ),
  },
  {
    id: "user-accounts",
    title: "User Accounts",
    body: (
      <ul>
        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        <li>You agree to provide accurate, current, and complete information.</li>
        <li>iGospel reserves the right to suspend or terminate accounts that violate these Terms.</li>
      </ul>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Platform for unlawful or fraudulent purposes</li>
          <li>Upload or share offensive, defamatory, or non-gospel-related content</li>
          <li>Infringe intellectual property rights</li>
          <li>Attempt to hack, disrupt, or misuse the Platform</li>
        </ul>
      </>
    ),
  },
  {
    id: "content-ownership",
    title: "Content Ownership & Licensing",
    body: (
      <ul>
        <li>All content uploaded by artists remains their property.</li>
        <li>
          By uploading content, you grant iGospel a non-exclusive, royalty-free license to host, distribute, and
          promote such content on the Platform.
        </li>
        <li>
          iGospel content (logos, branding, design, software) is protected by copyright and may not be reused without
          permission.
        </li>
      </ul>
    ),
  },
  {
    id: "artist-support-payments",
    title: "Artist Support & Payments",
    body: (
      <>
        <ul>
          <li>
            iGospel enables users to financially support gospel artists/ministers/ministries through tips, donations,
            or paid content.
          </li>
          <li>Payments are processed via third-party payment providers.</li>
          <li>iGospel does not store sensitive payment card details.</li>
        </ul>
        <LegalCallout>All transactions are non-refundable unless explicitly stated.</LegalCallout>
      </>
    ),
  },
  {
    id: "downloads-streaming",
    title: "Downloads & Streaming",
    body: (
      <ul>
        <li>Downloaded content is for personal, non-commercial use only.</li>
        <li>Redistribution or resale of downloaded content is strictly prohibited.</li>
      </ul>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    body: (
      <>
        <p>We reserve the right to:</p>
        <ul>
          <li>Suspend or terminate your account at any time for violations</li>
          <li>Remove content that breaches these Terms or applicable laws</li>
        </ul>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <ul>
        <li>iGospel is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis.</li>
        <li>We do not guarantee uninterrupted or error-free service.</li>
      </ul>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    body: (
      <>
        <p>To the fullest extent permitted by law, iGospel shall not be liable for:</p>
        <ul>
          <li>Loss of data, revenue, or spiritual interpretations</li>
          <li>Indirect, incidental, or consequential damages</li>
        </ul>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    body: (
      <p>
        These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of
        Nigeria, without regard to conflict of law principles.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to Terms",
    body: (
      <p>
        We may update these Terms from time to time. Continued use of iGospel constitutes acceptance of the revised
        Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    body: (
      <p>
        For questions or concerns, email <SupportEmail />.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Use"
      description="The rules for using iGospel's music, sermons, devotionals and artist support."
      path="/terms"
      updated="January 6, 2026"
      intro={
        <>
          <p className="font-heading text-2xl font-bold text-text">Welcome to iGospel</p>
          <p>
            iGospel is a digital gospel platform that allows users to stream and download gospel music, sermons,
            videos, devotionals, support gospel artists financially, and engage with faith-based content.
          </p>
          <p>
            By accessing or using iGospel, you agree to be bound by these Terms of Use. If you do not agree, please do
            not use the Platform.
          </p>
        </>
      }
      sections={SECTIONS}
      closing={<p>Thank you for being part of the iGospel family.</p>}
    />
  );
}
