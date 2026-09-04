"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MarqueeProps {
  text?: string[];
  speed?: number;
  reverse?: boolean;
}

export const MarqueeTicker: React.FC<MarqueeProps> = ({
  text = [
    "ARCHITECTURAL MONOCHROME",
    "300-DPI ARCHIVAL CHEMISTRY",
    "NO OPERATOR PRIVACY",
    "IN-BROWSER PHOTO ENGINE",
    "JAKARTA SELATAN",
    "2X6 PHYSICAL STRIPS",
  ],
  speed = 25,
  reverse = false,
}) => {
  const tickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const direction = reverse ? 1 : -1;
      gsap.to(el, {
        xPercent: direction * 50,
        repeat: -1,
        duration: speed,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, [speed, reverse]);

  return (
    <div className="w-full overflow-hidden py-3 bg-[#111111] text-[#E4E3DE] border-y border-[#D0CFCA]/30 select-none">
      <div ref={tickerRef} className="flex whitespace-nowrap will-change-transform">
        {[...Array(4)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex items-center gap-8 shrink-0 pr-8">
            {text.map((item, idx) => (
              <span key={idx} className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest font-bold">
                <span>{item}</span>
                <span className="text-[#2355FC] text-sm">&bull;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
