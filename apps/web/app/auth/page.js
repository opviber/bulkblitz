"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Loader2, RefreshCw, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";

export default function AuthPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const otpRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null),
  ];

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send OTP");
      setOtpSent(true);
      setTimer(30);
      toast.success(data.sandbox ? "OTP sent (dev code: 123456)" : "OTP sent");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const pin = otp.join("");
    if (pin.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const ref =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("ref")
          : null;
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, token: pin, referralCode: ref || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      toast.success("Welcome to BulkBlitz!");
      const next =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      router.push(next || "/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleResend = async () => {
    setTimer(30);
    try {
      await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      toast.success("OTP resent");
    } catch {
      toast.error("Could not resend OTP");
    }
  };

  const handleSocialLogin = (provider) => {
    // Social login is handled by Supabase OAuth redirect in production.
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (base) {
      window.location.href = `${base}/auth/v1/authorize?provider=${provider.toLowerCase()}&redirect_to=${encodeURIComponent(
        window.location.origin + "/auth/callback"
      )}`;
    } else {
      toast.message(`${provider} login requires Supabase configuration`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-black text-white font-sans">
      
      {/* Left Column: Form */}
      <div className="flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:p-24 relative overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 border-r border-white/5">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Top: Logo */}
        <div className="relative z-10 flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-8 h-8 transition-transform group-hover:scale-110 duration-300" />
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-primary bg-clip-text text-transparent">
              BulkBlitz
            </span>
          </Link>
          <Link href="/" className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        {/* Center: Dynamic Forms Container */}
        <div className="relative z-10 my-auto max-w-md w-full mx-auto">
          {!otpSent ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                  Verify Phone Number
                </h2>
                <p className="text-sm text-neutral-400">
                  Enter your phone number to sign in or create an account instantly.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-semibold text-neutral-400 select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-14 pr-4 font-semibold text-lg text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Separator */}
              <div className="flex items-center my-6 text-xs text-neutral-500 font-bold uppercase tracking-widest before:content-[''] before:flex-1 before:border-b before:border-white/5 before:mr-4 after:content-[''] after:flex-1 after:border-b after:border-white/5 after:ml-4">
                or continue with
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all cursor-pointer"
                  disabled={loading}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all cursor-pointer"
                  disabled={loading}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                  Verify Code
                </h2>
                <p className="text-sm text-neutral-400">
                  Enter the 6-digit code sent to +91 {phoneNumber.replace(/(\d{5})(\d{5})/, "$1-$2")}.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-16 w-full text-center text-2xl font-extrabold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 4}
                  className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Verify & Proceed</span>
                  )}
                </button>

                <div className="flex justify-between items-center text-xs">
                  {timer > 0 ? (
                    <span className="text-neutral-400">
                      Resend OTP in <strong className="text-white">{timer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-primary hover:text-primary-hover font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Resend Code
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Edit Phone Number
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom: Terms */}
        <div className="relative z-10 mt-12 text-center">
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
            By proceeding, you agree to BulkBlitz&apos;s{" "}
            <Link href="#" className="text-neutral-400 hover:text-white underline transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-neutral-400 hover:text-white underline transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right Column: Decorative Banner */}
      <div className="hidden lg:flex flex-col justify-center p-16 relative overflow-hidden bg-gradient-to-tr from-black via-neutral-950 to-neutral-900 border-l border-white/5">
        
        {/* Neon Orbs */}
        <div className="absolute top-[-100px] right-[-50px] w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[-50px] w-72 h-72 rounded-full bg-orange-600/10 blur-[80px]" />
        
        <div className="relative z-10 max-w-md space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary tracking-wide uppercase mb-4">
              🚀 Bulk Price Revolution
            </span>
            <h1 className="text-5xl font-black tracking-tight text-white leading-none">
              bulk up.<br />
              price down.
            </h1>
          </div>

          <p className="text-lg text-neutral-400 leading-relaxed">
            Join the crowd. Drop the price. Unlock wholesale pricing directly from verified manufacturers.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
              <span className="block text-2xl font-black text-white bg-gradient-to-r from-white to-primary bg-clip-text text-transparent mb-1">
                ₹24.8L+
              </span>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Total Saved
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
              <span className="block text-2xl font-black text-white bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent mb-1">
                12.5k+
              </span>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Active Buyers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
