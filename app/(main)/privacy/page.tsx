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
          <li>
            Advertising partners such as Google, through cookies on our pages (see{" "}
            <a href="#cookies">Cookies &amp; Advertising</a>)
          </li>
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
    title: "Cookies & Advertising",
    body: (
      <>
        <p>
          Cookies are small files a website stores in your browser. iGospel and our partners use cookies and similar
          technologies (such as local storage) for the purposes below.
        </p>

        <h3>a. Essential cookies</h3>
        <p>
          These keep you signed in, remember your preferences, protect your account and make payments work. The site
          cannot work properly without them.
        </p>

        <h3>b. Analytics</h3>
        <p>
          We record visit statistics, such as which posts and songs are viewed or played and an approximate location
          derived from your IP address, to understand which content is popular and improve the Platform.
        </p>

        <h3>c. Advertising</h3>
        <p>
          iGospel may show ads served by Google AdSense and other advertising partners. These third-party vendors,
          including Google, use cookies to serve ads based on your prior visits to iGospel or to other websites.
          Google&rsquo;s use of advertising cookies enables it and its partners to show you ads based on your visits to
          iGospel and/or other sites on the Internet.
        </p>
        <ul>
          <li>
            You can opt out of personalised advertising in{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            You can opt out of other vendors&rsquo; use of cookies for personalised advertising at{" "}
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>{" "}
            (or{" "}
            <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
              youronlinechoices.eu
            </a>{" "}
            in Europe).
          </li>
          <li>
            Learn how Google uses information from sites that use its services:{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              policies.google.com/technologies/partner-sites
            </a>
            .
          </li>
        </ul>
        <p>
          If you opt out, you will still see ads, but they will be less relevant to you. Where the law requires it (for
          example in the European Economic Area, the United Kingdom and Switzerland), we ask for your consent before
          personalised ads are shown.
        </p>

        <h3>d. Managing cookies</h3>
        <p>
          You can block or delete cookies in your browser settings. If you block essential cookies, signing in and
          payments may not work.
        </p>
      </>
    ),
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
      updated="October 9, 2026"
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
