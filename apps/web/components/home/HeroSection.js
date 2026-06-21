'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Users, Factory, IndianRupee, Zap, ArrowRight } from 'lucide-react';
import Magnet from '../ui/Magnet';

// Dynamically import Three.js scene to prevent SSR issues
const HeroCubeScene = dynamic(() => import('../three/HeroCubeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-950/20 rounded-2xl border border-white/5 animate-pulse">
      <div className="text-neutral-500 font-display font-semibold text-sm">Initializing 3D Environment...</div>
    </div>
  ),
});

/* ─────────────────────────────────────────────
   Animated Number component
   ───────────────────────────────────────────── */
function AnimatedNumber({ value, duration = 2000 }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return displayed.toLocaleString('en-IN');
}

const STATS_CONFIG = [
  { icon: Users, key: 'totalBuyers', suffix: '+', prefix: '', label: 'Happy Buyers', color: '#FF6A00', fallback: 12400 },
  { icon: Factory, key: 'totalManufacturers', suffix: '+', prefix: '', label: 'Manufacturers', color: '#FF8C24', fallback: 340 },
  { icon: IndianRupee, key: 'totalSaved', suffix: '', prefix: '₹', label: 'Saved by Buyers', color: '#1DB954', fallback: 2800000 },
  { icon: Zap, key: 'activeBatches', suffix: '', prefix: '', label: 'Live Batches', color: '#FFB85C', fallback: 86 },
];

const STEPS = [
  {
    num: '01',
    color: '#FF6A00',
    title: 'Manufacturer Lists',
    desc: 'Verified manufacturers post products with tiered bulk pricing tiers.',
  },
  {
    num: '02',
    color: '#FF8C24',
    title: 'Buyers Join Batch',
    desc: 'Reserve your slot with a card hold — no upfront payment required.',
  },
  {
    num: '03',
    color: '#1DB954',
    title: 'Price Drops Live',
    desc: 'Every new buyer lowers the price for the entire batch in real time.',
  },
  {
    num: '04',
    color: '#FFB85C',
    title: 'Everyone Saves',
    desc: 'Batch closes, you pay the final lowest price. Direct from factory.',
  },
];

export default function HeroSection({ stats }) {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden flex flex-col justify-center bg-neutral-950 industrial-grid" id="hero-section">
      {/* Noise background overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Main Hero Container */}
      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left max-w-2xl">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 self-start rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-neutral-300 uppercase">Buy Together. Pay Less.</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black leading-none tracking-tight text-white animate-fade-in-up">
            The Crowd Buys. <br />
            <span className="text-primary">The Price Drops.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed animate-fade-in-up animate-delay-100">
            Join a batch. Pool with other buyers. Watch the price drop in real time.
            Get manufacturer-direct pricing — no middlemen, no minimum quantities.
          </p>

          {/* Live Console/Status Snapshot */}
          <div className="grid grid-cols-3 gap-px overflow-hidden border border-white/5 rounded-xl bg-neutral-900/40 backdrop-blur-md shadow-2xl animate-fade-in-up animate-delay-200">
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950/20 text-center">
              <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Live Drop</span>
              <strong className="mt-1 font-mono text-sm sm:text-base text-white">₹84 → ₹69</strong>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950/20 text-center">
              <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Next Unlock</span>
              <strong className="mt-1 font-mono text-sm sm:text-base text-white">12 buyers</strong>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950/20 text-center">
              <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Batch Pulse</span>
              <strong className="mt-1 font-mono text-sm sm:text-base text-primary">86 live</strong>
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

        {/* Right Column (Three.js 3D Scene) */}
        <div className="lg:col-span-5 h-[350px] sm:h-[450px] w-full relative flex items-center justify-center animate-fade-in-up animate-delay-200">
          <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent blur-3xl pointer-events-none" />
          <HeroCubeScene />
        </div>

      </div>

      {/* Stats Bar Container */}
      <div className="container mx-auto px-4 z-10 mt-16 animate-fade-in-up animate-delay-400">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 rounded-2xl border border-white/5 bg-neutral-900/30 backdrop-blur-lg shadow-2xl">
          {STATS_CONFIG.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="flex flex-col items-center md:items-start text-center md:text-left gap-2 p-3">
                <div className="p-3 rounded-xl bg-neutral-950/40 border border-white/5" style={{ color: stat.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                    {stat.prefix}
                    <AnimatedNumber value={stats?.[stat.key] ?? stat.fallback} />
                    {stat.suffix}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Section (How It Works) */}
      <div className="container mx-auto px-4 z-10 mt-28 animate-fade-in-up animate-delay-500" id="how-it-works">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">Workflow</span>
          <h2 className="text-3xl font-display font-black text-white">How BulkBlitz Works</h2>
          <p className="text-sm text-neutral-400 mt-2">Four simple steps to unlock factory wholesale pricing directly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="relative group p-6 rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md transition-all duration-300 hover:border-primary/25">
              <div className="absolute top-4 right-4 text-4xl font-mono font-black text-white/5 select-none">{step.num}</div>
              <div className="w-1.5 h-10 rounded-full mb-6" style={{ backgroundColor: step.color }} />
              <h3 className="text-lg font-bold text-white mb-2 font-display">{step.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
