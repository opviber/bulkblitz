"use client";

import { useRef, useState, useEffect } from "react";

export default function Magnet({ children, strength = 3, padding = 80 }) {
  const elementRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      // Distance from mouse coordinates to element center
      const distanceX = e.clientX - elCenterX;
      const distanceY = e.clientY - elCenterY;
      const distance = Math.hypot(distanceX, distanceY);

      // Capture zone radius based on padding
      const maxDistance = Math.max(rect.width, rect.height) / 2 + padding;

      if (distance < maxDistance) {
        setActive(true);
        setPosition({
          x: distanceX / strength,
          y: distanceY / strength,
        });
      } else {
        if (active) {
          setActive(false);
          setPosition({ x: 0, y: 0 });
        }
      }
    };

    const handleMouseLeave = () => {
      setActive(false);
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [strength, padding, active]);

  return (
    <div
      ref={elementRef}
      onMouseLeave={handleMouseLeave}
      className="magnet-wrapper"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: active ? "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)" : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform",
        display: "inline-block",
      }}
    >
      {children}
    </div>
  );
}
