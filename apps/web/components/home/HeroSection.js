'use client';

import { useEffect, useState } from 'react';
import Magnet from '../ui/Magnet';

/* ─────────────────────────────────────────────
   Animated Number — counts up from 0 to value
───────────────────────────────────────────── */
function AnimatedNumber({ value, duration = 2200 }) {
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

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const STATS_CONFIG = [
  { icon: '👥', key: 'totalBuyers',        suffix: '+', prefix: '',  label: 'Happy Buyers',    color: '#3B82F6', fallback: 12400   },
  { icon: '🏭', key: 'totalManufacturers', suffix: '+', prefix: '',  label: 'Manufacturers',   color: '#A78BFA', fallback: 340     },
  { icon: '💰', key: 'totalSaved',          suffix: '',  prefix: '₹', label: 'Saved by Buyers', color: '#34D399', fallback: 2800000 },
  { icon: '⚡', key: 'activeBatches',       suffix: '',  prefix: '',  label: 'Live Batches',    color: '#FBBF24', fallback: 86      },
];

const STEPS = [
  {
    num: '01',
    color: '#3B82F6',
    title: 'Manufacturer Lists',
    desc: 'Verified manufacturers post products with tiered bulk pricing tiers.',
  },
  {
    num: '02',
    color: '#A78BFA',
    title: 'Buyers Join Batch',
    desc: 'Reserve your slot with a card hold — no upfront payment required.',
  },
  {
    num: '03',
    color: '#34D399',
    title: 'Price Drops Live',
    desc: 'Every new buyer lowers the price for the entire batch in real time.',
  },
  {
    num: '04',
    color: '#FBBF24',
    title: 'Everyone Saves',
    desc: 'Batch closes, you pay the final lowest price. Direct from factory.',
  },
];

/* ─────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────── */
export default function HeroSection({ stats }) {
  return (
    <section className="hero" id="hero-section">

      {/* ── Animated Background ── */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid">
          <div className="hero__grid-inner" />
        </div>
      </div>

      <div className="container hero__container">

        {/* ── Badge ── */}
        <div className="hero__badge animate-fade-in">
          <span className="hero__badge-live">
            <span className="hero__badge-dot" />
            LIVE
          </span>
          <span className="hero__badge-divider" />
          <span className="hero__badge-text">🇮🇳 India&apos;s First Group-Buy Manufacturing Platform</span>
        </div>

        {/* ── Headline ── */}
        <h1 className="hero__headline animate-fade-in-up">
          <span className="hero__line hero__line--1">
            The Crowd Buys.
          </span>
          <span className="hero__line hero__line--2">
            <span className="hero__gradient-text">The Price Drops.</span>
          </span>
        </h1>

        {/* ── Subheadline ── */}
        <p className="hero__sub animate-fade-in-up animate-delay-200">
          Join a batch. Pool with other buyers. Watch the price drop in real time.
          Get manufacturer-direct pricing — no middlemen, no minimum quantities.
        </p>

        <div className="hero__market-console animate-fade-in-up animate-delay-300" aria-label="Live marketplace snapshot">
          <div className="hero__console-cell">
            <span className="hero__console-label">Live drop</span>
            <strong>₹84 → ₹69</strong>
          </div>
          <div className="hero__console-cell">
            <span className="hero__console-label">Next unlock</span>
            <strong>12 buyers</strong>
          </div>
          <div className="hero__console-cell hero__console-cell--accent">
            <span className="hero__console-label">Batch pulse</span>
            <strong>86 live</strong>
          </div>
        </div>

        {/* ── CTA Buttons ── */}
        <div className="hero__ctas animate-fade-in-up animate-delay-400">
          <Magnet padding={20}>
            <a href="#batches" className="hero__btn hero__btn--primary">
              Browse Live Batches
              <svg
                className="hero__btn-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </Magnet>
          <Magnet padding={20}>
            <a href="#how-it-works" className="hero__btn hero__btn--secondary">
              How It Works
            </a>
          </Magnet>
        </div>

        {/* ── Stats Bar ── */}
        <div className="hero__stats animate-fade-in-up animate-delay-500">
          {STATS_CONFIG.map((s) => (
            <div key={s.key} className="hero__stat">
              <div
                className="hero__stat-icon"
                style={{ '--stat-color': s.color }}
                aria-hidden="true"
              >
                {s.icon}
              </div>
              <div className="hero__stat-body">
                <span className="hero__stat-value">
                  {s.prefix}
                  <AnimatedNumber value={stats?.[s.key] ?? s.fallback} />
                  {s.suffix}
                </span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── How It Works ── */}
        <div
          className="hero__hiw animate-fade-in-up animate-delay-600"
          id="how-it-works"
        >
          <p className="hero__hiw-label">How it works</p>
          <div className="hero__steps">
            {STEPS.map((step, i) => (
              <div key={step.num} className="hero__step-wrapper">
                <div
                  className="hero__step"
                  style={{ '--step-color': step.color }}
                >
                  <div className="hero__step-num-box">
                    {step.num}
                  </div>
                  <h3 className="hero__step-title">{step.title}</h3>
                  <p className="hero__step-desc">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hero__step-arrow" aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════
          Styles
      ══════════════════════════════════════════ */}
      <style jsx>{`

        /* ── Section shell ── */
        .hero {
          position: relative;
          min-height: 100vh;
          padding: calc(64px + var(--space-16)) 0 var(--space-16);
          overflow: hidden;
          display: flex;
          align-items: center;
          isolation: isolate;
          background:
            radial-gradient(circle at 82% 24%, rgba(255, 107, 0, 0.16), transparent 28%),
            radial-gradient(circle at 22% 78%, rgba(255, 255, 255, 0.05), transparent 26%),
            linear-gradient(135deg, #050505 0%, #121212 48%, #080808 100%);
        }

        /* ── Background layer ── */
        .hero__bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        /* Dot grid */
        .hero__grid {
          position: absolute;
          inset: 0;
        }

        .hero__grid-inner {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, var(--border-default) 1px, transparent 1px);
          background-size: 34px 34px;
          opacity: 0.42;
          mask-image: linear-gradient(90deg, black 0%, black 54%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, black 0%, black 54%, transparent 100%);
        }

        /* ── Container ── */
        .hero__container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
          width: 100%;
          min-height: calc(100vh - 128px);
        }

        /* ── Badge ── */
        .hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px 6px 8px;
          background: rgba(15, 15, 15, 0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          margin-bottom: var(--space-6);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: border-color var(--transition-base);
          box-shadow: var(--shadow-premium);
        }

        .hero__badge:hover {
          border-color: var(--accent-primary);
        }

        .hero__badge-live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(52, 211, 153, 0.12);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: var(--radius-full);
          padding: 2px 9px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #34D399;
        }

        .hero__badge-dot {
          width: 6px;
          height: 6px;
          background: #34D399;
          border-radius: 50%;
          animation: pulseSoft 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }

        .hero__badge-divider {
          width: 1px;
          height: 16px;
          background: var(--border-default);
          flex-shrink: 0;
        }

        .hero__badge-text {
          padding-right: 6px;
        }

        /* ── Headline ── */
        .hero__headline {
          font-family: var(--font-heading), sans-serif;
          max-width: 900px;
          font-size: clamp(3rem, 7vw, 6.35rem);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.03em;
          margin: 0 auto var(--space-6);
          color: #ffffff;
          text-wrap: balance;
        }

        .hero__line {
          display: block;
        }

        .hero__line--1 {
          color: #ffffff;
        }

        .hero__gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #fed7aa 38%, #ff6b00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Subheadline ── */
        .hero__sub {
          max-width: 560px;
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: var(--text-secondary);
          line-height: 1.75;
          margin: 0 auto var(--space-8);
          font-family: var(--font-body), sans-serif;
        }

        .hero__market-console {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          width: min(680px, 100%);
          margin: 0 auto var(--space-8);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-xl);
          background: rgba(18, 18, 18, 0.72);
          box-shadow: var(--shadow-premium);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .hero__console-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-4) var(--space-5);
          background: rgba(255, 255, 255, 0.025);
          min-width: 0;
        }

        .hero__console-label {
          font-size: 0.68rem;
          color: var(--text-tertiary);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .hero__console-cell strong {
          margin-top: 3px;
          font-family: var(--font-heading), sans-serif;
          color: var(--text-primary);
          font-size: clamp(1rem, 2vw, 1.32rem);
          font-weight: 900;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .hero__console-cell--accent strong {
          color: var(--accent-success);
        }

        /* ── CTA Buttons ── */
        .hero__ctas {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: var(--space-10);
        }

        .hero__btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: var(--radius-xl);
          font-family: var(--font-body), sans-serif;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
          white-space: nowrap;
        }

        .hero__btn--primary {
          background: linear-gradient(135deg, #FF6B00, #B34B00);
          color: #ffffff;
          border: none;
          box-shadow: 0 12px 34px rgba(255, 107, 0, 0.3);
        }

        .hero__btn--primary:hover {
          background: linear-gradient(135deg, #FF8533, #CC5200);
          box-shadow: 0 14px 38px rgba(255, 107, 0, 0.36);
          transform: translateY(-2px);
          color: #ffffff;
        }

        .hero__btn-arrow {
          transition: transform var(--transition-base);
          flex-shrink: 0;
        }

        .hero__btn--primary:hover .hero__btn-arrow {
          transform: translateX(3px);
        }

        .hero__btn--secondary {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .hero__btn--secondary:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 107, 0, 0.16);
        }

        /* ── Stats Bar ── */
        .hero__stats {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 820px;
          width: 100%;
          background: rgba(18, 18, 18, 0.74);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-2xl);
          padding: var(--space-5) var(--space-6);
          margin: 0 auto var(--space-14);
          gap: var(--space-4) 0;
        }

        .hero__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-6);
          flex: 1;
          min-width: 160px;
          justify-content: center;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero__stat:first-child {
          border-left: none;
        }

        .hero__stat-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--stat-color) 14%, transparent);
          border: 1px solid color-mix(in srgb, var(--stat-color) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          transition: transform var(--transition-base);
        }

        .hero__stat:hover .hero__stat-icon {
          transform: scale(1.12);
        }

        .hero__stat-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .hero__stat-value {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
          line-height: 1.1;
        }

        .hero__stat-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .hero__stats {
            gap: var(--space-1);
            padding: var(--space-4) var(--space-3);
            border-radius: var(--radius-xl);
          }

          .hero__stat {
            padding: var(--space-3) var(--space-3);
            min-width: 140px;
            flex: 0 0 calc(50% - var(--space-2));
            border-left: none;
          }

          .hero__stat-value {
            font-size: 1.25rem;
          }
        }

        /* ── How It Works ── */
        .hero__hiw {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-5);
          width: 100%;
          max-width: 940px;
          margin: 0 auto;
        }

        .hero__hiw-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
          margin: 0;
        }

        .hero__steps {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 0;
          width: 100%;
        }

        .hero__step-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .hero__step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-5) var(--space-4);
          background: rgba(18, 18, 18, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          text-align: center;
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
          cursor: default;
        }

        .hero__step:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-primary);
        }

        .hero__step-num-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--step-color);
          background: var(--bg-elevated);
          color: var(--step-color);
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          transition: background var(--transition-base), box-shadow var(--transition-base);
        }

        .hero__step:hover .hero__step-num-box {
          background: color-mix(in srgb, var(--step-color) 12%, var(--bg-elevated));
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--step-color) 12%, transparent);
        }

        .hero__step-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .hero__step-desc {
          font-size: 0.78rem;
          color: var(--text-tertiary);
          margin: 0;
          line-height: 1.6;
        }

        /* Arrow connectors between cards */
        .hero__step-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          padding: 0 var(--space-4);
          flex-shrink: 0;
          opacity: 0.5;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {

          .hero__steps {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-3);
          }

          .hero__step-wrapper {
            flex: unset;
          }

          .hero__step-arrow {
            display: none;
          }

          .hero__step {
            flex: unset;
            width: 100%;
          }

          .hero__hiw {
            max-width: 100%;
          }

          .hero__badge-text {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero {
            padding: calc(64px + var(--space-10)) 0 var(--space-10);
          }

          .hero__headline {
            letter-spacing: -0.03em;
          }

          .hero__market-console {
            grid-template-columns: 1fr;
            width: 100%;
          }

          .hero__console-cell {
            align-items: center;
            text-align: center;
          }

          .hero__ctas {
            flex-direction: column;
            gap: var(--space-3);
          }

          .hero__btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* ── Animation delay utilities ── */
        .animate-delay-200 {
          animation-delay: 200ms;
          animation-fill-mode: both;
        }

        .animate-delay-300 {
          animation-delay: 300ms;
          animation-fill-mode: both;
        }

        .animate-delay-400 {
          animation-delay: 400ms;
          animation-fill-mode: both;
        }

        .animate-delay-500 {
          animation-delay: 500ms;
          animation-fill-mode: both;
        }

        .animate-delay-600 {
          animation-delay: 600ms;
          animation-fill-mode: both;
        }

      `}</style>
    </section>
  );
}
