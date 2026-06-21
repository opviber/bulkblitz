'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Users, Factory, IndianRupee, Zap, ArrowRight, Star, 
  Lock, Clock, Shield, Sparkles, Building2, Server, HelpCircle, Check
} from 'lucide-react';
import Magnet from '../ui/Magnet';

/* ─────────────────────────────────────────────
   Animated Count-Up Hook
   ───────────────────────────────────────────── */
function useCountUp(target, duration = 1500, inView) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
}

/* ─────────────────────────────────────────────
   Animated Stat Box Component
   ───────────────────────────────────────────── */
function AnimatedStat({ value, label, icon: Icon, color, suffix = '', prefix = '', fallback }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const targetValue = value || fallback;
  const count = useCountUp(targetValue, 1500, inView);

  // Custom formatting for large Indian figures (e.g. ₹1.85Cr)
  let formatted = count.toLocaleString('en-IN');
  if (prefix === '₹' && targetValue >= 10000000) {
    formatted = (count / 10000000).toFixed(2) + ' Cr';
  } else if (targetValue === 4.9) {
    formatted = '4.9';
  }

  return (
    <div ref={ref} className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 p-4 hover:bg-white/[0.01] transition-all duration-200 animate-fade-in-up">
      <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 shrink-0" style={{ color }}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight">
          {prefix}
          {formatted}
          {suffix}
        </span>
        <span className="text-xs text-neutral-400 font-medium">{label}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Simulated Live Dashboard Falling Price (Fallback)
   ───────────────────────────────────────────── */
function SimulatedDashboard() {
  const [simTime, setSimTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimTime((t) => (t + 0.1) % 20);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Frame values mapped to simTime (20s loop)
  let buyers = 12;
  let price = 299;
  let progress = 12;
  let statusText = "Batch Open — Join to drop price";
  let statusColor = "text-neutral-400";
  let isFull = false;

  if (simTime < 3) {
    // Frame 1
    buyers = 12;
    price = 299;
    progress = 12;
    statusText = "Batch Open — Join to drop price";
  } else if (simTime < 8) {
    // Frame 2
    const ratio = (simTime - 3) / 5;
    buyers = Math.floor(12 + ratio * 88);
    price = Math.floor(299 - ratio * 200);
    progress = Math.floor(12 + ratio * 88);
    statusText = "⚡ New buyers joining... dropping price!";
    statusColor = "text-orange-400";
  } else if (simTime < 12) {
    // Frame 3
    buyers = 100;
    price = 99;
    progress = 100;
    statusText = "🟢 BATCH FULL — Factory Price Locked!";
    statusColor = "text-green-400";
    isFull = true;
  } else if (simTime < 16) {
    // Frame 4
    buyers = 100;
    price = 99;
    progress = 100;
    statusText = "✨ Everyone pays ₹99! Saved ₹200/unit";
    statusColor = "text-green-400";
    isFull = true;
  } else {
    // Frame 5
    buyers = 12;
    price = 299;
    progress = 12;
    statusText = "Resetting simulation cycle...";
  }

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between bg-neutral-950/80 backdrop-blur-xl relative select-none font-sans text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(249,115,22,0.1),transparent_70%)] pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xs">📦</div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Live Batch #2891</span>
        </div>
        <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full border bg-neutral-900 ${isFull ? "text-green-400 border-green-500/30" : "text-orange-400 border-orange-500/30 animate-pulse"}`}>
          {isFull ? "Locked" : "Live Price Drop"}
        </span>
      </div>

      {/* Image Area Mock */}
      <div className="my-3 py-2 flex items-center justify-center rounded-xl bg-white/[0.01] border border-white/5 relative overflow-hidden h-28">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl filter drop-shadow-md">👕</span>
          <span className="text-[10px] font-bold text-neutral-400 mt-2">Organic Cotton Tees</span>
          <span className="text-[8px] text-neutral-600">MOQ: 100 units</span>
        </div>
        <div className="absolute bottom-2 right-2 text-[8px] bg-black/60 px-2 py-0.5 rounded border border-white/5 text-neutral-400 tabular-nums">
          ⏰ 04h 12m left
        </div>
      </div>

      {/* Main Metric: Price Drop */}
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Current price</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-mono font-black text-white transition-all duration-300">₹{price}</span>
            <span className="text-xs text-neutral-500 line-through font-mono">₹299</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Buyers joined</span>
          <span className="block text-lg font-mono font-black text-white mt-0.5 transition-all duration-300">{buyers}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full flex flex-col gap-1">
        <div className="relative h-2 w-full bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[8px] font-bold text-neutral-500 tracking-wider uppercase">
          <span>Tier 1 (12)</span>
          <span>Tier 2 (50)</span>
          <span>Factory direct (100)</span>
        </div>
      </div>

      {/* Simulation Feedback Alert */}
      <div className={`mt-3 py-2 px-3 rounded-lg border text-[10px] font-bold transition-all duration-300 text-center flex items-center justify-center gap-1.5 ${isFull ? "bg-green-500/10 border-green-500/25 " + statusColor : "bg-orange-500/10 border-orange-500/25 " + statusColor}`}>
        <span>{statusText}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step Visual Widgets for Workflow
   ───────────────────────────────────────────── */
function Step1Widget() {
  return (
    <div className="w-full p-4 rounded-xl border border-white/5 bg-neutral-950/80 font-sans text-left text-[10px]">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
        <div className="w-5 h-5 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">🏭</div>
        <div>
          <h4 className="font-bold text-white text-[11px] leading-none">Vercel Textiles</h4>
          <span className="text-[8px] text-neutral-500">Verified Manufacturer</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-neutral-400">
          <span>Cotton Crewnecks</span>
          <span className="font-mono font-bold text-white">MOQ: 100</span>
        </div>
        <div className="p-2 rounded bg-white/[0.01] border border-white/5 space-y-1.5">
          <div className="flex justify-between font-bold text-green-400">
            <span>1-20 units:</span>
            <span>₹299/unit</span>
          </div>
          <div className="flex justify-between text-neutral-600 font-bold">
            <span className="flex items-center gap-1">21-50 units <Lock className="w-2.5 h-2.5 text-neutral-750" /></span>
            <span>₹195/unit</span>
          </div>
          <div className="flex justify-between text-neutral-600 font-bold">
            <span className="flex items-center gap-1">51-100 units <Lock className="w-2.5 h-2.5 text-neutral-750" /></span>
            <span>₹99/unit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2Widget() {
  const [buyers, setBuyers] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setBuyers((b) => (b % 4) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const progress = buyers === 1 ? 25 : buyers === 2 ? 50 : buyers === 3 ? 75 : 100;
  const avatars = ['👨‍💻', '👩‍💼', '👩‍🎨', '👨‍🚀'];

  return (
    <div className="w-full p-4 rounded-xl border border-white/5 bg-neutral-950/80 font-sans text-left text-[10px] space-y-3">
      <div className="flex items-center justify-between font-bold">
        <span className="text-white">Active batch pool</span>
        <span className="text-orange-400 animate-pulse">{buyers} Joining...</span>
      </div>
      <div className="relative h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-orange-500 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex -space-x-1.5">
          {avatars.slice(0, buyers).map((av, idx) => (
            <div key={idx} className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center text-[9px] animate-scale-in">
              {av}
            </div>
          ))}
        </div>
        <span className="text-[9px] font-bold text-neutral-400">Card hold authorized 🔒</span>
      </div>
    </div>
  );
}

function Step3Widget() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const prices = [299, 240, 165, 99];
  const activePrice = prices[frame];

  return (
    <div className="w-full p-4 rounded-xl border border-white/5 bg-neutral-950/80 font-sans text-left text-[10px] flex flex-col justify-between h-28">
      <div className="flex items-center justify-between text-neutral-500 font-bold uppercase tracking-wider">
        <span>Dynamic Price Ticker</span>
        <span className="text-green-400">Dropping live</span>
      </div>
      <div className="my-auto flex items-center justify-center h-12 overflow-hidden relative">
        <div className="text-2xl font-mono font-black text-[var(--color-brand)] animate-fade-in-up" key={activePrice}>
          ₹{activePrice}
        </div>
      </div>
      <div className="flex justify-between text-neutral-500 border-t border-white/5 pt-1.5 text-[8px] uppercase tracking-wider font-bold">
        <span>Initial: ₹299</span>
        <span className="text-orange-400">Current Deal: -{Math.floor(((299 - activePrice) / 299) * 100)}%</span>
      </div>
    </div>
  );
}

function Step4Widget() {
  return (
    <div className="w-full p-4 rounded-xl border border-white/5 bg-neutral-950/80 font-sans text-left text-[10px] space-y-2">
      <div className="flex items-center gap-1.5 text-neutral-400 font-bold uppercase tracking-wider border-b border-white/5 pb-1.5">
        <span>🧾 Saved Receipt</span>
      </div>
      <div className="space-y-1 font-mono text-[9px]">
        <div className="flex justify-between text-neutral-500">
          <span>Initial Hold:</span>
          <span>₹299.00</span>
        </div>
        <div className="flex justify-between text-white font-bold border-b border-white/5 pb-1">
          <span>Final Price Locked:</span>
          <span>₹99.00</span>
        </div>
        <div className="flex justify-between text-green-400 font-extrabold pt-1 text-[10px]">
          <span>Cash Refunded:</span>
          <span className="animate-pulse">₹200.00 Saved</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ stats }) {
  const [videoFailed, setVideoFailed] = useState(false);

  const STATS_CONFIG = [
    { icon: Users, key: 'totalBuyers', suffix: '+', prefix: '', label: 'Happy Buyers', color: '#F97316', fallback: 48500 },
    { icon: Factory, key: 'totalManufacturers', suffix: '+', prefix: '', label: 'Manufacturers', color: '#3B82F6', fallback: 320 },
    { icon: IndianRupee, key: 'totalSaved', suffix: '', prefix: '₹', label: 'Saved by Buyers', color: '#22C55E', fallback: 18500000 },
    { icon: Zap, key: 'activeBatches', suffix: '', prefix: '', label: 'Live Batches', color: '#EAB308', fallback: 142 },
    { icon: Star, key: 'rating', suffix: ' ★', prefix: '', label: 'Platform Rating', color: '#F97316', fallback: 4.9 },
  ];

  const STEPS = [
    {
      num: 'Step 01',
      title: 'Manufacturer Lists',
      desc: 'Verified manufacturers post batch listings with volume-based bulk pricing tiers.',
      widget: <Step1Widget />,
    },
    {
      num: 'Step 02',
      title: 'Buyers Join Batch',
      desc: 'Reserve your desired quantities with a secure escrow hold. Card not charged yet.',
      widget: <Step2Widget />,
    },
    {
      num: 'Step 03',
      title: 'Price Drops Live',
      desc: 'Every new buyer reservation shifts the whole pool toward the next price milestone in real time.',
      widget: <Step3Widget />,
    },
    {
      num: 'Step 04',
      title: 'Everyone Saves',
      desc: 'Once the batch target finishes, everyone receives the final lowest unlocked factory rate.',
      widget: <Step4Widget />,
    },
  ];

  return (
    <section className="relative min-h-screen pt-20 pb-16 overflow-hidden flex flex-col justify-center bg-neutral-950 industrial-grid" id="hero-section">
      {/* Noise background overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Main Hero Container */}
      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left max-w-2xl">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 self-start rounded-full border border-white/5 bg-white/5 backdrop-blur-md animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-neutral-300 uppercase">Buy Together. Pay Less.</span>
          </div>

          {/* Headline */}
          <h1 className="flex flex-col gap-1.5 animate-fade-in-up select-none">
            <span className="hero-headline-line1 font-display text-[clamp(2.5rem,5vw,4.25rem)] font-black tracking-[-0.04em] leading-none text-white animate-fade-in-up">The Crowd Buys.</span>
            <span className="hero-headline-line2 font-display text-[clamp(2.5rem,5vw,4.25rem)] font-black tracking-[-0.04em] leading-none text-[var(--color-brand)] animate-fade-in-up animate-delay-100">The Price Drops.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed animate-fade-in-up animate-delay-100">
            Pool demand directly with other buyers. Watch target pricing thresholds shatter in real time. Unlock factory-level wholesale pricing with zero middlemen.
          </p>

          {/* Live Status Snapshot */}
          <div className="hero-stats-bar bg-[#111113] border border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up animate-delay-200">
            <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 text-center">
              <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Live Drop</span>
              <strong className="mt-1 font-mono text-sm sm:text-base text-white">₹299 → ₹99</strong>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 text-center">
              <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Next Unlock</span>
              <strong className="mt-1 font-mono text-sm sm:text-base text-white">8 slots</strong>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Batch Pulse</span>
              <strong className="mt-1 font-mono text-sm sm:text-base text-[var(--color-brand)]">142 live</strong>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-in-up animate-delay-300">
            <Magnet padding={15}>
              <a href="#batches" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-primary-new font-bold text-sm">
                Browse Live Batches
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </Magnet>
            <Magnet padding={15}>
              <a href="#how-it-works" className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl btn-secondary-new font-bold text-sm">
                How It Works
              </a>
            </Magnet>
          </div>
        </div>

        {/* Right Column (Hyperframe Video with Fallback) */}
        <div className="lg:col-span-5 w-full flex items-center justify-center animate-fade-in-up animate-delay-200">
          <div className="hero-demo-wrapper relative w-full max-w-[480px] h-[320px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            {!videoFailed ? (
              <>
                <video
                  src="/videos/bulkblitz-demo.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="hero-demo-video w-full h-full object-cover"
                  onError={() => setVideoFailed(true)}
                />
                <div className="hero-demo-overlay absolute bottom-4 right-4 bg-[#09090b]/85 backdrop-blur-md border border-white/5 rounded-xl p-2.5 flex flex-col gap-0.5">
                  <span className="overlay-label text-[9px] font-bold tracking-widest text-neutral-400 uppercase">FACTORY PRICE</span>
                  <span className="dropping-live text-xs font-bold text-[var(--color-live)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-live)] animate-pulse" />
                    Dropping Live
                  </span>
                </div>
              </>
            ) : (
              <SimulatedDashboard />
            )}
          </div>
        </div>

      </div>

      {/* Stats Bar Container (Scroll Animated) */}
      <div className="container mx-auto px-4 z-10 mt-16 animate-fade-in-up animate-delay-400">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 rounded-2xl border border-white/5 bg-[#111113] backdrop-blur-lg shadow-2xl">
          {STATS_CONFIG.map((stat) => (
            <AnimatedStat
              key={stat.key}
              value={stats?.[stat.key]}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
              suffix={stat.suffix}
              prefix={stat.prefix}
              fallback={stat.fallback}
            />
          ))}
        </div>
      </div>

      {/* Trust Bar Element */}
      <div className="container mx-auto px-4 z-10 mt-8 animate-fade-in-up animate-delay-400">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 py-3 px-6 rounded-xl border border-white/[0.03] bg-neutral-900/20 backdrop-blur-md text-neutral-400 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-[var(--color-brand)]" />
            <span>GST Verified Manufacturers</span>
          </div>
          <span className="hidden md:inline text-neutral-800">•</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-[var(--color-brand)]" />
            <span>Escrow Protected Payments</span>
          </div>
          <span className="hidden md:inline text-neutral-800">•</span>
          <div className="flex items-center gap-2">
            <Server className="w-4.5 h-4.5 text-[var(--color-brand)]" />
            <span>100% India Hosted & Secure</span>
          </div>
        </div>
      </div>

      {/* Timeline Section (How It Works) */}
      <div className="container mx-auto px-4 z-10 mt-28 animate-fade-in-up animate-delay-500" id="how-it-works">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-brand)] uppercase mb-2">Workflow</span>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">How BulkBlitz Works</h2>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">Four simple steps to unlock factory-direct wholesale pricing by pooling demand together.</p>
        </div>

        {/* Alternating layout for desktop / Stacked layout for mobile */}
        <div className="space-y-16 max-w-4xl mx-auto">
          {STEPS.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={step.num} 
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  isEven ? '' : 'md:flex-row-reverse'
                }`}
              >
                {/* Visual Widget Pane */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 rounded-2xl border border-white/5 bg-[#111113]/30 backdrop-blur-md shadow-xl hover:border-[var(--color-brand)]/20 transition-all duration-300">
                  {step.widget}
                </div>

                {/* Text Content Pane */}
                <div className="w-full md:w-1/2 text-left space-y-4">
                  <div className="step-pill inline-flex items-center gap-1.5 bg-[var(--color-brand-dim)] border border-[var(--color-brand)]/20 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-[var(--color-brand)] uppercase">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-display font-black text-white tracking-tight">{step.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
