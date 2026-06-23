import Link from "next/link";
import { Users, TrendingDown, ShieldCheck, Truck, HelpCircle, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Users,
    title: "1. A manufacturer lists a batch",
    body: "They set a tiered price schedule — say ₹80 for 1–49 units, ₹65 for 50–99, ₹48 for 200+. A batch window opens (24h–72h).",
    color: "text-[var(--color-brand,#F97316)]",
  },
  {
    icon: TrendingDown,
    title: "2. Buyers join and the price drops — live",
    body: "Every buyer who joins sees the price fall in real time as the crowd grows. You're literally marketing to save your own money when you share the link.",
    color: "text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "3. Batch closes at the final tier",
    body: "When the window ends, everyone pays the tier that was reached — never more than what they saw when they joined. If the minimum order quantity isn't met, no one is charged.",
    color: "text-green-400",
  },
  {
    icon: Truck,
    title: "4. Manufacturer ships, you track",
    body: "The manufacturer ships directly to you (or a pickup point near you). AWB tracking is pushed to your order page and WhatsApp.",
    color: "text-purple-400",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white px-5 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight">
          How <span className="text-[var(--color-brand,#F97316)]">BulkBlitz</span> works
        </h1>
        <p className="text-neutral-400 text-lg mt-3 mb-10">
          India&apos;s first crowd-powered manufacturing marketplace. Pool together, unlock real bulk pricing — no commitment, no risk.
        </p>

        <div className="space-y-8">
          {STEPS.map(({ icon: Icon, title, body, color }) => (
            <div key={title} className="flex gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{title}</h2>
                <p className="text-neutral-300 mt-1 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--color-brand,#F97316)]" /> Why no-one gets stuck
          </h2>
          <ul className="mt-3 space-y-2 text-neutral-300 text-sm">
            <li>✔ Your card is <strong>held, not charged</strong> until the batch closes.</li>
            <li>✔ If MOQ isn&apos;t met: <strong>full refund, no questions asked.</strong></li>
            <li>✔ If you paid at ₹80 but 200 joined → you pay ₹48. <strong>Always the final tier.</strong></li>
            <li>✔ &quot;Not as described&quot; claims within 7 days: <strong>platform mediation + refund guarantee.</strong></li>
          </ul>
        </div>

        <Link href="/" className="mt-8 flex items-center gap-2 text-[var(--color-brand,#F97316)] font-semibold">
          Browse live batches <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
