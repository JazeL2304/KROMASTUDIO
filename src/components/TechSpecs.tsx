"use client";
import React from "react";

export const TechSpecs: React.FC = () => {
  const specs = [
    { title: "Automatic Sequencer", tag: "3-SHOT BURST", desc: "Automated 3-pose timing with audible cue and synced flash capture." },
    { title: "Physical Print Styler", tag: "2x6 STANDARD", desc: "True-to-scale photobooth strips with 300-DPI archival chemistry." },
    { title: "Hardware Optical Flash", tag: "SCREEN & STROBE ILLUMINATION", desc: "High-contrast dynamic range tailored for pure black and white separation." },
    { title: "100% Client Privacy", tag: "CLIENT-SIDE ONLY", desc: "Browser simulator processes zero images on external servers." },
  ];

  return (
    <section id="specs" className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto w-full border-b border-[#D0CFCA]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 bg-[#2355FC] rounded-full"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#737373]">
              Hardware & Software
            </span>
          </div>
          <h2 className="font-satoshi text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#191B24]">
            SYSTEM SPECS
          </h2>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {specs.map((item, index) => (
          <div
            key={index}
            className="hairline-top py-8 px-4 -mx-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-[#DCDBCF]/40 transition-colors"
          >
            <div className="flex flex-col">
              <h3 className="font-satoshi text-2xl md:text-3xl font-bold uppercase text-[#191B24]">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-[#737373] mt-1">{item.desc}</p>
            </div>
            <span className="font-mono text-xs font-bold text-[#2355FC] bg-[#DCDBCF] px-4 py-1.5 rounded-full self-start md:self-auto uppercase">
              {item.tag}
            </span>
          </div>
        ))}
        <div className="hairline-bottom w-full"></div>
      </div>
    </section>
  );
};
