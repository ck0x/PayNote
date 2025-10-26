"use client";

import { useEffect, useState } from "react";

interface AnimatedBlock {
  id: number;
  yPosition: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
}

export default function HeroBlockAnimation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categoryColors = [
    "#FDE68A", // Personal - Yellow
    "#BFDBFE", // Operations - Blue
    "#FCA5A5", // Payroll - Red
    "#C4B5FD", // Research & Development - Purple
    "#6EE7B7", // Customer - Green
  ];

  const animatedBlocks: AnimatedBlock[] = isMobile
    ? [
        {
          id: 1,
          yPosition: 15,
          duration: 12,
          delay: 0,
          size: 4,
          color: categoryColors[0],
        },
        {
          id: 2,
          yPosition: 35,
          duration: 14,
          delay: 2,
          size: 4,
          color: categoryColors[1],
        },
        {
          id: 3,
          yPosition: 55,
          duration: 13,
          delay: 4,
          size: 4,
          color: categoryColors[2],
        },
        {
          id: 4,
          yPosition: 75,
          duration: 15,
          delay: 6,
          size: 4,
          color: categoryColors[3],
        },
      ]
    : [
        {
          id: 1,
          yPosition: 10,
          duration: 12,
          delay: 0,
          size: 4,
          color: categoryColors[0],
        },
        {
          id: 2,
          yPosition: 22,
          duration: 14,
          delay: 1.5,
          size: 4,
          color: categoryColors[1],
        },
        {
          id: 3,
          yPosition: 35,
          duration: 13,
          delay: 3,
          size: 4,
          color: categoryColors[2],
        },
        {
          id: 4,
          yPosition: 48,
          duration: 15,
          delay: 4.5,
          size: 4,
          color: categoryColors[3],
        },
        {
          id: 5,
          yPosition: 62,
          duration: 16,
          delay: 6,
          size: 4,
          color: categoryColors[4],
        },
        {
          id: 6,
          yPosition: 78,
          duration: 14.5,
          delay: 7.5,
          size: 4,
          color: categoryColors[0],
        },
        {
          id: 7,
          yPosition: 88,
          duration: 13.5,
          delay: 9,
          size: 4,
          color: categoryColors[1],
        },
      ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        className="absolute w-full h-full"
        preserveAspectRatio="none"
      >
        {animatedBlocks.map((block) => (
          <g key={block.id}>
            <rect
              x="-10"
              y={block.yPosition}
              width={block.size}
              height={block.size}
              fill={block.color}
              opacity="0.35"
              rx="0.5"
            >
              <animate
                attributeName="x"
                from="-10"
                to="105"
                dur={`${block.duration}s`}
                begin={`${block.delay}s`}
                repeatCount="indefinite"
              />
            </rect>

            <rect
              x="-10"
              y={block.yPosition}
              width={block.size}
              height={block.size}
              fill={categoryColors[(block.id + 2) % categoryColors.length]}
              opacity="0.25"
              rx="0.5"
            >
              <animate
                attributeName="x"
                from="-10"
                to="105"
                dur={`${block.duration}s`}
                begin={`${block.delay + block.duration * 0.4}s`}
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x="-10"
              y={block.yPosition}
              width={block.size}
              height={block.size}
              fill={categoryColors[(block.id + 4) % categoryColors.length]}
              opacity="0.2"
              rx="0.5"
            >
              <animate
                attributeName="x"
                from="-10"
                to="105"
                dur={`${block.duration}s`}
                begin={`${block.delay + block.duration * 0.7}s`}
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
