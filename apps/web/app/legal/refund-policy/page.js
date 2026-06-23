import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Refund Policy — BulkBlitz" };

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/help" className="text-neutral-400 text-sm flex items-center gap-1 mb-6 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Help
        </Link>
        <h1 className="text-3xl font-black tracking-tight mb-1">Refund Policy</h1>
        <p className="text-neutral-500 text-xs mb-8">Effective date: June 2026</p>

        <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">Automatic refunds (no claim needed)</h2>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong className="text-white">Batch cancelled (MOQ not met):</strong> Full authorization voided within 24 hours. No charge ever appears on your statement.</li>
              <li><strong className="text-white">Price tier drops after you join:</strong> You are automatically charged the lower closing price. The excess authorization is released immediately at batch close.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-2">Dispute-based refunds</h2>
            <p>If your order is materially &quot;not as described&quot;, you may raise a dispute within <strong className="text-white">7 days of confirmed delivery</strong> from your <Link href="/orders" className="underline text-[var(--color-brand,#F97316)]">Orders</Link> page.</p>
            <ul className="list-disc pl-4 space-y-2 mt-3">
              <li>Our team reviews evidence from both sides within 5 business days.</li>
              <li>If resolved in your favour: full refund to original payment method + <strong className="text-white">5% BulkCash goodwill bonus</strong>.</li>
              <li>If the manufacturer failed to ship: full refund guaranteed, no dispute window applies.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-2">Cancellation before batch close</h2>
            <p>You may cancel your slot reservation at any time <strong className="text-white">before the batch closes</strong>. The authorization hold is released within 5–7 business days depending on your bank.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-2">Non-refundable situations</h2>
            <ul className="list-disc pl-4 space-y-1">
              <li>Change of mind after batch close (MOQ met and payment captured)</li>
              <li>Disputes raised more than 7 days after delivery</li>
              <li>Damage caused after receipt</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-2">Processing times</h2>
            <p>Refunds to cards appear within 5–10 business days. Refunds to BulkCash wallet are instant.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
