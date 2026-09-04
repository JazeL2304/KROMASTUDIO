"use client";
import React, { useState } from "react";

export const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    packageChoice: "01. Mono High-Contrast (B&W)",
    date: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 md:gap-24 border-b border-[#D0CFCA]">
      {/* Left: Intro */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#737373] mb-4 block">
            Reserve a Slot
          </span>
          <h2 className="font-satoshi text-4xl md:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-8 text-[#191B24]">
            STEP INTO<br />THE FRAME
          </h2>
          <p className="font-satoshi text-base md:text-lg text-[#737373] max-w-md leading-relaxed">
            Ready to document your raw aesthetic? Fill out the reservation form, and our studio coordinator will secure your time and lighting preset.
          </p>

          <div className="mt-8 pt-8 border-t border-[#D0CFCA] space-y-3 font-mono text-xs text-[#737373]">
            <p className="flex items-center gap-2">
              <span className="text-[#191B24] font-bold">STUDIO LOCATION:</span>
              Jl. Senopati No. 84, Kebayoran Baru, Jakarta Selatan
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#191B24] font-bold">OPERATING HOURS:</span>
              Tue – Sun: 10:00 — 21:00 WIB
            </p>
          </div>
        </div>

        <div className="mt-12 hidden md:block">
          <a
            href="#"
            className="font-mono text-xs uppercase tracking-wider border-b border-[#191B24] pb-1 hover:text-[#2355FC] hover:border-[#2355FC] transition-colors inline-flex items-center gap-2"
          >
            READ STUDIO GUIDELINES
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>

      {/* Right: Form */}
      <div className="md:w-1/2">
        {submitted ? (
          <div className="bg-[#DCDBCF] p-8 md:p-12 rounded-xl border border-[#D0CFCA] text-center">
            <span className="material-symbols-outlined text-5xl text-[#2355FC] mb-4">
              check_circle
            </span>
            <h3 className="font-satoshi text-2xl font-extrabold uppercase mb-2 text-[#191B24]">
              Session Requested
            </h3>
            <p className="font-mono text-xs text-[#737373] mb-6">
              Thank you, {formData.name || "Client"}. We have sent a confirmation email to{" "}
              <span className="text-[#191B24] font-bold">{formData.email || "your inbox"}</span>.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#191B24] text-white px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider hover:bg-[#2355FC] transition-colors"
            >
              Book Another Slot
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-[#737373] uppercase tracking-wider">
                Your Full Name *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.g. Adrian Vance"
                className="bg-transparent border-0 border-b border-[#191B24] pb-3 pt-1 focus:ring-0 focus:border-[#2355FC] font-satoshi text-base text-[#191B24] placeholder:text-[#737373]/50 rounded-none w-full outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-[#737373] uppercase tracking-wider">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="adrian@domain.com"
                className="bg-transparent border-0 border-b border-[#191B24] pb-3 pt-1 focus:ring-0 focus:border-[#2355FC] font-satoshi text-base text-[#191B24] placeholder:text-[#737373]/50 rounded-none w-full outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-[#737373] uppercase tracking-wider">
                Select Package
              </label>
              <select
                value={formData.packageChoice}
                onChange={(e) => setFormData({ ...formData, packageChoice: e.target.value })}
                className="bg-transparent border-0 border-b border-[#191B24] pb-3 pt-1 focus:ring-0 focus:border-[#2355FC] font-satoshi text-base text-[#191B24] rounded-none w-full outline-none transition-colors cursor-pointer"
              >
                <option value="01. Mono High-Contrast (B&W)">01. Mono High-Contrast (B&W) — IDR 350.000</option>
                <option value="02. Film Grain Simulation">02. Film Grain Simulation (Tri-X) — IDR 475.000</option>
                <option value="03. Editorial Flash & Strobe">03. Editorial Flash & Strobe — IDR 650.000</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-[#737373] uppercase tracking-wider">
                Session Details & Preferred Mood
              </label>
              <textarea
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Tell us about the mood, number of guests, or custom lighting requests..."
                className="bg-transparent border-0 border-b border-[#191B24] pb-3 pt-1 focus:ring-0 focus:border-[#2355FC] font-satoshi text-base text-[#191B24] placeholder:text-[#737373]/50 rounded-none w-full outline-none resize-none transition-colors"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#191B24] text-white px-8 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider hover:bg-[#2355FC] transition-all flex items-center gap-2 shadow-lg"
              >
                SUBMIT RESERVATION
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
