"use client";

// =============================================================================
// /auth — Role-aware sign-up & sign-in.
//
// Flow:
//   1. ROLE — buyer or seller card (skipped via ?intent=seller URL param)
//   2. PHONE — 10-digit number, send OTP
//   3. OTP — 6 digits + (sellers only) business name / city / state
//   4. On success: BUYER → "/" (or ?next=) · MANUFACTURER → "/manufacturer"
// =============================================================================

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag, Factory, ArrowRight, ArrowLeft, Phone, Loader2, RefreshCw,
  CheckCircle2, ShieldCheck, TrendingUp, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Puducherry","Chandigarh","Andaman & Nicobar","Dadra & Nagar Haveli","Daman & Diu","Lakshadweep",
];

const ROLE_CARDS = [
  {
    key: "buyer",
    title: "I want to buy",
    badge: "Buyer",
    icon: ShoppingBag,
    line: "Join batches with other buyers and unlock manufacturer prices.",
    points: ["Real factory prices", "Pay only the final tier", "Free if batch fails MOQ"],
  },
  {
    key: "seller",
    title: "I want to sell",
    badge: "Manufacturer",
    icon: Factory,
    line: "List tier-priced batches. Get pre-paid orders. Ship the volume that fills.",
    points: ["4% flat fee", "3-day payout", "Zero unsold inventory risk"],
  },
];

