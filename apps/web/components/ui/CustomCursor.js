"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [badgeText, setBadgeText] = useState("");
  const cursorRef = useRef(null);

  useEffect(() => {
    // Check if it's a mobile/touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setVisible(true);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isHoverable = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.classList.contains("card") ||
        target.closest(".card") ||
        target.classList.contains("chip") ||
        target.closest(".chip");

      if (isHoverable) {
        setHovered(true);
        // Custom badges based on roles
        const textAttr = target.getAttribute("data-cursor");
        if (textAttr) {
          setBadgeText(textAttr);
        } else if (target.closest(".card")) {
          setBadgeText("VIEW");
        } else {
          setBadgeText("");
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (!target) return;

      const relatedTarget = e.relatedTarget;
      if (!relatedTarget || (!relatedTarget.closest("a") && !relatedTarget.closest("button") && !relatedTarget.closest(".card") && !relatedTarget.closest(".chip"))) {
        setHovered(false);
        setBadgeText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${hovered ? "custom-cursor--hovered" : ""}`}
        style={{
          transform: `translate3d(${position.x - 10}px, ${position.y - 10}px, 0)`,
        }}
      >
        {badgeText && <span className="custom-cursor__badge">{badgeText}</span>}
      </div>

      <style jsx global>{`
        /* Hide default cursor only when custom cursor is active */
        @media (min-width: 1024px) {
          body, a, button, select, input, textarea, .card, .chip {
            cursor: none !important;
          }
        }

        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 18px;
          height: 18px;
          background: rgba(255, 106, 0, 0.05);
          border: 1.5px solid var(--primary, #FF6A00);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          transform: translate3d(0, 0, 0);
          will-change: transform;
          transition: width 0.2s ease-out, 
                      height 0.2s ease-out, 
                      background-color 0.2s ease-out, 
                      border-color 0.2s ease-out, 
                      border-radius 0.2s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .custom-cursor--hovered {
          width: 50px;
          height: 50px;
          background: rgba(255, 106, 0, 0.15);
          border-color: var(--primary, #FF6A00);
          box-shadow: 0 0 15px rgba(255, 106, 0, 0.3);
        }

        .custom-cursor__badge {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--text-primary, #FFFFFF);
          text-transform: uppercase;
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </>
  );
}
