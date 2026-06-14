"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function RevealChar({ item, totalChars, scrollYProgress }) {
  const start = item.idx / totalChars;
  const end = (item.idx + 1) / totalChars;

  const opacity = useTransform(
    scrollYProgress,
    [start, end],
    [0.2, 1]
  );

  return (
    <span
      className="scroll-char"
      style={{
        position: "relative",
        display: "inline-block"
      }}
    >
      <span style={{ opacity: 0.15 }}>{item.char}</span>
      <motion.span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity,
          color: "inherit",
        }}
      >
        {item.char}
      </motion.span>
    </span>
  );
}

export default function ScrollRevealText({ text, className }) {
  const containerRef = useRef(null);
  
  // Track scroll position of this text block
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  
  // Pre-calculate indexes for correct character mappings
  let charCounter = 0;
  const splitWords = words.map((word) => {
    const letters = word.split("");
    const mappedLetters = letters.map((char) => {
      const idx = charCounter;
      charCounter++;
      return { char, idx };
    });
    return mappedLetters;
  });

  const totalChars = charCounter;

  return (
    <span ref={containerRef} className={className} style={{ display: "inline-block" }}>
      {splitWords.map((letters, wordIdx) => (
        <span 
          key={wordIdx} 
          className="scroll-word"
          style={{ 
            display: "inline-block", 
            marginRight: "0.22em",
            whiteSpace: "nowrap" 
          }}
        >
          {letters.map((item) => (
            <RevealChar
              key={item.idx}
              item={item}
              totalChars={totalChars}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </span>
      ))}
    </span>
  );
}
