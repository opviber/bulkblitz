"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/utils";

export default function LiveTimer({ endTime }) {
  const [time, setTime] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const isUrgent = time.hours < 6;

  return (
    <div className={`live-timer ${isUrgent ? "live-timer--urgent" : ""}`}>
      <div className="live-timer__segment">
        <span className="live-timer__value">{String(time.hours).padStart(2, "0")}</span>
        <span className="live-timer__label">Hours</span>
      </div>
      <span className="live-timer__sep">:</span>
      <div className="live-timer__segment">
        <span className="live-timer__value">{String(time.minutes).padStart(2, "0")}</span>
        <span className="live-timer__label">Min</span>
      </div>
      <span className="live-timer__sep">:</span>
      <div className="live-timer__segment">
        <span className="live-timer__value">{String(time.seconds).padStart(2, "0")}</span>
        <span className="live-timer__label">Sec</span>
      </div>

      <style jsx>{`
        .live-timer { display: flex; align-items: center; gap: var(--space-2); }
        .live-timer--urgent .live-timer__value { color: var(--accent-warning); animation: urgencyPulse 2s ease-in-out infinite; }
        .live-timer__segment { display: flex; flex-direction: column; align-items: center; min-width: 48px; padding: var(--space-2) var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); }
        .live-timer__value { font-family: var(--font-heading), sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--text-primary); font-variant-numeric: tabular-nums; line-height: 1; }
        .live-timer__label { font-size: 0.6rem; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
        .live-timer__sep { font-size: 1.2rem; font-weight: 700; color: var(--text-tertiary); margin-top: -10px; }
      `}</style>
    </div>
  );
}
