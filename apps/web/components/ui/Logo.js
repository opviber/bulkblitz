import React from "react";

export default function Logo({ className = "w-8 h-8" }) {
  return (
    <svg 
      className={`${className} shadow-lg shadow-primary/25`} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Modern Orange-to-Peach Brand Gradient */}
        <linearGradient id="logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A00" />
          <stop offset="1" stopColor="#FF8C24" />
        </linearGradient>
      </defs>

      {/* Background Squircle */}
      <rect x="2" y="2" width="28" height="28" rx="8.5" fill="url(#logo-grad)" />

      {/* Creative Symbolic Design: Converging Group Lines into Lightning Bolt */}
      {/* 3 Horizontal Stack Lines (representing "Bulk" / multiple buyers) */}
      <path 
        d="M8 10h6M8 15h4M8 20h5" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        opacity="0.85"
      />

      {/* Dynamic Lightning Bolt (representing "Blitz" / fast group execution) */}
      <path 
        d="M20 6L13 16h5.5l-3.5 10 7-10h-5.5L20 6z" 
        fill="white" 
        stroke="white"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
