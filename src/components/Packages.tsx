"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PackageItem {
  id: string;
  name: string;
  details: string;
  price: string;
  features: string[];
}

export const PACKAGES: PackageItem[] = [
  {
    id: "01",
    name: "MONO HIGH-CONTRAST",
    details: "15 Mins • 2 Archival Strips",
    price: "IDR 35.000",
    features: [
      "Private self-portrait room access",
      "Unlimited digital shutter exposures",
      "2x physical 300-DPI archival print strips",
      "Instant high-resolution digital QR download",
    ],
  },
  {
    id: "02",
    name: "SILVER GELATIN FILM",
    details: "25 Mins • 4 Archival Strips",
    price: "IDR 50.000",
    features: [
      "Kodak Tri-X & Ilford HP5 analog simulation",
      "4x physical 300-DPI archival print strips",
      "Custom Matte Noir / Warm Stone borders",
      "Raw uncompressed contact sheet digital scan",
    ],
  },
  {
    id: "03",
    name: "ARCHITECTURAL STROBE",
    details: "35 Mins • 6 Archival Strips + Softbox",
    price: "IDR 75.000",
    features: [
      "Balanced 5600K high-CRI continuous strobe lighting",
      "6x physical 300-DPI archival print strips",
      "Wardrobe changes permitted",
      "Full digital photo album transfer",
    ],
  },
  {
    id: "04",
    name: "EDITORIAL DUAL-SPREAD",
    details: "50 Mins • 10 Strips + Full Catalog",
    price: "IDR 120.000",
    features: [
      "Full studio exclusivity for up to 4 guests",
      "10x physical 300-DPI archival print strips",
      "Complete high-resolution digital catalog & GIF scans",
      "Priority instant photo processing & boxed envelope",
    ],
  },
];

export const Packages: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Staggered reveal of package rows on scroll
      gsap.fromTo(
        rowsRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="py-16 md:py-24 border-b border-[#D0CFCA] max-w-[1400px] mx-auto px-5 sm:px-8 w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#D0CFCA] gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#2355FC] font-bold">
            02 / CURATED SESSIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-satoshi font-black uppercase tracking-tight mt-1 text-[#111111]">
            SESSION ARCHIVE
          </h2>
        </div>
        <p className="text-xs font-mono text-[#666666] uppercase">
          ALL SESSIONS INCLUDE PRIVATE TIME &amp; ARCHIVAL PRINT CHECKS
        </p>
      </div>

      {/* Package Rows */}
      <div className="divide-y divide-[#D0CFCA] border-t border-[#D0CFCA]">
        {PACKAGES.map((pkg, idx) => {
          const isOpen = selectedId === pkg.id;
          return (
            <div
              key={pkg.id}
              ref={(el) => {
                rowsRef.current[idx] = el;
              }}
              onClick={() => setSelectedId(isOpen ? null : pkg.id)}
              className="py-7 px-3 -mx-3 group cursor-pointer hover:bg-[#DCDBCF]/40 transition-all duration-300 opacity-0 will-change-transform"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#111111] font-bold text-lg group-hover:text-[#2355FC] transition-colors">&bull;</span>
                  <h3 className="font-satoshi text-xl sm:text-2xl font-black uppercase text-[#111111] group-hover:text-[#2355FC] group-hover:translate-x-1.5 transition-all duration-300">
                    {pkg.name}
                  </h3>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono">
                  <span className="text-[#666666] uppercase hidden sm:block">
                    {pkg.details}
                  </span>
                  <span className="text-[#111111] font-bold text-sm bg-[#DCDBCF] px-3 py-1 rounded-full group-hover:bg-[#2355FC] group-hover:text-white transition-colors">
                    {pkg.price}
                  </span>
                  <span
                    className={`material-symbols-outlined text-xl text-[#111111] transition-transform duration-300 ${
                      isOpen ? "rotate-90 text-[#2355FC]" : "group-hover:translate-x-1"
                    }`}
                  >
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Accordion detail */}
              {isOpen && (
                <div className="mt-6 pt-6 border-t border-[#D0CFCA]/60 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#666666] mb-3 block">
                      Session Deliverables:
                    </span>
                    <ul className="space-y-2">
                      {pkg.features.map((item, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 font-mono text-xs text-[#111111]">
                          <span className="material-symbols-outlined text-[16px] text-[#2355FC]">
                            check_circle
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-end items-start md:items-end gap-3">
                    <p className="font-mono text-xs text-[#666666]">
                      Instant confirmation &bull; Acoustic isolation
                    </p>
                    <a
                      href="#reserve"
                      className="inline-flex items-center gap-2 bg-[#111111] text-[#E4E3DE] px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider hover:bg-[#2355FC] hover:scale-105 active:scale-95 transition-all"
                    >
                      Reserve {pkg.name}
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div className="border-b border-[#D0CFCA]"></div>
      </div>
    </section>
  );
};
