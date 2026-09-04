"use client";
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#E4E3DE]/90 backdrop-blur-md border-b border-[#D0CFCA]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <a href="#" className="flex items-center font-satoshi font-black text-xl tracking-tight uppercase text-[#111111] hover:text-[#2355FC] transition-colors">
          <span>KROMA</span>
          <span className="text-[#2355FC] mx-0.5">//</span>
          <span className="font-mono text-sm tracking-widest text-[#111111]">STUDIO</span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs uppercase font-mono tracking-wider text-[#666666]">
          <span className="flex items-center gap-2 text-[#111111] bg-[#DCDBCF] px-3 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            JAKARTA — LIVE
          </span>
          <a href="#booth-machine" className="hover:text-[#2355FC] transition-colors">WEB BOOTH</a>
          <a href="#packages" className="hover:text-[#2355FC] transition-colors">PACKAGES</a>
          <a href="#architecture" className="hover:text-[#2355FC] transition-colors">SPECIFICATIONS</a>
          <a href="#reserve" className="hover:text-[#2355FC] transition-colors">CONTACT</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#booth-machine"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 border border-[#111111] rounded-full text-[#111111] hover:bg-[#111111] hover:text-[#E4E3DE] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            FREE WEB BOOTH
          </a>
          <a
            href="#reserve"
            className="text-xs font-mono font-bold uppercase tracking-wider px-5 py-2 bg-[#111111] text-[#E4E3DE] rounded-full hover:bg-[#2355FC] transition-all shadow-sm"
          >
            BOOK SESSION
          </a>
        </div>
      </div>
    </header>
  );
};
