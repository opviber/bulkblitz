import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Privacy Policy — BulkBlitz" };

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <div className="text-neutral-300 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/help" className="text-neutral-400 text-sm flex items-center gap-1 mb-6 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Help
        </Link>
        <h1 className="text-3xl font-black tracking-tight mb-1">Privacy Policy</h1>
        <p className="text-neutral-500 text-xs mb-8">Effective date: June 2026</p>

        <Section title="What we collect">
          <p>Phone number, name, email (optional), device identifiers, transaction records, and order/batch activity on the platform. We collect only what&apos;s necessary to operate the service.</p>
        </Section>
        <Section title="How we use it">
          <ul className="list-disc pl-4 space-y-1">
            <li>Account creation and OTP-based authentication</li>
            <li>Processing payments via Razorpay (we never store raw card data)</li>
            <li>Sending batch and order notifications via WhatsApp, push, and email</li>
            <li>Dispute resolution and fraud prevention</li>
            <li>Anonymised analytics to improve the platform</li>
          </ul>
        </Section>
        <Section title="Data sharing">
          <p>We share your delivery address and name with the manufacturer of a batch you join. We do not sell personal data to third parties. Payment data is processed by Razorpay under their PCI-DSS compliance.</p>
        </Section>
        <Section title="Data retention">
          <p>Account data is retained for 5 years post-account closure for legal and tax compliance. Transaction records follow a 7-year retention schedule per Indian accounting law.</p>
        </Section>
        <Section title="Your rights">
          <p>You may request access, correction, or deletion of your personal data by writing to <a href="mailto:privacy@bulkblitz.in" className="underline text-[var(--color-brand,#F97316)]">privacy@bulkblitz.in</a>. Deletion requests will be processed within 30 days subject to legal retention obligations.</p>
        </Section>
        <Section title="Cookies">
          <p>We use an httpOnly session cookie to maintain your login state. No third-party advertising cookies are used.</p>
        </Section>
      </div>
    </div>
  );
}