function AuthInner() {
  const router = useRouter();
  const params = useSearchParams();

  // Allow deep-linking: ?intent=seller starts the seller flow, ?next=... preserves redirect
  const initialIntent = params.get("intent") === "seller" ? "seller" : null;
  const nextPath = params.get("next") || null;

  const [step, setStep] = useState(initialIntent ? "phone" : "role");
  const [intent, setIntent] = useState(initialIntent || null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [biz, setBiz] = useState({ businessName: "", city: "", state: "" });
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [sentSandbox, setSentSandbox] = useState(false);

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  // ── Step 1: role
  function pickRole(role) {
    setIntent(role);
    setStep("phone");
  }

  // ── Step 2: send OTP
  async function sendOtp(e) {
    e?.preventDefault?.();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, intent }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not send code");
      setSentSandbox(Boolean(d.sandbox));
      setStep("otp");
      setTimer(30);
      toast.success(d.sandbox ? "Sandbox mode — code is 123456" : "Code sent over SMS");
      setTimeout(() => otpRefs[0]?.current?.focus(), 50);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── OTP input handlers
  function onOtpChange(i, raw) {
    const v = raw.replace(/\D/g, "").slice(0, 1);
    setOtp((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 5) otpRefs[i + 1].current?.focus();
  }
  function onOtpKey(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
  }
  function onOtpPaste(e) {
    const text = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = text.padEnd(6, "").split("").slice(0, 6);
    setOtp(next);
    otpRefs[Math.min(text.length, 5)].current?.focus();
  }

  // ── Step 3: verify (+ business details if seller signup)
  async function verifyOtp(e) {
    e?.preventDefault?.();
    const token = otp.join("");
    if (token.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    if (intent === "seller") {
      if (!biz.businessName.trim() || !biz.city.trim() || !biz.state.trim()) {
        toast.error("Please fill your business details");
        return;
      }
    }
    setLoading(true);
    try {
      const body = {
        phone,
        token,
        name: name.trim() || undefined,
        intent,
        ...(intent === "seller" ? biz : {}),
      };
      const r = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Invalid code");

      window.dispatchEvent(new Event("session:refresh"));
      toast.success(
        d.isNew
          ? (d.becameSeller ? "Welcome, Seller. Let's set up KYC next." : "Welcome to BulkBlitz!")
          : "Welcome back."
      );
      const dest = nextPath || d.redirectTo || "/";
      router.push(dest);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ===== UI =====
  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[var(--primary)]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-[var(--accent)]/10 blur-[140px]" />

      {/* LEFT — visual / brand panel */}
      <aside className="hidden lg:flex w-1/2 relative flex-col p-12 border-r border-[var(--border-default)]">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Logo size={36} />
          <span className="font-bold text-xl tracking-tight">BulkBlitz</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h2 className="text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Bulk up.
            <br />
            <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              Price down.
            </span>
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8">
            India's first crowd-powered manufacturing marketplace. Pool together. Pay factory prices.
          </p>
          <div className="space-y-3">
            {[
              { icon: TrendingUp, text: "Live tier-drop pricing in real time" },
              { icon: ShieldCheck, text: "Card hold + capture only at final price" },
              { icon: Sparkles, text: "No-fill = no charge. Always." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/12 text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--text-tertiary)]">© 2026 BulkBlitz. Made for India.</p>
      </aside>

      {/* RIGHT — form panel */}
      <section className="flex-1 flex items-center justify-center p-5 sm:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile-only brand row */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Logo size={32} />
            <span className="font-bold text-lg tracking-tight">BulkBlitz</span>
          </div>

          {/* Step indicator */}
          <StepDots step={step} />

          {/* ── ROLE STEP ── */}
          {step === "role" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <header>
                <h1 className="text-3xl font-black tracking-tight mb-2">Welcome.</h1>
                <p className="text-[var(--text-secondary)]">How do you want to use BulkBlitz?</p>
              </header>

              <div className="space-y-3">
                {ROLE_CARDS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => pickRole(c.key)}
                    className="group w-full text-left p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--primary)]/40 hover:bg-[var(--bg-elevated)] transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/12 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                        <c.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-base text-[var(--text-primary)]">{c.title}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--primary)]/12 text-[var(--primary)]">
                            {c.badge}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-2.5 leading-snug">{c.line}</p>
                        <ul className="flex flex-wrap gap-x-3 gap-y-1">
                          {c.points.map((p) => (
                            <li key={p} className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[var(--success)]" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center text-xs text-[var(--text-tertiary)]">
                You can switch later — one account, both roles.
              </p>
            </div>
          )}

          {/* ── PHONE STEP ── */}
          {step === "phone" && (
            <form onSubmit={sendOtp} className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <BackBtn onClick={() => setStep("role")} disabled={Boolean(initialIntent)} />
              <header>
                <h1 className="text-3xl font-black tracking-tight mb-2">
                  {intent === "seller" ? "Sell on BulkBlitz" : "Welcome to BulkBlitz"}
                </h1>
                <p className="text-[var(--text-secondary)]">
                  We'll send you a one-time code to verify your number.
                </p>
              </header>

              <label className="block">
                <span className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Mobile number
                </span>
                <div className="flex items-center h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] focus-within:border-[var(--primary)]/60 focus-within:ring-2 focus-within:ring-[var(--primary)]/20 transition-all">
                  <span className="pl-4 pr-2 text-sm font-medium text-[var(--text-secondary)] border-r border-[var(--border-default)]">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98xxxxxxxx"
                    className="flex-1 h-full bg-transparent px-3 text-base focus:outline-none placeholder-[var(--text-tertiary)]"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full h-12 rounded-xl bg-[var(--primary)] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(255,106,0,0.25)]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send code <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-center text-xs text-[var(--text-tertiary)]">
                By continuing you agree to our{" "}
                <Link href="/legal/terms" className="underline hover:text-[var(--text-secondary)]">Terms</Link> and{" "}
                <Link href="/legal/privacy" className="underline hover:text-[var(--text-secondary)]">Privacy Policy</Link>.
              </p>
            </form>
          )}

          {/* ── OTP STEP ── */}
          {step === "otp" && (
            <form onSubmit={verifyOtp} className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <BackBtn onClick={() => setStep("phone")} />
              <header>
                <h1 className="text-3xl font-black tracking-tight mb-2">Verify your number</h1>
                <p className="text-[var(--text-secondary)]">
                  Enter the 6-digit code sent to <span className="text-[var(--text-primary)] font-medium">+91 {phone}</span>
                  {sentSandbox && <span className="block text-xs text-[var(--accent-warning)] mt-1">Sandbox mode: use 123456</span>}
                </p>
              </header>

              <div className="flex gap-2 sm:gap-3" onPaste={onOtpPaste}>
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    inputMode="numeric"
                    type="text"
                    maxLength={1}
                    value={v}
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e) => onOtpKey(i, e)}
                    className="w-full h-12 sm:h-14 text-center text-xl font-bold rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all focus:outline-none"
                  />
                ))}
              </div>

              {/* Seller extras: business details */}
              {intent === "seller" && (
                <div className="space-y-3 pt-1 border-t border-[var(--border-default)] mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] pt-3">
                    Business details
                  </p>
                  <Field
                    placeholder="Business name (e.g. Rajesh Cotton Mills)"
                    value={biz.businessName}
                    onChange={(v) => setBiz((b) => ({ ...b, businessName: v }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      placeholder="City"
                      value={biz.city}
                      onChange={(v) => setBiz((b) => ({ ...b, city: v }))}
                    />
                    <select
                      value={biz.state}
                      onChange={(e) => setBiz((b) => ({ ...b, state: e.target.value }))}
                      className="h-11 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]/60"
                    >
                      <option value="">State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join("").length !== 6}
                className="w-full h-12 rounded-xl bg-[var(--primary)] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(255,106,0,0.25)]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & continue <ArrowRight className="w-4 h-4" /></>}
              </button>

              <div className="text-center text-sm">
                {timer > 0 ? (
                  <span className="text-[var(--text-tertiary)]">Resend code in <span className="text-[var(--text-secondary)] font-medium">{timer}s</span></span>
                ) : (
                  <button type="button" onClick={sendOtp} disabled={loading}
                    className="inline-flex items-center gap-1.5 text-[var(--primary)] font-medium hover:underline">
                    <RefreshCw className="w-3.5 h-3.5" /> Resend code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function StepDots({ step }) {
  const stepOrder = ["role", "phone", "otp"];
  const idx = stepOrder.indexOf(step);
  return (
    <div className="flex items-center gap-1.5 mb-7">
      {stepOrder.map((s, i) => (
        <span
          key={s}
          className={`h-1 rounded-full transition-all duration-500 ${
            i <= idx
              ? "bg-[var(--primary)] w-8"
              : "bg-[var(--border-default)] w-5"
          }`}
        />
      ))}
    </div>
  );
}

function BackBtn({ onClick, disabled = false }) {
  if (disabled) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors -mt-1"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );
}

function Field({ placeholder, value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
    />
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <AuthInner />
    </Suspense>
  );
}
