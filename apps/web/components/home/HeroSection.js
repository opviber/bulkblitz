"use client";

import { useEffect, useState } from "react";

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

  return displayed.toLocaleString("en-IN");
}

export default function HeroSection({ stats }) {
  return (
    <section className="hero" id="hero-section">
      {/* Animated Background */}
      <div className="hero__bg">
        <div className="hero__gradient-orb hero__gradient-orb--1"></div>
        <div className="hero__gradient-orb hero__gradient-orb--2"></div>
        <div className="hero__gradient-orb hero__gradient-orb--3"></div>
        <div className="hero__grid-pattern"></div>
      </div>

      <div className="container hero__container">
        {/* Badge */}
        <div className="hero__badge animate-fade-in">
          <span className="hero__badge-dot"></span>
          India&apos;s First Group-Buy Manufacturing Platform
        </div>

        {/* Headline */}
        <h1 className="hero__headline animate-fade-in-up">
          <span className="hero__headline-line">The Crowd Buys.</span>
          <span className="hero__headline-line">
            The Price{" "}
            <span className="hero__headline-accent">Drops.</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero__subheadline animate-fade-in-up animate-delay-200">
          Join a batch. Pool with other buyers. Watch the price drop in real
          time. Get manufacturer-direct pricing without buying in bulk alone.
        </p>

        {/* CTAs */}
        <div className="hero__ctas animate-fade-in-up animate-delay-300">
          <a href="#batches" className="btn btn--primary btn--lg hero__cta-primary">
            Browse Live Batches
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#how-it-works" className="btn btn--secondary btn--lg hero__cta-secondary">
            How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="hero__stats animate-fade-in-up animate-delay-400">
          <div className="hero__stat">
            <span className="hero__stat-value">
              <AnimatedNumber value={stats?.totalBuyers || 12400} />+
            </span>
            <span className="hero__stat-label">Happy Buyers</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">
              <AnimatedNumber value={stats?.totalManufacturers || 340} />+
            </span>
            <span className="hero__stat-label">Manufacturers</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">
              ₹<AnimatedNumber value={stats?.totalSaved || 2800000} />
            </span>
            <span className="hero__stat-label">Saved by Buyers</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">
              <AnimatedNumber value={stats?.activeBatches || 86} />
            </span>
            <span className="hero__stat-label">Live Batches</span>
          </div>
        </div>

        {/* How it Works Mini */}
        <div className="hero__how-it-works animate-fade-in-up animate-delay-500" id="how-it-works">
          <div className="hero__step">
            <div className="hero__step-number">1</div>
            <div className="hero__step-content">
              <h3 className="hero__step-title">Manufacturer Lists</h3>
              <p className="hero__step-desc">
                Products with tiered bulk pricing
              </p>
            </div>
          </div>
          <div className="hero__step-arrow">→</div>
          <div className="hero__step">
            <div className="hero__step-number hero__step-number--2">2</div>
            <div className="hero__step-content">
              <h3 className="hero__step-title">Buyers Join</h3>
              <p className="hero__step-desc">
                Reserve a slot with card hold
              </p>
            </div>
          </div>
          <div className="hero__step-arrow">→</div>
          <div className="hero__step">
            <div className="hero__step-number hero__step-number--3">3</div>
            <div className="hero__step-content">
              <h3 className="hero__step-title">Price Drops</h3>
              <p className="hero__step-desc">
                More buyers = lower price for everyone
              </p>
            </div>
          </div>
          <div className="hero__step-arrow">→</div>
          <div className="hero__step">
            <div className="hero__step-number hero__step-number--4">4</div>
            <div className="hero__step-content">
              <h3 className="hero__step-title">Everyone Saves</h3>
              <p className="hero__step-desc">
                Pay the final lowest price reached
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          padding: calc(64px + var(--space-12)) 0 var(--space-12);
          overflow: hidden;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        .hero__bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .hero__gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
        }

        .hero__gradient-orb--1 {
          width: 500px;
          height: 500px;
          background: var(--accent-primary);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .hero__gradient-orb--2 {
          width: 400px;
          height: 400px;
          background: var(--accent-premium);
          bottom: -50px;
          left: -100px;
          animation-delay: -3s;
        }

        .hero__gradient-orb--3 {
          width: 300px;
          height: 300px;
          background: var(--accent-success);
          top: 50%;
          left: 50%;
          animation-delay: -5s;
        }

        .hero__grid-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            var(--border-default) 1px,
            transparent 1px
          );
          background-size: 40px 40px;
          opacity: 0.4;
        }

        .hero__container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .hero__badge-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-success);
          border-radius: 50%;
          animation: pulseSoft 1.5s ease-in-out infinite;
        }

        .hero__headline {
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 var(--space-6);
          color: var(--text-primary);
        }

        .hero__headline-line {
          display: block;
        }

        .hero__headline-accent {
          background: linear-gradient(135deg, #10B981, #0D6EFD);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero__subheadline {
          max-width: 600px;
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0 0 var(--space-8);
        }

        .hero__ctas {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: var(--space-10);
        }

        .hero__cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero__stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-6);
          padding: var(--space-6) var(--space-8);
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-12);
        }

        .hero__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 var(--space-4);
        }

        .hero__stat-value {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }

        .hero__stat-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 500;
          margin-top: 2px;
        }

        .hero__stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-default);
        }

        @media (max-width: 640px) {
          .hero__stat-divider {
            display: none;
          }
          .hero__stats {
            gap: var(--space-4);
            padding: var(--space-4) var(--space-5);
          }
        }

        /* How it Works Steps */
        .hero__how-it-works {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
          gap: var(--space-4);
          width: 100%;
          max-width: 900px;
        }

        .hero__step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          flex: 1;
          min-width: 140px;
          max-width: 180px;
        }

        .hero__step-number {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--accent-primary);
          color: white;
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero__step-number--2 {
          background: var(--accent-premium);
        }

        .hero__step-number--3 {
          background: var(--accent-success);
        }

        .hero__step-number--4 {
          background: linear-gradient(135deg, #0D6EFD, #10B981);
        }

        .hero__step-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }

        .hero__step-desc {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin: 0;
          line-height: 1.5;
          text-align: center;
        }

        .hero__step-arrow {
          color: var(--text-tertiary);
          font-size: 1.2rem;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .hero__step-arrow {
            display: none;
          }
          .hero__how-it-works {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-5);
          }
          .hero__step {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
