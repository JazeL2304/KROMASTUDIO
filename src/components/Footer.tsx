"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const watermarkRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = footerRef.current;
    const watermark = watermarkRef.current;
    if (!el || !watermark) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        watermark,
        { scale: 0.9, autoAlpha: 0.3, y: 30 },
        {
          scale: 1,
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#DCDBCF] border-t border-[#D0CFCA] pt-14 pb-10 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* 4 Metadata Columns with equal symmetrical spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 text-xs font-mono uppercase text-[#666666]">
          <div>
            <span className="text-[#111111] font-bold block mb-2">LOCATION</span>
            <p className="leading-relaxed">JL. SENOPATI NO. 42<br />JAKARTA SELATAN, 12190</p>
          </div>
          <div>
            <span className="text-[#111111] font-bold block mb-2">HOURS</span>
            <p className="leading-relaxed">TUE — SUN: 10:00 — 22:00<br />MONDAY: DARKROOM MAINTENANCE</p>
          </div>
          <div>
            <span className="text-[#111111] font-bold block mb-2">CONTACT</span>
            <p className="leading-relaxed">CONCIERGE@KROMA.STUDIO<br />+62 812 0000 3929</p>
          </div>
          <div>
            <span className="text-[#111111] font-bold block mb-2">DISCIPLINE</span>
            <p className="leading-relaxed">AUTOMATED DARKROOM<br />PHYSICAL FINE ART PRINTS</p>
          </div>
        </div>

        {/* Giant Watermark Typography - Perfectly Centered & Animated */}
        <div className="border-t border-[#D0CFCA] pt-8 pb-4 w-full flex items-center justify-center">
          <h2
            ref={watermarkRef}
            className="font-satoshi font-black text-[clamp(2.2rem,8.6vw,7.6rem)] leading-none text-[#7A796E] tracking-tight select-none uppercase whitespace-nowrap text-center w-full will-change-transform opacity-0"
          >
            KROMA.STUDIO
          </h2>
        </div>

        {/* Bottom Bar with equal symmetrical margins */}
        <div className="mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-[#666666] tracking-wider gap-3">
          <span>&copy; {new Date().getFullYear()} KROMA STUDIO. ALL RIGHTS RESERVED.</span>
          <span>DESIGNED FOR FRONTEND SHOWCASE.</span>
        </div>
      </div>
    </footer>
  );
};
