"use client";

import { useEffect, useState } from "react";

interface AnimatedLine {
  id: number;
  yPosition: number;
  duration: number;
  delay: number;
  height: number;
  opacity: number;
}

export default function HeroBlockAnimation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const animatedLines: AnimatedLine[] = isMobile
    ? [
        {
          id: 1,
          yPosition: 15,
          duration: 12,
          delay: 0,
          height: 3,
          opacity: 0.25,
        },
        {
          id: 2,
          yPosition: 35,
          duration: 14,
          delay: 2,
          height: 4,
          opacity: 0.2,
        },
        {
          id: 3,
          yPosition: 55,
          duration: 13,
          delay: 4,
          height: 2.5,
          opacity: 0.3,
        },
        {
          id: 4,
          yPosition: 75,
          duration: 15,
          delay: 6,
          height: 3.5,
          opacity: 0.22,
        },
      ]
    : [
        {
          id: 1,
          yPosition: 10,
          duration: 12,
          delay: 0,
          height: 3,
          opacity: 0.28,
        },
        {
          id: 2,
          yPosition: 22,
          duration: 14,
          delay: 1.5,
          height: 4,
          opacity: 0.22,
        },
        {
          id: 3,
          yPosition: 35,
          duration: 13,
          delay: 3,
          height: 2.5,
          opacity: 0.3,
        },
        {
          id: 4,
          yPosition: 48,
          duration: 15,
          delay: 4.5,
          height: 3.5,
          opacity: 0.25,
        },
        {
          id: 5,
          yPosition: 62,
          duration: 16,
          delay: 6,
          height: 3,
          opacity: 0.2,
        },
        {
          id: 6,
          yPosition: 78,
          duration: 14.5,
          delay: 7.5,
          height: 4,
          opacity: 0.26,
        },
        {
          id: 7,
          yPosition: 88,
          duration: 13.5,
          delay: 9,
          height: 2.8,
          opacity: 0.24,
        },
      ];

  const primaryColor = "#00bf63";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        className="absolute w-full h-full"
        preserveAspectRatio="none"
      >
        {animatedLines.map((line) => (
          <g key={line.id}>
            <rect
              x="-20"
              y={line.yPosition}
              width="15"
              height={line.height}
              fill={primaryColor}
              opacity={line.opacity}
              rx="0.5"
            >
              <animate
                attributeName="x"
                from="-20"
                to="105"
                dur={`${line.duration}s`}
                begin={`${line.delay}s`}
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x="-20"
              y={line.yPosition}
              width="8"
              height={line.height}
              fill={primaryColor}
              opacity={line.opacity * 0.5}
              rx="0.5"
            >
              <animate
                attributeName="x"
                from="-20"
                to="105"
                dur={`${line.duration}s`}
                begin={`${line.delay + line.duration * 0.4}s`}
                repeatCount="indefinite"
              />
            </rect>
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-transparent pointer-events-none" />
    </div>
  );
}
