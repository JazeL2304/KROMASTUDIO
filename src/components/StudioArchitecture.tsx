"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export const StudioArchitecture: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  const specs = [
    {
      title: "WIRELESS SHUTTER CLICKER",
      desc: "Instant trigger for complete posing control",
    },
    {
      title: "ARCHITECTURAL STROBE SOFTBOXES",
      desc: "Balanced 5600K high-CRI continuous strobe lighting",
    },
    {
      title: "DNP DYE-SUBLIMATION PRINTER",
      desc: "Genuine 300-DPI archival chemistry prints in under 12 seconds",
    },
    {
      title: "AIRDROP & HIGH-RES CLOUD DELIVERY",
      desc: "Full-resolution TIFF and JPEG instant transfers",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row) => {
        if (!row) return;
        const title = row.querySelector(".spec-title");
        const desc = row.querySelector(".spec-desc");

        row.addEventListener("mouseenter", () => {
          gsap.to(title, { x: 8, color: "#2355FC", duration: 0.3, ease: "power2.out" });
          gsap.to(desc, { x: -4, color: "#111111", duration: 0.3, ease: "power2.out" });
        });

        row.addEventListener("mouseleave", () => {
          gsap.to(title, { x: 0, color: "#111111", duration: 0.3, ease: "power2.out" });
          gsap.to(desc, { x: 0, color: "#666666", duration: 0.3, ease: "power2.out" });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="architecture"
      className="py-16 md:py-24 border-b border-[#D0CFCA] max-w-[1400px] mx-auto px-5 sm:px-8 w-full"
    >
      <div className="mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-[#666666]">
          04 / STUDIO ARCHITECTURE
        </span>
        <h3 className="text-3xl sm:text-4xl font-satoshi font-black uppercase tracking-tight mt-1 text-[#111111]">
          STUDIO ARCHITECTURE
        </h3>
      </div>

      <div className="divide-y divide-[#D0CFCA] border-t border-[#D0CFCA]">
        {specs.map((item, idx) => (
          <div
            key={idx}
            ref={(el) => {
              rowsRef.current[idx] = el;
            }}
            className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-2 cursor-default px-3 -mx-3 transition-colors"
          >
            <span className="spec-title font-satoshi text-xl sm:text-2xl font-black uppercase text-[#111111]">
              {item.title}
            </span>
            <span className="spec-desc text-xs sm:text-sm font-mono text-[#666666]">
              {item.desc}
            </span>
          </div>
        ))}
        <div className="border-b border-[#D0CFCA]"></div>
      </div>
    </section>
  );
};
