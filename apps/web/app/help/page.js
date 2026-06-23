import Link from "next/link";
import { MessageCircle, Mail, FileText, ShieldCheck } from "lucide-react";

const FAQ = [
  { q: "When am I charged?", a: "Your card is authorized (held) when you join. It's only captured at the final tier price when the batch closes successfully. If the batch doesn't reach its minimum order quantity, the hold is released — you're never charged." },
  { q: "Can I cancel my reservation?", a: "Yes — anytime before the batch locks (i.e., before it closes at endTime). Once locked, cancellations follow the manufacturer's return policy." },
  { q: "What if the product isn't as described?", a: "File a 'Not as described' dispute within 7 days of delivery. Our team reviews evidence from both sides within 5 business days and can issue a full refund plus a 5% BulkCash goodwill bonus." },
  { q: "How are manufacturers verified?", a: "Every manufacturer submits GSTIN and bank account details. Our team verifies before their batches can go live. Verified manufacturers show a blue badge on their profile." },
  { q: "What is BulkCash?", a: "BulkCash is platform wallet credit earned via referrals and dispute goodwill bonuses. Use it to offset the cost on any future batch." },
  { q: "How do referrals work?", a: "Share your unique referral link from /refer. When a friend joins their first batch, you earn ₹10 BulkCash automatically." },
  { q: "What is the platform fee?", a: "Manufacturers pay a 4% transaction fee on batch GMV at close, plus a ₹999 listing fee per batch (first batch free). Buyers pay nothing extra." },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black text-white px-5 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight">Help &amp; Support</h1>
        <p className="text-neutral-400 mt-2 mb-10">Answers to common questions. Didn&apos;t find yours? Reach us directly.</p>

        <div className="space-y-4 mb-12">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 open:bg-white/[0.04] cursor-pointer">
              <summary className="font-semibold list-none flex items-center justify-between">
                {q}
                <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="text-neutral-300 text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">WhatsApp support</div>
              <div className="text-xs text-neutral-400 mt-0.5">9 am – 9 pm IST, Mon–Sat</div>
            </div>
          </a>
          <a href="mailto:support@bulkblitz.in"
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Email us</div>
              <div className="text-xs text-neutral-400 mt-0.5">support@bulkblitz.in</div>
            </div>
          </a>
          <Link href="/how-it-works"
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] flex items-start gap-3">
            <FileText className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">How it works</div>
              <div className="text-xs text-neutral-400 mt-0.5">Step-by-step explainer</div>
            </div>
          </Link>
          <Link href="/legal/terms"
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-neutral-300 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Terms &amp; policies</div>
              <div className="text-xs text-neutral-400 mt-0.5">Terms · Privacy · Refunds</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
