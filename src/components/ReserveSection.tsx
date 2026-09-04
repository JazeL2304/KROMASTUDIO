"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PackageOption {
  id: string;
  name: string;
  duration: string;
  price: string;
  popular?: boolean;
}

const PACKAGE_OPTIONS: PackageOption[] = [
  {
    id: "01",
    name: "01. Mono High-Contrast",
    duration: "15 Mins • 2 Strips",
    price: "IDR 35.000",
  },
  {
    id: "02",
    name: "02. Silver Gelatin Film",
    duration: "25 Mins • 4 Strips",
    price: "IDR 50.000",
    popular: true,
  },
  {
    id: "03",
    name: "03. Architectural Strobe",
    duration: "35 Mins • 6 Strips + Softbox",
    price: "IDR 75.000",
  },
  {
    id: "04",
    name: "04. Editorial Dual-Spread",
    duration: "50 Mins • 10 Strips + VIP",
    price: "IDR 120.000",
  },
];

export const ReserveSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedPkg, setSelectedPkg] = useState<PackageOption>(PACKAGE_OPTIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Parallax zoom on the studio image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Smooth reveal of form container
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { autoAlpha: 0, x: 30 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="reserve"
      className="py-16 md:py-28 border-b border-[#D0CFCA] max-w-[1400px] mx-auto px-5 sm:px-8 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left 6 Cols: Architectural Studio Interior Photo with Parallax */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden border border-[#D0CFCA] relative shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
              alt="KROMA Studio Architectural Space"
              className="w-full h-full object-cover grayscale contrast-125 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#E5E7FF] bg-[#2355FC] px-2.5 py-1 rounded-full font-bold">
                PRIVATE STUDIO SUITE
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-satoshi text-base font-black uppercase text-[#111111] tracking-tight">
              CRAFT THE UNSEEN
            </h4>
            <p className="font-mono text-xs text-[#666666] mt-1 leading-relaxed">
              Minimal architectural space located in Senopati, South Jakarta. Zero crowd, complete acoustic privacy, pure focus.
            </p>
          </div>
        </div>

        {/* Right 6 Cols: Reserve Form */}
        <div ref={formRef} className="lg:col-span-6 flex flex-col opacity-0 will-change-transform">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2355FC] font-bold">
              05 / STUDIO BOOKING
            </span>
            <h2 className="text-3xl sm:text-4xl font-satoshi font-black uppercase tracking-tight mt-1 text-[#111111]">
              RESERVE A BOOTH
            </h2>
          </div>

          {submitted ? (
            <div className="bg-[#DCDBCF]/60 p-8 rounded-xl border border-[#D0CFCA] text-center space-y-4">
              <span className="material-symbols-outlined text-5xl text-[#2355FC]">
                check_circle
              </span>
              <h3 className="font-satoshi text-2xl font-black uppercase text-[#111111]">
                Reservation Confirmed
              </h3>
              <p className="font-mono text-xs text-[#666666] max-w-sm mx-auto">
                Thank you, {formData.name}. We have sent your studio session access pass for{" "}
                <strong className="text-[#111111]">{selectedPkg.name} ({selectedPkg.price})</strong> to{" "}
                <strong className="text-[#111111]">{formData.email}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#111111] text-[#E4E3DE] font-mono text-xs uppercase font-bold hover:bg-[#2355FC] transition-colors"
              >
                Book Another Slot
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#666666] font-bold block">
                  Your Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Adrian Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-[#111111] pb-2 pt-1 font-satoshi text-base text-[#111111] placeholder:text-[#666666]/50 rounded-none outline-none focus:border-[#2355FC] transition-colors"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#666666] font-bold block">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="hello@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-[#111111] pb-2 pt-1 font-satoshi text-base text-[#111111] placeholder:text-[#666666]/50 rounded-none outline-none focus:border-[#2355FC] transition-colors"
                />
              </div>

              {/* Custom High-End Editorial Dropdown Box */}
              <div className="space-y-1.5 relative" ref={dropdownRef}>
                <label className="text-xs font-mono uppercase text-[#666666] font-bold block">
                  Package Selection
                </label>

                {/* Custom Trigger Button */}
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-full bg-white/60 hover:bg-white border transition-all duration-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer select-none shadow-xs ${
                    dropdownOpen
                      ? "border-[#2355FC] ring-2 ring-[#2355FC]/20"
                      : "border-[#D0CFCA] hover:border-[#111111]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-satoshi text-sm sm:text-base font-black uppercase text-[#111111]">
                      {selectedPkg.name}
                    </span>
                    <span className="font-mono text-xs text-[#666666]">
                      ({selectedPkg.duration})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-[#111111] text-white px-2.5 py-1 rounded-md">
                      {selectedPkg.price}
                    </span>
                    <span
                      className={`material-symbols-outlined text-lg text-[#111111] transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180 text-[#2355FC]" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Custom Options Panel */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] text-white rounded-xl border border-[#333333] shadow-2xl p-2 z-50 animate-fadeIn divide-y divide-white/10">
                    {PACKAGE_OPTIONS.map((pkg) => {
                      const isSelected = selectedPkg.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => {
                            setSelectedPkg(pkg);
                            setDropdownOpen(false);
                          }}
                          className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "bg-[#2355FC] text-white font-bold"
                              : "hover:bg-white/10 text-neutral-200"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-satoshi text-sm font-black uppercase">
                                {pkg.name}
                              </span>
                              {pkg.popular && (
                                <span className="text-[9px] font-mono uppercase bg-white/20 px-1.5 py-0.5 rounded font-bold text-white">
                                  POPULAR
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[11px] opacity-75">
                              {pkg.duration}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold">
                              {pkg.price}
                            </span>
                            {isSelected && (
                              <span className="material-symbols-outlined text-[18px]">
                                check
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Preferred Date & Notes */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#666666] font-bold block">
                  Preferred Date &amp; Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saturday 15:00 WIB, Solo portrait"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-[#111111] pb-2 pt-1 font-satoshi text-base text-[#111111] placeholder:text-[#666666]/50 rounded-none outline-none focus:border-[#2355FC] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#111111] text-[#E4E3DE] rounded-full font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#2355FC] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>CONFIRM RESERVATION ({selectedPkg.price})</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
