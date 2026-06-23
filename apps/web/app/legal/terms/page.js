import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Terms of Service — BulkBlitz" };

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <div className="text-neutral-300 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/help" className="text-neutral-400 text-sm flex items-center gap-1 mb-6 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Help
        </Link>
        <h1 className="text-3xl font-black tracking-tight mb-1">Terms of Service</h1>
        <p className="text-neutral-500 text-xs mb-8">Effective date: June 2026</p>

        <Section title="1. What BulkBlitz does">
          <p>BulkBlitz operates a crowd-powered group-buy marketplace connecting buyers with verified Indian manufacturers. We facilitate dynamic batch pricing, payment authorization, and order fulfilment. We are not the buyer or seller in any transaction.</p>
        </Section>
        <Section title="2. Eligibility">
          <p>You must be at least 18 years old and a resident of India to use BulkBlitz. By creating an account, you confirm this.</p>
        </Section>
        <Section title="3. Batch mechanics and payments">
          <p>When you join a batch, your payment method is authorized (held) for the current tier price. You are charged only at the final closing tier — which is always ≤ the price shown when you joined. If a batch fails to meet its minimum order quantity (MOQ), your authorization is voided with no charge.</p>
        </Section>
        <Section title="4. Platform fees">
          <p>Manufacturers pay a 4% transaction fee on batch GMV at close and a ₹999 listing fee per batch (first batch free). Buyers pay no platform fee.</p>
        </Section>
        <Section title="5. Disputes and refunds">
          <p>Buyers may raise a &quot;not as described&quot; claim within 7 days of delivery. BulkBlitz mediates and may issue a full refund plus a 5% BulkCash goodwill credit. See our <Link href="/legal/refund-policy" className="underline text-[var(--color-brand,#F97316)]">Refund Policy</Link>.</p>
        </Section>
        <Section title="6. BulkCash wallet">
          <p>BulkCash is non-transferable platform credit earned via referrals and dispute resolutions. It expires 12 months from issuance and has no cash value.</p>
        </Section>
        <Section title="7. Prohibited conduct">
          <p>Users may not manipulate batch fill counts, submit false KYC documents, or use the platform for money laundering. Violations result in immediate account suspension.</p>
        </Section>
        <Section title="8. Limitation of liability">
          <p>BulkBlitz is not liable for manufacturer delays, product quality issues beyond the dispute window, or losses exceeding the value of the relevant transaction.</p>
        </Section>
        <Section title="9. Governing law">
          <p>These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.</p>
        </Section>
        <Section title="10. Contact">
          <p>Questions? <a href="mailto:legal@bulkblitz.in" className="underline text-[var(--color-brand,#F97316)]">legal@bulkblitz.in</a></p>
        </Section>
      </div>
    </div>
  );
}
